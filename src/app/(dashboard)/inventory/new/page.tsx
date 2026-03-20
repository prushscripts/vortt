"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Textarea } from "@/components/ui/Input";
import { useCompanyId } from "@/hooks/useCompanyId";

const schema = z.object({
  name: z.string().min(1, "Part name required"),
  partNumber: z.string().optional(),
  supplier: z.string().optional(),
  sellPrice: z.number().optional(),
  unitCost: z.number().optional(),
  stockQty: z.number().default(0),
  minStock: z.number().default(1),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewPartPage() {
  const { companyId, loading: companyLoading } = useCompanyId();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      stockQty: 0,
      minStock: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    if (!companyId) {
      setError("Loading company… try again in a moment.");
      return;
    }

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          companyId,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/inventory");
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
                      color:'var(--text-primary)',margin:0}}>Add Part</h1>
          <p style={{color:'var(--text-secondary)',fontSize:13,margin:'2px 0 0'}}>
            Track inventory item
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Part Details Card */}
        <div style={{
          background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
          borderRadius:16, padding:24, marginBottom:24
        }}>
          <h3 style={{fontFamily:'Space Grotesk',fontWeight:600,fontSize:14,
                      color:'var(--text-secondary)',margin:'0 0 16px',
                      textTransform:'uppercase',letterSpacing:'0.08em'}}>
            Part Details
          </h3>
          
          <div className="space-y-4">
            <Input
              label="Part Name"
              placeholder="e.g., Capacitor 35/5 MFD"
              error={errors.name?.message}
              {...register("name")}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Part Number / SKU"
                placeholder="CAP-35-5"
                {...register("partNumber")}
              />
              <Input
                label="Supplier"
                placeholder="Johnstone Supply"
                {...register("supplier")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cost Price ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("unitCost", { valueAsNumber: true })}
              />
              <Input
                label="Sale Price ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("sellPrice", { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity in Stock"
                type="number"
                placeholder="0"
                {...register("stockQty", { valueAsNumber: true })}
              />
              <Input
                label="Minimum Stock Level"
                type="number"
                placeholder="1"
                {...register("minStock", { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Location"
              placeholder="e.g., Van 1, Warehouse"
              {...register("location")}
            />

            <Textarea
              label="Notes"
              placeholder="Additional details about this part..."
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
          }}>Add Part</button>
        </div>
      </form>
    </div>
  );
}
