"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { useCompanyId } from "@/hooks/useCompanyId";

const schema = z.object({
  customerId: z.string().min(1, "Customer required"),
  tier: z.enum(["basic", "premium", "custom"]),
  price: z.number().optional(),
  startDate: z.string().min(1, "Start date required"),
  renewalDate: z.string().min(1, "Renewal date required"),
  equipmentCovered: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewContractPage() {
  const { companyId, loading: companyLoading } = useCompanyId();
  const router = useRouter();
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tier: "basic",
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const tier = watch("tier");

  useState(() => {
    if (companyId) {
      fetch(`/api/customers?companyId=${companyId}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setCustomers(data);
        });
    }
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    if (!companyId) {
      setError("Loading company… try again in a moment.");
      return;
    }

    const price = tier === "basic" ? 299 : tier === "premium" ? 599 : data.price || 0;

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          companyId,
          price,
          status: "active",
          autoRenew: false,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/contracts");
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

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
                      color:'var(--text-primary)',margin:0}}>New Contract</h1>
          <p style={{color:'var(--text-secondary)',fontSize:13,margin:'2px 0 0'}}>
            Create maintenance agreement
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Contract Details Card */}
        <div style={{
          background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
          borderRadius:16, padding:24, marginBottom:24
        }}>
          <h3 style={{fontFamily:'Space Grotesk',fontWeight:600,fontSize:14,
                      color:'var(--text-secondary)',margin:'0 0 16px',
                      textTransform:'uppercase',letterSpacing:'0.08em'}}>
            Contract Details
          </h3>
          
          <div className="space-y-4">
            <Select
              label="Customer"
              options={[
                { value: "", label: "Select customer..." },
                ...customers.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))
              ]}
              error={errors.customerId?.message}
              {...register("customerId")}
            />
            
            <div>
              <label style={labelStyle}>PLAN</label>
              <select
                {...register("tier")}
                style={inputStyle}
              >
                <option value="basic">Basic ($299/yr)</option>
                <option value="premium">Premium ($599/yr)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {tier === "custom" && (
              <Input
                label="Custom Amount ($)"
                type="number"
                placeholder="0.00"
                {...register("price", { valueAsNumber: true })}
              />
            )}

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label style={labelStyle}>START DATE</label>
                <input
                  type="date"
                  style={inputStyle}
                  {...register("startDate")}
                />
              </div>
              <div>
                <label style={labelStyle}>RENEWAL DATE</label>
                <input
                  type="date"
                  style={inputStyle}
                  {...register("renewalDate")}
                />
              </div>
            </div>

            <Input
              label="Equipment Covered"
              placeholder="e.g., Central AC Unit, Heat Pump"
              {...register("equipmentCovered")}
            />

            <Textarea
              label="Notes"
              placeholder="Additional contract terms or details..."
              rows={3}
              {...register("notes")}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
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
          }}>Create Contract</button>
        </div>
      </form>
    </div>
  );
}
