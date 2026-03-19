"use client";

import { useEffect, useState } from "react";
import { FileText, AlertTriangle, DollarSign, Send, CheckCircle, X, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ContractBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils/format";
import { useCompanyId } from "@/hooks/useCompanyId";
import type { MaintenanceContract } from "@/types";

// Mock data — replace with API
const mockContracts: MaintenanceContract[] = [
  {
    id: "con1", companyId: "c1", customerId: "1", tier: "premium", price: 599,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 330).toISOString(),
    renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).toISOString(),
    status: "expiring", autoRenew: false, outreachSent: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 330).toISOString(),
    customer: { id: "1", companyId: "c1", firstName: "Maria", lastName: "Gonzalez", phone: "5121234567", email: "maria@example.com", address: "1420 Oak Street, Austin TX 78701", equipment: [{ type: "Split AC", brand: "Carrier", model: "24ACC636A", installedYear: 2019 }], createdAt: new Date().toISOString() },
  },
  {
    id: "con2", companyId: "c1", customerId: "2", tier: "basic", price: 299,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 340).toISOString(),
    renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "expiring", autoRenew: false, outreachSent: false,
    createdAt: new Date().toISOString(),
    customer: { id: "2", companyId: "c1", firstName: "James", lastName: "Whitfield", phone: "5129876543", address: "892 Riverside Dr, Austin TX 78704", createdAt: new Date().toISOString() },
  },
  {
    id: "con3", companyId: "c1", customerId: "3", tier: "premium", price: 599,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
    renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 165).toISOString(),
    status: "active", autoRenew: true, outreachSent: false,
    createdAt: new Date().toISOString(),
    customer: { id: "3", companyId: "c1", firstName: "Sandra", lastName: "Kim", phone: "5122345678", address: "3341 Burnet Rd, Austin TX 78756", equipment: [{ type: "Central AC", brand: "Lennox", model: "XC21", installedYear: 2018 }], createdAt: new Date().toISOString() },
  },
  {
    id: "con4", companyId: "c1", customerId: "4", tier: "basic", price: 299,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 355).toISOString(),
    renewalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "expired", autoRenew: false, outreachSent: false,
    createdAt: new Date().toISOString(),
    customer: { id: "4", companyId: "c1", firstName: "Robert", lastName: "Chen", phone: "5123456789", address: "4210 South Lamar, Austin TX 78704", createdAt: new Date().toISOString() },
  },
];

interface OutreachState {
  contractId: string;
  draft: string;
  loading: boolean;
  sent: boolean;
}

