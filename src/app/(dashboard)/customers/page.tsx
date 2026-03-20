"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Phone, MapPin, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPhone } from "@/lib/utils/format";
import type { Customer } from "@/types";


export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [resolvedCompanyId, setResolvedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then((d: { companyId?: string }) => {
        if (d.companyId) {
          setResolvedCompanyId(d.companyId);
        } else {
          setDataLoaded(true);
        }
      })
      .catch(() => {
        setDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!resolvedCompanyId) return;
    const query = new URLSearchParams({
      companyId: resolvedCompanyId,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }).toString();
    fetch(`/api/customers?${query}`)
      .then((r) => r.json())
      .then((d: Customer[] | { error?: string }) => {
        const list = Array.isArray(d) ? d : [];
        setCustomers(list);
        setDataLoaded(true);
      })
      .catch(() => {
        setDataLoaded(true);
      });
  }, [resolvedCompanyId, debouncedSearch]);

  const filtered = useMemo(() => customers, [customers]);

  return (
    <div className="space-y-5">
      <div style={{
        display: 'flex', justifyContent: 'space-between', 
        alignItems: 'flex-start', marginBottom: 24
      }}>
        <div>
          <h1 style={{fontFamily:'Space Grotesk',fontWeight:800,fontSize:28,
                      color:'var(--text-primary)',margin:0,letterSpacing:'-0.02em'}}>
            Customers
          </h1>
          <p style={{color:'var(--text-secondary)',fontSize:14,marginTop:4}}>
            {customers.length} total
          </p>
        </div>
        <button onClick={() => window.location.href = '/customers/new'} style={{
          height:40, background:'var(--orange)', color:'white',
          border:'none', borderRadius:10, padding:'0 18px',
          fontFamily:'Space Grotesk', fontWeight:600, fontSize:14,
          cursor:'pointer', boxShadow:'0 4px 16px rgba(255,107,43,0.3)',
          flexShrink:0, alignSelf:'center',
          transition:'all 0.15s ease',
        }}>+ Add Customer</button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="search"
          placeholder="Search by name, phone, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] text-base focus:outline-none"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {!dataLoaded &&
          [0, 1, 2].map((i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 14,
              padding: 20,
              marginBottom: 10,
              opacity: 1 - i * 0.2,
            }}>
              <div style={{
                width: "35%", height: 11, background: "var(--bg-elevated)",
                borderRadius: 6, marginBottom: 12,
                animation: "pulse 1.5s ease-in-out infinite"
              }} />
              <div style={{
                width: "60%", height: 18, background: "var(--bg-elevated)",
                borderRadius: 6, marginBottom: 10,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.1s"
              }} />
              <div style={{
                width: "45%", height: 11, background: "var(--bg-elevated)",
                borderRadius: 6,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.2s"
              }} />
            </div>
          ))}
        {dataLoaded && filtered.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 20px', gap: 16, textAlign: 'center'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:18, color:'var(--text-primary)', margin:0}}>
                No customers yet
              </p>
              <p style={{color:'var(--text-secondary)', fontSize:14, marginTop:6, margin:'6px 0 0'}}>
                Add your first customer to get started
              </p>
            </div>
            <a href="/customers/new" style={{
              background: 'var(--orange)', color: 'white', borderRadius: 10,
              padding: '10px 24px', fontFamily: 'Space Grotesk', fontWeight: 600,
              fontSize: 14, textDecoration: 'none', marginTop: 8,
              boxShadow: '0 4px 16px rgba(255,107,43,0.3)'
            }}>+ Add Customer</a>
          </div>
        )}
        {dataLoaded && filtered.map((customer) => (
          <Link key={customer.id} href={`/customers/${customer.id}`}>
            <Card hover className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-vortt-orange/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-vortt-orange text-sm">
                    {customer.firstName[0]}{customer.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-vortt-charcoal">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-sm text-zinc-500">{formatPhone(customer.phone)}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-sm text-zinc-500 truncate">{customer.address}</span>
                    </div>
                  </div>
                  {customer.equipment && customer.equipment.length > 0 && (
                    <p className="text-xs text-zinc-400 mt-1">
                      {customer.equipment.map(e => `${e.brand} ${e.type}`).join(", ")}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 flex-shrink-0" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
