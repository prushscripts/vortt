"use client";

import { useEffect, useState } from "react";
import { DollarSign, Send, CheckCircle, FileText, Clock, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
interface Invoice {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  jobType: string;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  createdAt: string;
  dueDate: string;
}

const statusConfig: Record<Invoice["status"], { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-zinc-600", bg: "bg-zinc-100" },
  sent: { label: "Sent", color: "text-blue-600", bg: "bg-blue-100" },
  paid: { label: "Paid", color: "text-vortt-green", bg: "bg-green-100" },
  overdue: { label: "Overdue", color: "text-vortt-red", bg: "bg-red-100" },
};

const mockInvoices: Invoice[] = [
  { id: "inv-demo-1", invoiceNo: "INV-1042", customerName: "Maria Gonzalez", customerPhone: "5121234567", jobType: "HVAC Service", totalAmount: 850, status: "sent", createdAt: new Date().toISOString(), dueDate: new Date(Date.now() + 86400000 * 14).toISOString() },
  { id: "inv-demo-2", invoiceNo: "INV-1041", customerName: "James Whitfield", customerPhone: "5129876543", jobType: "HVAC Service", totalAmount: 1295, status: "paid", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), dueDate: new Date().toISOString() },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filter, setFilter] = useState<Invoice["status"] | "all">("all");

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then(({ companyId: cid }: { companyId?: string }) => {
        if (!cid) return;
        return fetch(`/api/invoices?companyId=${cid}`)
          .then((r) => r.json())
          .then((rows) => {
            const mapped = (rows ?? []).map((r: { id: string; invoiceNo: string; status: Invoice["status"]; createdAt: string; dueDate: string; totalAmount: number; customer: { firstName: string; lastName: string; phone: string } }) => ({
              id: r.id,
              invoiceNo: r.invoiceNo,
              customerName: `${r.customer?.firstName ?? ""} ${r.customer?.lastName ?? ""}`.trim(),
              customerPhone: r.customer?.phone ?? "",
              jobType: "HVAC Service",
              totalAmount: r.totalAmount,
              status: r.status,
              createdAt: r.createdAt,
              dueDate: r.dueDate,
            }));
            if (Array.isArray(mapped) && mapped.length > 0) setInvoices(mapped);
          });
      })
      .catch(() => {});
  }, []);

  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);
  const totalOutstanding = invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.totalAmount, 0);
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.totalAmount, 0);

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);

  const sendInvoice = (id: string) => {
    fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sent" }),
    }).then(() => setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: "sent" } : i)));
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
              filter === f ? "bg-vortt-charcoal text-white border-transparent" : "bg-transparent border border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[rgba(255,107,43,0.35)]"
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
                    <span className="font-heading font-semibold text-vortt-charcoal">{invoice.invoiceNo}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color} ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600">{invoice.customerName}</p>
                  <p className="text-xs text-zinc-400">{invoice.jobType} · {formatDate(invoice.createdAt)}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-heading font-bold text-lg text-vortt-charcoal">
                    {formatCurrency(invoice.totalAmount)}
                  </p>
                  {invoice.status === "draft" && (
                    <Button size="sm" className="mt-1" onClick={() => sendInvoice(invoice.id)}>
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </Button>
                  )}
                  <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer" className="block mt-1 text-xs text-vortt-orange">
                    Download PDF
                  </a>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