export default function ContractsPage() {
  const { companyId } = useCompanyId();
  const [contracts, setContracts] = useState<MaintenanceContract[]>(mockContracts);
  const [outreach, setOutreach] = useState<OutreachState | null>(null);
  const [sendingAll, setSendingAll] = useState(false);

  const expiringSoon = contracts.filter(c => c.status === "expiring");
  const expired = contracts.filter(c => c.status === "expired");
  const atRiskValue = [...expiringSoon, ...expired].reduce((sum, c) => sum + c.price, 0);

  useEffect(() => {
    if (!companyId) return;
    fetch(`/api/contracts?companyId=${companyId}`)
      .then((r) => r.json())
      .then((d) => setContracts(Array.isArray(d) ? d : []));
  }, [companyId]);

  const generateDraft = async (contract: MaintenanceContract) => {
    setOutreach({ contractId: contract.id, draft: "", loading: true, sent: false });
    try {
      const res = await fetch("/api/contracts/renewal-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: contract.id }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOutreach(prev => prev ? { ...prev, draft: data.draft, loading: false } : null);
    } catch {
      // Demo fallback
      const customerName = contract.customer?.firstName;
      const equipment = contract.customer?.equipment?.[0];
      const equipStr = equipment ? `${equipment.brand} ${equipment.type}` : "HVAC system";
      const days = daysUntil(contract.renewalDate);
      const draft = `Hi ${customerName}, your ${equipStr} maintenance contract expires in ${Math.abs(days)} days. Renew now for $${contract.price}/yr and keep your system covered. Reply YES or call us.`;
      setOutreach(prev => prev ? { ...prev, draft, loading: false } : null);
    }
  };

  const sendMessage = async (contract: MaintenanceContract) => {
    if (!outreach?.draft) return;
    try {
      await fetch("/api/contracts/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contract.id,
          companyName: "Smith HVAC Services",
          action: "send",
          draftMessage: outreach.draft,
        }),
      });
      setContracts(prev => prev.map(c => c.id === contract.id ? { ...c, outreachSent: true } : c));
      setOutreach(prev => prev ? { ...prev, sent: true } : null);
    } catch {
      setContracts(prev => prev.map(c => c.id === contract.id ? { ...c, outreachSent: true } : c));
      setOutreach(prev => prev ? { ...prev, sent: true } : null);
    }
  };

  const getStatusStyle = (contract: MaintenanceContract) => {
    const days = daysUntil(contract.renewalDate);
    if (days < 0) return "border-l-4 border-l-vortt-red";
    if (days <= 30) return "border-l-4 border-l-vortt-amber";
    return "border-l-4 border-l-vortt-green";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Contracts</h1>
          <p className="text-zinc-500 text-sm">{contracts.length} active contracts</p>
        </div>
        <Button size="sm">+ New Contract</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-vortt-amber" />
            <span className="text-xs font-semibold text-zinc-500 uppercase">Expiring</span>
          </div>
          <p className="font-heading font-bold text-3xl text-vortt-charcoal">{expiringSoon.length}</p>
          <p className="text-xs text-zinc-500 mt-0.5">contracts this month</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-vortt-red" />
            <span className="text-xs font-semibold text-zinc-500 uppercase">At Risk</span>
          </div>
          <p className="font-heading font-bold text-3xl text-vortt-charcoal">{formatCurrency(atRiskValue)}</p>
          <p className="text-xs text-zinc-500 mt-0.5">renewal revenue</p>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-vortt-green" />
            <span className="text-xs font-semibold text-zinc-500 uppercase">Active</span>
          </div>
          <p className="font-heading font-bold text-3xl text-vortt-charcoal">
            {contracts.filter(c => c.status === "active").length}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">healthy contracts</p>
        </Card>
      </div>

      {/* Outreach Modal */}
      {outreach && !outreach.sent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-vortt-charcoal">Renewal Message</h2>
              <button onClick={() => setOutreach(null)} className="p-2 hover:bg-zinc-100 rounded-xl">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {outreach.loading ? (
              <div className="flex items-center justify-center py-8 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-vortt-orange" />
                <span className="text-zinc-500">Writing message with AI...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-2">DRAFT SMS — Review before sending</p>
                  <textarea
                    value={outreach.draft}
                    onChange={(e) => setOutreach(prev => prev ? { ...prev, draft: e.target.value } : null)}
                    className="w-full h-28 px-4 py-3 rounded-xl border border-zinc-200 text-sm text-vortt-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-vortt-orange"
                  />
                  <p className="text-xs text-zinc-400 mt-1">{outreach.draft.length}/160 chars</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" fullWidth onClick={() => setOutreach(null)}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      const contract = contracts.find(c => c.id === outreach.contractId);
                      if (contract) sendMessage(contract);
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Send SMS
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {outreach?.sent && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-vortt-green flex-shrink-0" />
          <p className="text-sm text-vortt-green font-medium">Message sent successfully!</p>
          <button onClick={() => setOutreach(null)} className="ml-auto text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contract Table */}
      <div className="space-y-3">
        {contracts
          .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
          .map((contract) => {
            const days = daysUntil(contract.renewalDate);
            return (
              <Card key={contract.id} className={`${getStatusStyle(contract)}`} padding="none">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-heading font-semibold text-vortt-charcoal">
                          {contract.customer?.firstName} {contract.customer?.lastName}
                        </h3>
                        <ContractBadge status={contract.status} />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                          contract.tier === "premium" ? "bg-orange-100 text-vortt-orange" : "bg-zinc-100 text-zinc-600"
                        }`}>
                          {contract.tier}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <span className="font-heading font-bold text-vortt-charcoal">{formatCurrency(contract.price)}<span className="text-zinc-400 font-normal text-xs">/yr</span></span>
                        <span className={`text-xs font-medium ${days < 0 ? "text-vortt-red" : days <= 30 ? "text-vortt-amber" : "text-zinc-500"}`}>
                          {days < 0 ? `Expired ${Math.abs(days)} days ago` : `Renews in ${days} days`}
                        </span>
                        <span className="text-xs text-zinc-400">{formatDate(contract.renewalDate)}</span>
                      </div>

                      {contract.customer?.equipment?.[0] && (
                        <p className="text-xs text-zinc-400 mt-1">
                          {contract.customer.equipment[0].brand} {contract.customer.equipment[0].type}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {contract.outreachSent ? (
                        <div className="flex items-center gap-1.5 text-vortt-green">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Sent</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant={days <= 30 ? "primary" : "secondary"}
                          onClick={() => generateDraft(contract)}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Renew
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          const res = await fetch(`/api/contracts/${contract.id}`, { method: "PATCH" });
                          const updated = await res.json();
                          setContracts((prev) => prev.map((c) => (c.id === contract.id ? updated : c)));
                        }}
                      >
                        Extend +1y
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
