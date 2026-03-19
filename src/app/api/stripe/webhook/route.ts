import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const companyId = session.metadata?.companyId;
    if (companyId) {
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

      let plan = "starter";
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        const priceId = sub.items.data[0]?.price?.id;
        const map: Record<string, string> = {
          [process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? ""]: "starter",
          [process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? ""]: "pro",
          [process.env.NEXT_PUBLIC_STRIPE_PRICE_FLEET ?? ""]: "fleet",
        };
        if (priceId && map[priceId]) plan = map[priceId];
      }

      await prisma.company.update({
        where: { id: companyId },
        data: {
          stripeCustomerId: customerId ?? null,
          stripeSubscriptionId: subId ?? null,
          plan,
          subscriptionStatus: "active",
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await prisma.company.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { subscriptionStatus: "cancelled" },
    });
  }

  return NextResponse.json({ received: true });
}
