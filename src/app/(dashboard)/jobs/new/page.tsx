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

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--bg-border)',
    borderRadius: 10, padding: '0 14px',
    color: 'var(--text-primary)', fontSize: 15,
    outline: 'none',
    colorScheme: 'dark',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'var(--text-muted)', marginBottom: 6, display: 'block',
  };

  return (
    <div style={{maxWidth: 680, margin: '0 auto', padding: '24px 16px'}}>
      {/* Header */}
      <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:28}}>
        <button onClick={() => router.back()} style={{
          width:36, height:36, borderRadius:10,
          background:'var(--bg-elevated)', border:'1px solid var(--bg-border)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', flexShrink:0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
               stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h1 style={{fontFamily:'Space Grotesk',fontWeight:700,fontSize:24,
                      color:'var(--text-primary)',margin:0}}>New Job</h1>
          <p style={{color:'var(--text-secondary)',fontSize:13,margin:'2px 0 0'}}>
            Schedule a service call
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Job Details Card */}
        <div style={{
          background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
          borderRadius:16, padding:24, marginBottom:16
        }}>
          <h3 style={{fontFamily:'Space Grotesk',fontWeight:600,fontSize:14,
                      color:'var(--text-secondary)',margin:'0 0 16px',
                      textTransform:'uppercase',letterSpacing:'0.08em'}}>
            Job Details
          </h3>
          
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
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label style={labelStyle}>SCHEDULED DATE</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  style={inputStyle}
                  {...register("scheduledAt")}
                />
              </div>
              <div>
                <label style={labelStyle}>TIME</label>
                <input
                  type="time"
                  defaultValue="09:00"
                  style={inputStyle}
                />
              </div>
            </div>
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
        </div>

        {/* AI Photo Quote Card */}
        <div style={{
          background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
          borderRadius:16, padding:24, marginBottom:24
        }}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
                   stroke="var(--orange)" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span style={{fontFamily:'Space Grotesk',fontWeight:600,fontSize:14,
                            color:'var(--text-primary)'}}>AI Photo Quote</span>
            </div>
            <span style={{fontSize:11,color:'var(--text-muted)',
                          textTransform:'uppercase',letterSpacing:'0.08em'}}>Optional</span>
          </div>
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
              style={{height: 100}}
              className="w-full border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-vortt-orange hover:bg-orange-50 transition-all"
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
                    className="w-full h-10 px-3 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-vortt-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-600">Quote High ($)</label>
                  <input
                    type="number"
                    value={quoteAdjusted?.quoteHigh ?? ""}
                    onChange={(e) => setQuoteAdjusted(prev => ({ ...prev, quoteHigh: parseFloat(e.target.value) }))}
                    className="w-full h-10 px-3 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-vortt-orange"
                  />
                </div>
              </div>
              <Button type="button" fullWidth variant="secondary" size="sm">
                Text Quote to Customer
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-vortt-red text-sm">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:12}}>
          <button onClick={() => router.back()} type="button" style={{
            height:52, background:'var(--bg-elevated)',
            border:'1px solid var(--bg-border)', borderRadius:12,
            color:'var(--text-secondary)', fontFamily:'Space Grotesk',
            fontWeight:600, fontSize:15, cursor:'pointer',
          }}>Cancel</button>
          <button type="submit" disabled={isSubmitting || companyLoading || !companyId} style={{
            height:52, background:'var(--orange)', border:'none',
            borderRadius:12, color:'white', fontFamily:'Space Grotesk',
            fontWeight:700, fontSize:15, cursor:'pointer',
            boxShadow:'0 4px 20px rgba(255,107,43,0.35)',
            opacity: (isSubmitting || companyLoading || !companyId) ? 0.6 : 1,
          }}>Schedule Job</button>
        </div>
      </form>
    </div>
  );
}
