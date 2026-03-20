"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vortt.vercel.app";
const EMAIL_REDIRECT = `${SITE_URL}/dashboard`;

const schema = z.object({
  companyName: z.string().min(2, "Company name required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
});
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: EMAIL_REDIRECT,
        data: { company_name: data.companyName, phone: data.phone },
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSubmittedEmail(data.email);
    setSignupSuccess(true);
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-[#0E0E10] md:flex">
        <aside
          className="hidden md:flex md:w-[45%] flex-col justify-between p-12"
          style={{
            background: "linear-gradient(135deg, #1C1C1F 0%, #0E0E10 100%)",
            borderRight: "1px solid #2A2A2E",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#FF6B2B]">
              <Zap className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-heading font-bold text-[20px] text-[#F5F5F7] tracking-tight">VORTT</span>
          </div>
          <div>
            <h2 className="font-heading text-[36px] leading-[1.2] font-bold text-[#F5F5F7]">Run your shop smarter.</h2>
            <p className="mt-3 text-[16px] text-[#8E8E93]">
              AI dispatch, job tracking, and contract management - built for HVAC contractors.
            </p>
          </div>
          <p className="text-sm text-[#8E8E93]">Trusted by HVAC contractors across the US</p>
        </aside>

        <section className="relative flex w-full md:w-[55%] items-center justify-center bg-[#0E0E10] p-8">
          <div
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,107,43,0.10) 0%, rgba(255,107,43,0.04) 40%, transparent 70%)",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
              pointerEvents: "none",
              animation: "orbPulse 6s ease-in-out infinite",
            }}
          />
          <div
            className="relative z-10 w-full max-w-[420px]"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: 32,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(48,209,88,0.12)",
                border: "1px solid rgba(48,209,88,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "fadeIn 0.4s ease",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, 'Space Grotesk')", fontWeight: 700, fontSize: 24, color: "var(--text-primary)", margin: 0 }}>
                Account created!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 8, lineHeight: 1.5 }}>
                We sent a confirmation email to<br />
                <strong style={{ color: "var(--text-primary)" }}>{submittedEmail}</strong>
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 12 }}>
                Click the link in the email to activate your account,<br />then sign in below.
              </p>
            </div>

            <Link
              href="/login"
              style={{
                display: "block",
                width: "100%",
                height: 48,
                background: "var(--orange)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk')",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                textDecoration: "none",
                lineHeight: "48px",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Go to Sign In
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] md:flex">
      <aside
        className="hidden md:flex md:w-[45%] flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #1C1C1F 0%, #0E0E10 100%)",
          borderRight: "1px solid #2A2A2E",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#FF6B2B]">
            <Zap className="h-4 w-4 text-white" fill="white" />
          </div>
          <span className="font-heading font-bold text-[20px] text-[#F5F5F7] tracking-tight">VORTT</span>
        </div>

        <div>
          <h2 className="font-heading text-[36px] leading-[1.2] font-bold text-[#F5F5F7]">
            Run your shop smarter.
          </h2>
          <p className="mt-3 text-[16px] text-[#8E8E93]">
            AI dispatch, job tracking, and contract management - built for HVAC contractors.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "AI assigns the right tech to every job",
              "One-tap SMS to techs and customers",
              "Maintenance contract renewal on autopilot",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm text-[#8E8E93]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-[#8E8E93]">Trusted by HVAC contractors across the US</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full bg-[#2A2A2E] text-[11px] text-[#F5F5F7] flex items-center justify-center">JT</div>
              <div className="h-7 w-7 rounded-full bg-[#2E3642] text-[11px] text-[#F5F5F7] flex items-center justify-center">MG</div>
              <div className="h-7 w-7 rounded-full bg-[#40332A] text-[11px] text-[#F5F5F7] flex items-center justify-center">RC</div>
            </div>
            <span className="text-[13px] text-[#8E8E93]">Join 200+ contractors</span>
          </div>
        </div>
      </aside>

      <section className="relative flex w-full md:w-[55%] items-center justify-center bg-[#0E0E10] p-8">
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,43,0.10) 0%, rgba(255,107,43,0.04) 40%, transparent 70%)",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            pointerEvents: "none",
            animation: "orbPulse 6s ease-in-out infinite",
          }}
        />
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="mb-10 flex items-center justify-center gap-2.5 md:hidden">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#FF6B2B]">
              <Zap className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-heading font-bold text-[20px] text-[#F5F5F7] tracking-tight">VORTT</span>
          </div>

          <h1 className="font-heading text-[28px] font-bold text-[#F5F5F7] mb-1">Create your account</h1>
          <p className="text-sm text-[#8E8E93] mb-8">Start your 14-day free trial. No credit card required.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-[#48484A]">Company Name</label>
              <input
                type="text"
                placeholder="Smith HVAC Services"
                {...register("companyName")}
                className="h-12 w-full rounded-[10px] border border-[#2A2A2E] bg-[#161618] px-4 text-[15px] text-[#F5F5F7] outline-none focus:border-[#FF6B2B] focus:shadow-[0_0_0_3px_rgba(255,107,43,0.12)]"
              />
              {errors.companyName?.message ? <p className="mt-1 text-xs text-[#F43F5E]">{errors.companyName.message}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-[#48484A]">Email</label>
              <input
                type="email"
                placeholder="you@yourcompany.com"
                {...register("email")}
                className="h-12 w-full rounded-[10px] border border-[#2A2A2E] bg-[#161618] px-4 text-[15px] text-[#F5F5F7] outline-none focus:border-[#FF6B2B] focus:shadow-[0_0_0_3px_rgba(255,107,43,0.12)]"
              />
              {errors.email?.message ? <p className="mt-1 text-xs text-[#F43F5E]">{errors.email.message}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-[#48484A]">Phone</label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                {...register("phone")}
                className="h-12 w-full rounded-[10px] border border-[#2A2A2E] bg-[#161618] px-4 text-[15px] text-[#F5F5F7] outline-none focus:border-[#FF6B2B] focus:shadow-[0_0_0_3px_rgba(255,107,43,0.12)]"
              />
              {errors.phone?.message ? <p className="mt-1 text-xs text-[#F43F5E]">{errors.phone.message}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-[#48484A]">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-12 w-full rounded-[10px] border border-[#2A2A2E] bg-[#161618] px-4 text-[15px] text-[#F5F5F7] outline-none focus:border-[#FF6B2B] focus:shadow-[0_0_0_3px_rgba(255,107,43,0.12)]"
              />
              {errors.password?.message ? <p className="mt-1 text-xs text-[#F43F5E]">{errors.password.message}</p> : null}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-[10px] text-sm text-[#F43F5E]" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-[10px] border-none bg-[#FF6B2B] font-heading text-[15px] font-bold text-white transition-colors hover:bg-[#FF5A1A] disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Start Free Trial"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#8E8E93]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF6B2B] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
