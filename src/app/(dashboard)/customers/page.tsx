"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Phone, MapPin, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPhone } from "@/lib/utils/format";
import type { Customer } from "@/types";

const mockCustomers: Customer[] = [
  { id: "1", companyId: "c1", firstName: "Maria", lastName: "Gonzalez", phone: "5121234567", email: "maria@example.com", address: "1420 Oak Street, Austin TX 78701", equipment: [{ type: "Split AC", brand: "Carrier", model: "24ACC636A", installedYear: 2019 }], createdAt: new Date().toISOString() },
  { id: "2", companyId: "c1", firstName: "James", lastName: "Whitfield", phone: "5129876543", address: "892 Riverside Dr, Austin TX 78704", createdAt: new Date().toISOString() },
  { id: "3", companyId: "c1", firstName: "Sandra", lastName: "Kim", phone: "5122345678", address: "3341 Burnet Rd, Austin TX 78756", equipment: [{ type: "Central AC", brand: "Lennox", model: "XC21", installedYear: 2018 }], createdAt: new Date().toISOString() },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loading, setLoading] = useState(false);
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
        if (d.companyId) setResolvedCompanyId(d.companyId);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!resolvedCompanyId) return;
    setLoading(true);
    const query = new URLSearchParams({
      companyId: resolvedCompanyId,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }).toString();
    fetch(`/api/customers?${query}`)
      .then((r) => r.json())
      .then((d: Customer[] | { error?: string }) => {
        if (Array.isArray(d) && d.length > 0) setCustomers(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resolvedCompanyId, debouncedSearch]);

  const filtered = useMemo(() => customers, [customers]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#F8F8FA]">Customers</h1>
          <p className="text-[var(--text-secondary)] text-sm">{customers.length} total</p>
        </div>
        <Link href="/customers/new">
          <Button size="sm">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Customer</span>
          </Button>
        </Link>
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
        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="rounded-[14px] border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-[var(--bg-elevated)] mb-2" />
              <div className="h-3 w-1/2 rounded bg-[var(--bg-elevated)]" />
            </div>
          ))}
        {filtered.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-[var(--text-secondary)] text-sm">No customers found</p>
            <Link href="/customers/new">
              <Button size="sm" className="mt-4">Add your first customer</Button>
            </Link>
          </Card>
        )}
        {filtered.map((customer) => (
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
