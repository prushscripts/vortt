"use client";

import { useState } from "react";
import { DollarSign, Send, CheckCircle, FileText, Clock, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  jobType: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  createdAt: string;
  dueDate: string;
}

const mockInvoices: Invoice[] = [
  { id: "inv1", invoiceNumber: "INV-1042", customerName: "Maria Gonzalez", customerPhone: "5121234567", jobType: "AC Repair", amount: 680, status: "paid", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
  { id: "inv2", invoiceNumber: "INV-1041", customerName: "Robert Chen", customerPhone: "5123456789", jobType: "New Installation", amount: 4200, status: "sent", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString() },
  { id: "inv3", invoiceNumber: "INV-1040", customerName: "Sandra Kim", customerPhone: "5122345678", jobType: "Maintenance", amount: 189, status: "overdue", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(), dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: "inv4", invoiceNumber: "INV-1043", customerName: "James Whitfield", customerPhone: "5129876543", jobType: "Heat Pump Repair", amount: 520, status: "draft", createdAt: new Date().toISOString(), dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() },
];

const statusConfig: Record<Invoice["status"], { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-zinc-600", bg: "bg-zinc-100" },
  sent: { label: "Sent", color: "text-blue-600", bg: "bg-blue-100" },
  paid: { label: "Paid", color: "text-vortt-green", bg: "bg-green-100" },
  overdue: { label: "Overdue", color: "text-vortt-red", bg: "bg-red-100" },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filter, setFilter] = useState<Invoice["status"] | "all">("all");

  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalOutstanding = invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);

  const sendInvoice = (id: string) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: "sent" } : i));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Invoices</h1>
          <p className="text-zinc-500 text-sm">{invoices.length} total</p>
        </div>
        <Button size="sm">+ New Invoice</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle className="w-4 h-4 text-vortt-green" />
            <span className="text-xs font-semibold text-zinc-500 uppercase">Collected</span>
          </div>
          <p className="font-heading font-bold text-2xl text-vortt-charcoal">{formatCurrency(totalPaid)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-zinc-500 uppercase">Pending</span>
          </div>
          <p className="font-heading font-bold text-2xl text-vortt-charcoal">{formatCurrency(totalOutstanding)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-4 h-4 text-vortt-red" />
            <span className="text-xs font-semibold text-zinc-500 uppercase">Overdue</span>
          </div>
          <p className="font-heading font-bold text-2xl text-vortt-charcoal">{formatCurrency(totalOverdue)}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {(["all", "draft", "sent", "paid", "overdue"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === f ? "bg-vortt-charcoal text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      <div className="space-y-3">
        {filtered.map((invoice) => {
          const status = statusConfig[invoice.status];
          return (
            <Card key={invoice.id} hover>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-vortt-orange/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-vortt-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-heading font-semibold text-vortt-charcoal">{invoice.invoiceNumber}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color} ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600">{invoice.customerName}</p>
                  <p className="text-xs text-zinc-400">{invoice.jobType} · {formatDate(invoice.createdAt)}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-heading font-bold text-lg text-vortt-charcoal">
                    {formatCurrency(invoice.amount)}
                  </p>
                  {invoice.status === "draft" && (
                    <Button size="sm" className="mt-1" onClick={() => sendInvoice(invoice.id)}>
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
