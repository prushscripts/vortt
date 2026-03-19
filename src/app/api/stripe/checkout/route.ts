import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { priceId, companyId, email } = await req.json();
  if (!priceId || !companyId || !email) {
    return NextResponse.json({ error: "priceId, companyId, email required" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?subscribed=true`,
    cancel_url: `${appUrl}/pricing`,
    customer_email: email,
    metadata: { companyId },
    subscription_data: {
      trial_period_days: 14,
      metadata: { companyId },
    },
  });

  return NextResponse.json({ url: session.url });
}
