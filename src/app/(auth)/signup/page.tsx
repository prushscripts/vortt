"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  companyName: z.string().min(2, "Company name required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
});
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { company_name: data.companyName, phone: data.phone } },
    });
    if (error) { setError(error.message); return; }
    await fetch("/api/auth/company", { method: "POST" });
    router.push("/pricing");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#080809" }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FF6B2B" }}>
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-heading font-bold text-xl text-[#F8F8FA] tracking-tight">VORTT</span>
        </div>

        <h1 className="font-heading font-bold text-[#F8F8FA] text-2xl mb-1">Get started</h1>
        <p className="text-sm text-[rgba(248,248,250,0.45)] mb-8">Set up your HVAC operations platform</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Company Name" placeholder="Smith HVAC Services" error={errors.companyName?.message} {...register("companyName")} />
          <Input label="Email" type="email" placeholder="you@yourcompany.com" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" type="tel" placeholder="(555) 000-0000" error={errors.phone?.message} {...register("phone")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />

          {error && (
            <div className="px-4 py-3 rounded-[10px] text-sm text-[#F43F5E]" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
              {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={isSubmitting}>Create Account</Button>
        </form>

        <p className="text-center text-sm text-[rgba(248,248,250,0.38)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF6B2B] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
