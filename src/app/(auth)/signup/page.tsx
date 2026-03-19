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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          company_name: data.companyName,
          phone: data.phone,
        },
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-vortt-charcoal flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-vortt-orange flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="font-heading font-bold text-2xl text-white tracking-tight">VORTT</span>
        </div>

        <h1 className="font-heading font-bold text-white text-3xl mb-2">Get started</h1>
        <p className="text-zinc-400 mb-8">Set up your HVAC operations platform</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="[&_input]:bg-zinc-800 [&_input]:border-zinc-700 [&_input]:text-white [&_input]:placeholder:text-zinc-500 [&_label]:text-zinc-300">
            <Input
              label="Company Name"
              placeholder="Smith HVAC Services"
              error={errors.companyName?.message}
              {...register("companyName")}
            />
          </div>
          <div className="[&_input]:bg-zinc-800 [&_input]:border-zinc-700 [&_input]:text-white [&_input]:placeholder:text-zinc-500 [&_label]:text-zinc-300">
            <Input
              label="Email"
              type="email"
              placeholder="you@yourcompany.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div className="[&_input]:bg-zinc-800 [&_input]:border-zinc-700 [&_input]:text-white [&_input]:placeholder:text-zinc-500 [&_label]:text-zinc-300">
            <Input
              label="Phone"
              type="tel"
              placeholder="(555) 000-0000"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
          <div className="[&_input]:bg-zinc-800 [&_input]:border-zinc-700 [&_input]:text-white [&_input]:placeholder:text-zinc-500 [&_label]:text-zinc-300">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-vortt-red/40 rounded-xl px-4 py-3">
              <p className="text-vortt-red text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-vortt-orange font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
