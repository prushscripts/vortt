"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Camera, Upload, Sparkles, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/format";
import { useCompanyId } from "@/hooks/useCompanyId";
import type { QuoteResult } from "@/types";

const schema = z.object({
  customerId: z.string().min(1, "Customer required"),
  jobType: z.enum(["maintenance", "repair", "install", "emergency"]),
  priority: z.enum(["emergency", "high", "normal"]),
  scheduledAt: z.string().optional(),
  description: z.string().optional(),
  totalAmount: z.string().optional(),
  techId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// Mock customers for demo
const mockCustomers = [
  { value: "1", label: "Maria Gonzalez — 1420 Oak Street" },
  { value: "2", label: "James Whitfield — 892 Riverside Dr" },
  { value: "3", label: "Sandra Kim — 3341 Burnet Rd" },
];

const mockTechs = [
  { value: "", label: "Unassigned" },
  { value: "t1", label: "Jake Torres" },
  { value: "t2", label: "Marcus Webb" },
  { value: "t3", label: "Devon Hall" },
  { value: "t4", label: "Riley Chen" },
];

export default function NewJobPage() {
  const { companyId, loading: companyLoading } = useCompanyId();
  const router = useRouter();
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteAdjusted, setQuoteAdjusted] = useState<Partial<QuoteResult> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobType: "repair",
      priority: "normal",
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const runPhotoQuote = async () => {
    if (!photoPreview) return;
    setQuoteLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoBase64: photoPreview }),
      });
      if (!res.ok) throw new Error("Quote failed");
      const data = await res.json();
      setQuoteResult(data);
      setQuoteAdjusted(data);
      if (data.notes) setValue("description", `${data.likelyIssue}. ${data.notes}`);
      setValue("jobType", data.serviceType?.includes("maintenance") ? "maintenance" : "repair");
    } catch {
      setError("AI quote failed. You can still enter details manually.");
    } finally {
      setQuoteLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setError("");
    if (!companyId) {
      setError("Loading company… try again in a moment.");
      return;
    }
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          companyId,
          totalAmount: data.totalAmount ? parseFloat(data.totalAmount) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/jobs");
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  const displayQuote = quoteAdjusted ?? quoteResult;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/jobs">
          <button className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-2xl text-vortt-charcoal">New Job</h1>
          <p className="text-zinc-500 text-sm">Schedule a service call</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Photo-to-Quote */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vortt-orange" />
              <CardTitle>AI Photo Quote</CardTitle>
            </div>
            <span className="text-xs text-zinc-400">Optional</span>
          </CardHeader>
          <p className="text-sm text-zinc-500 mb-3">
            Snap a photo of the unit — AI will diagnose and suggest a quote range.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {!photoPreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-vortt-orange hover:bg-orange-50 transition-all"
            >
              <Camera className="w-8 h-8 text-zinc-300" />
              <span className="text-sm text-zinc-400 font-medium">Take or upload photo</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden h-48">
                <img src={photoPreview} alt="Equipment" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(null); setQuoteResult(null); setQuoteAdjusted(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                >
                  Remove
                </button>
              </div>
              {!quoteResult && (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={runPhotoQuote}
                  loading={quoteLoading}
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze with AI
                </Button>
              )}
            </div>
          )}

          {/* Quote Result Card */}
          {displayQuote && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading font-bold text-vortt-charcoal">
                    {displayQuote.equipmentType}
                  </p>
                  <p className="text-xs text-zinc-500">Est. age: {displayQuote.estimatedAge}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-lg text-vortt-orange">
                    ${displayQuote.quoteLow?.toLocaleString()} – ${displayQuote.quoteHigh?.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500">{displayQuote.durationHours}h est.</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-600 mb-1">Likely Issue</p>
                <p className="text-sm text-vortt-charcoal">{displayQuote.likelyIssue}</p>
              </div>
              {displayQuote.notes && (
                <div>
                  <p className="text-xs font-semibold text-zinc-600 mb-1">Notes</p>
                  <p className="text-sm text-zinc-600">{displayQuote.notes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-200">
                <div>
                  <label className="text-xs font-medium text-zinc-600">Quote Low ($)</label>
                  <input
                    type="number"
                    value={quoteAdjusted?.quoteLow ?? ""}
                    onChange={(e) => setQuoteAdjusted(prev => ({ ...prev, quoteLow: parseFloat(e.target.value) }))}
                    className="w-full h-10 px-3 rounded-xl border border-orange-200 bg-white text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-vortt-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-600">Quote High ($)</label>
                  <input
                    type="number"
                    value={quoteAdjusted?.quoteHigh ?? ""}
                    onChange={(e) => setQuoteAdjusted(prev => ({ ...prev, quoteHigh: parseFloat(e.target.value) }))}
                    className="w-full h-10 px-3 rounded-xl border border-orange-200 bg-white text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-vortt-orange"
                  />
                </div>
              </div>
              <Button type="button" fullWidth variant="secondary" size="sm">
                Text Quote to Customer
              </Button>
            </div>
          )}
        </Card>

        {/* Job Details */}
        <Card>
          <h2 className="font-heading font-semibold text-vortt-charcoal mb-4">Job Details</h2>
          <div className="space-y-4">
            <Select
              label="Customer"
              options={[{ value: "", label: "Select customer..." }, ...mockCustomers]}
              error={errors.customerId?.message}
              {...register("customerId")}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Job Type"
                options={[
                  { value: "maintenance", label: "Maintenance" },
                  { value: "repair", label: "Repair" },
                  { value: "install", label: "Installation" },
                  { value: "emergency", label: "Emergency" },
                ]}
                {...register("jobType")}
              />
              <Select
                label="Priority"
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "high", label: "High" },
                  { value: "emergency", label: "Emergency" },
                ]}
                {...register("priority")}
              />
            </div>
            <Input
              label="Scheduled Date & Time"
              type="datetime-local"
              {...register("scheduledAt")}
            />
            <Select
              label="Assign Tech"
              options={mockTechs}
              {...register("techId")}
            />
            <Textarea
              label="Description"
              placeholder="What's the issue? Any customer-reported symptoms?"
              rows={3}
              {...register("description")}
            />
            <Input
              label="Estimated Amount ($)"
              type="number"
              placeholder="0.00"
              {...register("totalAmount")}
            />
          </div>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-vortt-red text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pb-4">
          <Link href="/jobs" className="flex-1">
            <Button variant="ghost" fullWidth>Cancel</Button>
          </Link>
          <Button type="submit" fullWidth loading={isSubmitting} disabled={companyLoading || !companyId}>
            Schedule Job
          </Button>
        </div>
      </form>
    </div>
  );
}
