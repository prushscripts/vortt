"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Phone, MapPin, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPhone, formatRelative } from "@/lib/utils/format";
import type { Customer } from "@/types";

// Mock data — replace with real API
const mockCustomers: Customer[] = [
  {
    id: "1",
    companyId: "c1",
    firstName: "Maria",
    lastName: "Gonzalez",
    phone: "5551234567",
    email: "maria@example.com",
    address: "1420 Oak Street, Austin TX 78701",
    equipment: [{ type: "Split AC", brand: "Carrier", model: "24ACC636A", serial: "SN123456", installedYear: 2019 }],
    notes: "Gate code: 1234. Dog in backyard.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "2",
    companyId: "c1",
    firstName: "James",
    lastName: "Whitfield",
    phone: "5559876543",
    address: "892 Riverside Dr, Austin TX 78704",
    equipment: [{ type: "Heat Pump", brand: "Trane", model: "XR15", installedYear: 2021 }],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: "3",
    companyId: "c1",
    firstName: "Sandra",
    lastName: "Kim",
    phone: "5552345678",
    email: "sandra.kim@email.com",
    address: "3341 Burnet Rd, Austin TX 78756",
    equipment: [
      { type: "Central AC", brand: "Lennox", model: "XC21", installedYear: 2018 },
      { type: "Furnace", brand: "Lennox", model: "EL296V", installedYear: 2018 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockCustomers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Customers</h1>
          <p className="text-zinc-500 text-sm">{mockCustomers.length} total</p>
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="search"
          placeholder="Search by name, phone, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-vortt-orange focus:border-transparent"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-zinc-400 text-sm">No customers found</p>
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
