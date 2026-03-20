"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
    if (error) { setError(error.message); return; }
    setSigningIn(true);
    setShowLoader(true);
    window.setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1800);
  };

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

          <h1 className="font-heading text-[28px] font-bold text-[#F5F5F7] mb-1">Welcome back</h1>
          <p className="text-sm text-[#8E8E93] mb-8">Sign in to your operations dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              disabled={isSubmitting || signingIn}
              className="mt-2 h-12 w-full rounded-[10px] border-none bg-[#FF6B2B] font-heading text-[15px] font-bold text-white transition-colors hover:bg-[#FF5A1A] disabled:opacity-70"
              style={{ opacity: signingIn ? 0.8 : 1 }}
            >
              {signingIn ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Signing in...
                </span>
              ) : isSubmitting ? (
                "Signing In..."
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#8E8E93]">
            No account?{" "}
            <Link href="/signup" className="text-[#FF6B2B] font-medium hover:underline">Get started</Link>
          </p>
        </div>
      </section>

      {/* Loading Screen */}
      {showLoader && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#0E0E10',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 32,
          animation: 'fadeIn 0.3s ease',
        }}>
          {/* Logo */}
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: '#FF6B2B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(255,107,43,0.5)',
              animation: 'glowPulse 1.5s ease-in-out infinite',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span style={{
              fontFamily: 'Space Grotesk', fontWeight: 800,
              fontSize: 32, color: '#F5F5F7', letterSpacing: '-0.02em',
            }}>VORTT</span>
          </div>

          {/* Animated bars */}
          <div style={{display:'flex', gap:6, alignItems:'flex-end', height:32}}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width: 4, borderRadius: 2,
                background: i === 2 ? '#FF6B2B' : 'rgba(255,107,43,0.3)',
                animation: `barBounce 1s ease-in-out infinite`,
                animationDelay: `${i * 0.12}s`,
                height: 16 + i * 4,
              }}/>
            ))}
            {[3,2,1,0].map(i => (
              <div key={`r${i}`} style={{
                width: 4, borderRadius: 2,
                background: i === 2 ? '#FF6B2B' : 'rgba(255,107,43,0.3)',
                animation: `barBounce 1s ease-in-out infinite`,
                animationDelay: `${(9-i) * 0.12}s`,
                height: 16 + i * 4,
              }}/>
            ))}
          </div>

          <p style={{
            color: 'var(--text-muted)', fontSize: 13,
            fontFamily: 'Space Grotesk', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>Loading your dashboard...</p>
        </div>
      )}
    </div>
  );
}
