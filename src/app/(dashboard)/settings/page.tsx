"use client";

import { useEffect, useState } from "react";
import { Building2, Phone, MapPin, CreditCard, Bell, Shield, Save, AlertTriangle, LogOut } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCompanyId } from "@/hooks/useCompanyId";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { companyId } = useCompanyId();
  const [saved, setSaved] = useState(false);
  const [plan, setPlan] = useState("starter");
  const [status, setStatus] = useState("trialing");
  const [nextBillingDate] = useState<string>(new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toLocaleDateString());

  useEffect(() => {
    fetch("/api/company/current")
      .then((r) => r.json())
      .then((d) => {
        if (d?.plan) setPlan(d.plan);
        if (d?.subscriptionStatus) setStatus(d.subscriptionStatus);
      });
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Settings</h1>
        <p className="text-zinc-500 text-sm">Manage your company account</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth >= 768 ? '1fr 380px' : '1fr',
        gap: 20,
        alignItems: 'start',
      }}>
        {/* LEFT COLUMN */}
        <div style={{display:'flex', flexDirection:'column', gap:20}}>

          {/* Company Info */}
          <div style={{
            background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
            borderRadius:16, padding:24
          }}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:20}}>
              <Building2 style={{width:20, height:20, color:'var(--orange)'}} />
              <h3 style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:16, color:'var(--text-primary)', margin:0}}>Company Info</h3>
            </div>
            <div className="space-y-4">
              <Input label="Company Name" defaultValue="Smith HVAC Services" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" type="tel" defaultValue="(512) 555-0100" />
                <Input label="Email" type="email" defaultValue="info@smithhvac.com" />
              </div>
              <Input label="Business Address" defaultValue="1200 Industrial Blvd, Austin TX 78701" />
              <Input
                label="Google Review Link"
                placeholder="https://g.page/r/your-link"
                hint="Used in automated review requests after job completion"
              />
            </div>
          </div>

          {/* Notifications */}
          <div style={{
            background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
            borderRadius:16, padding:24
          }}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:20}}>
              <Bell style={{width:20, height:20, color:'var(--orange)'}} />
              <h3 style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:16, color:'var(--text-primary)', margin:0}}>Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "New job created", sub: "Notify when a job is scheduled" },
                { label: "Job completed", sub: "Notify when a tech marks a job complete" },
                { label: "Contract expiring", sub: "30-day and 7-day renewal reminders" },
                { label: "Review request pending", sub: "Notify when review requests need approval" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-vortt-charcoal">{item.label}</p>
                    <p className="text-xs text-zinc-400">{item.sub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[rgba(248,248,250,0.85)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vortt-orange" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          {/* Billing */}
          <div style={{
            background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
            borderRadius:16, padding:24
          }}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <CreditCard style={{width:20, height:20, color:'var(--orange)'}} />
                <h3 style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:16, color:'var(--text-primary)', margin:0}}>Billing</h3>
              </div>
              <span style={{
                fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:6,
                textTransform:'uppercase', letterSpacing:'0.05em',
                background: status === "trialing" ? 'rgba(255,107,43,0.12)' : 'rgba(34,197,94,0.12)',
                color: status === "trialing" ? 'var(--orange)' : 'var(--green)',
                border: status === "trialing" ? '1px solid rgba(255,107,43,0.3)' : '1px solid rgba(34,197,94,0.3)',
              }}>
                {status}
              </span>
            </div>
            <div style={{marginBottom:16}}>
              <p style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:20, color:'var(--text-primary)', margin:0}}>
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </p>
              <p style={{fontSize:13, color:'var(--text-secondary)', marginTop:4}}>
                Next billing: {nextBillingDate}
              </p>
            </div>
            <button
              onClick={async () => {
                if (!companyId) return;
                const res = await fetch("/api/stripe/portal", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ companyId }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
              style={{
                width:'100%', height:40, background:'var(--bg-elevated)',
                border:'1px solid var(--bg-border)', borderRadius:10,
                color:'var(--text-primary)', fontFamily:'Space Grotesk',
                fontWeight:600, fontSize:14, cursor:'pointer',
                transition:'all 0.15s ease',
              }}
            >
              Manage Billing
            </button>
          </div>

          {/* Security */}
          <div style={{
            background:'var(--bg-surface)', border:'1px solid var(--bg-border)',
            borderRadius:16, padding:24
          }}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:20}}>
              <Shield style={{width:20, height:20, color:'var(--orange)'}} />
              <h3 style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:16, color:'var(--text-primary)', margin:0}}>Security</h3>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              <button style={{
                width:'100%', height:40, background:'var(--bg-elevated)',
                border:'1px solid var(--bg-border)', borderRadius:10,
                color:'var(--text-primary)', fontFamily:'Space Grotesk',
                fontWeight:600, fontSize:14, cursor:'pointer',
                textAlign:'left', padding:'0 14px',
                transition:'all 0.15s ease',
              }}>
                Change Password
              </button>
              <p style={{fontSize:13, color:'var(--text-secondary)', margin:'8px 0 0'}}>
                Last sign-in: Today at 9:42 AM
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{
            background:'rgba(255,69,58,0.04)', border:'1px solid rgba(255,69,58,0.2)',
            borderRadius:16, padding:24
          }}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:20}}>
              <AlertTriangle style={{width:20, height:20, color:'var(--red)'}} />
              <h3 style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:16, color:'var(--red)', margin:0}}>Danger Zone</h3>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              <button
                onClick={async () => {
                  if (!confirm('Sign out of all devices? You will need to log in again.')) return;
                  const supabase = createClient();
                  await supabase.auth.signOut({ scope: 'global' });
                  window.location.href = '/login';
                }}
                style={{
                  width:'100%', height:40, background:'transparent',
                  border:'1px solid var(--red)', borderRadius:10,
                  color:'var(--red)', fontFamily:'Space Grotesk',
                  fontWeight:600, fontSize:14, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'all 0.15s ease',
                }}
              >
                <LogOut style={{width:16, height:16}} />
                Sign Out of All Devices
              </button>
              <button
                onClick={() => {
                  if (!confirm('Delete your account? This action cannot be undone.')) return;
                  alert('Account deletion will be implemented.');
                }}
                style={{
                  width:'100%', height:36, background:'transparent',
                  border:'1px solid rgba(255,69,58,0.4)', borderRadius:10,
                  color:'rgba(255,69,58,0.8)', fontFamily:'Space Grotesk',
                  fontWeight:500, fontSize:13, cursor:'pointer',
                  transition:'all 0.15s ease',
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} fullWidth size="lg" style={{maxWidth:680, margin:'0 auto'}}>
        <Save className="w-5 h-5" />
        {saved ? "Saved!" : "Save Settings"}
      </Button>
    </div>
  );
}
