"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanyId } from "@/hooks/useCompanyId";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    name: "Starter",
    price: 199,
    trucks: "1-3 trucks",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    features: ["Unlimited jobs", "AI dispatch", "SMS notifications", "3 techs"],
  },
  {
    name: "Pro",
    price: 349,
    trucks: "4-8 trucks",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    popular: true,
    features: ["Everything in Starter", "8 techs", "Invoice PDF", "Contract renewal AI"],
  },
  {
    name: "Fleet",
    price: 599,
    trucks: "9-15 trucks",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FLEET,
    features: ["Everything in Pro", "Unlimited techs", "Priority support", "Custom integrations"],
  },
];

export default function PricingPage() {
  const { companyId } = useCompanyId();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const startTrial = async (planName: string, priceId?: string) => {
    if (!priceId || !companyId) return;
    setLoadingPlan(planName);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, companyId, email: user?.email }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoadingPlan(null);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">Choose your plan</h1>
        <p className="text-[var(--text-secondary)] mb-8">14-day free trial. Cancel anytime.</p>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[20px] border bg-[var(--bg-surface)] p-7 relative ${
                plan.popular ? "border-2 border-[var(--orange)]" : "border-[var(--bg-border)]"
              }`}
            >
              {plan.popular ? (
                <span className="absolute right-0 top-0 rounded-bl-[10px] rounded-tr-[20px] bg-[var(--orange)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              ) : null}

              <h2 className="font-heading text-2xl font-bold">{plan.name}</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{plan.trucks}</p>
              <p className="mt-4">
                <span className="font-heading text-5xl font-bold">${plan.price}</span>
                <span className="text-[var(--text-secondary)]">/mo</span>
              </p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                    <span className="text-[var(--green)]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startTrial(plan.name, plan.priceId)}
                className={`mt-6 h-12 w-full rounded-[10px] font-semibold ${
                  plan.popular
                    ? "bg-[var(--orange)] text-white"
                    : "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--bg-border)]"
                }`}
              >
                {loadingPlan === plan.name ? "Redirecting..." : "Start Free Trial"}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
