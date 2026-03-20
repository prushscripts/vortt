"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, Plus, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import type { Part } from "@/types";


export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then(({ companyId: cid }: { companyId?: string }) => {
        if (!cid) {
          setDataLoaded(true);
          return;
        }
        return fetch(`/api/inventory?companyId=${cid}`)
          .then((r) => r.json())
          .then((d: Part[]) => {
            const list = Array.isArray(d) ? d : [];
            setParts(list);
            setDataLoaded(true);
          });
      })
      .catch(() => {
        setDataLoaded(true);
      });
  }, []);

  const lowStock = parts.filter(p => p.stockQty > 0 && p.stockQty <= p.minStock);
  const outOfStock = parts.filter(p => p.stockQty === 0);

  const filtered = filter === "low" ? lowStock : filter === "out" ? outOfStock : parts;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Inventory</h1>
          <p className="text-zinc-500 text-sm">{parts.length} parts tracked</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          Add Part
        </Button>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="space-y-2">
          {outOfStock.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-vortt-red flex-shrink-0" />
              <p className="text-sm text-vortt-red font-medium">
                {outOfStock.length} part{outOfStock.length > 1 ? "s" : ""} out of stock:{" "}
                {outOfStock.map(p => p.name).join(", ")}
              </p>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-vortt-amber flex-shrink-0" />
              <p className="text-sm text-vortt-amber font-medium">
                {lowStock.length} part{lowStock.length > 1 ? "s" : ""} running low
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[["all", "All Parts"], ["low", `Low Stock (${lowStock.length})`], ["out", `Out of Stock (${outOfStock.length})`]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val as typeof filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === val ? "bg-vortt-charcoal text-white border-transparent" : "bg-transparent border border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[rgba(255,107,43,0.35)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {!dataLoaded &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 14,
              padding: 20,
              opacity: 1 - i * 0.15,
            }}>
              <div style={{
                width: "40%", height: 11, background: "var(--bg-elevated)",
                borderRadius: 6, marginBottom: 12,
                animation: "pulse 1.5s ease-in-out infinite"
              }} />
              <div style={{
                width: "60%", height: 18, background: "var(--bg-elevated)",
                borderRadius: 6,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.1s"
              }} />
            </div>
          ))}
        {dataLoaded && filtered.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 20px', gap: 16, textAlign: 'center',
            gridColumn: '1 / -1'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
            </div>
            <div>
              <p style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:18, color:'var(--text-primary)', margin:0}}>
                No parts tracked yet
              </p>
              <p style={{color:'var(--text-secondary)', fontSize:14, marginTop:6, margin:'6px 0 0'}}>
                Add parts to track stock levels across your vans
              </p>
            </div>
            <a href="#" style={{
              background: 'var(--orange)', color: 'white', borderRadius: 10,
              padding: '10px 24px', fontFamily: 'Space Grotesk', fontWeight: 600,
              fontSize: 14, textDecoration: 'none', marginTop: 8,
              boxShadow: '0 4px 16px rgba(255,107,43,0.3)'
            }}>+ Add Part</a>
          </div>
        )}
        {dataLoaded && filtered.map((part) => {
          const isOut = part.stockQty === 0;
          const isLow = part.stockQty > 0 && part.stockQty <= part.minStock;
          return (
            <Card key={part.id} className={isOut ? "border-red-200" : isLow ? "border-amber-200" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <h3 className="font-semibold text-sm text-vortt-charcoal truncate">{part.name}</h3>
                  </div>
                  {part.partNumber && (
                    <p className="text-xs text-zinc-400 mb-1">#{part.partNumber}</p>
                  )}
                  {part.supplier && (
                    <p className="text-xs text-zinc-400">{part.supplier}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-heading font-bold text-vortt-charcoal">{formatCurrency(part.sellPrice)}</p>
                  <p className="text-xs text-zinc-400">cost: {formatCurrency(part.unitCost)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-heading font-bold text-2xl ${isOut ? "text-vortt-red" : isLow ? "text-vortt-amber" : "text-vortt-green"}`}>
                      {part.stockQty}
                    </span>
                    <span className="text-xs text-zinc-400">in stock</span>
                    {isOut && <span className="text-xs font-semibold text-vortt-red bg-red-50 px-2 py-0.5 rounded-full">OUT</span>}
                    {isLow && <span className="text-xs font-semibold text-vortt-amber bg-amber-50 px-2 py-0.5 rounded-full">LOW</span>}
                  </div>
                  <p className="text-xs text-zinc-400">min: {part.minStock}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={async () => {
                      const quantity = Math.max(0, part.stockQty - 1);
                      const res = await fetch(`/api/inventory/${part.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ quantity }),
                      });
                      const updated = await res.json();
                      setParts((prev) => prev.map((p) => (p.id === part.id ? updated : p)));
                    }}
                    className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 text-lg font-bold transition-colors"
                  >
                    −
                  </button>
                  <button
                    onClick={async () => {
                      const quantity = part.stockQty + 1;
                      const res = await fetch(`/api/inventory/${part.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ quantity }),
                      });
                      const updated = await res.json();
                      setParts((prev) => prev.map((p) => (p.id === part.id ? updated : p)));
                    }}
                    className="w-8 h-8 rounded-lg bg-vortt-orange text-white flex items-center justify-center text-lg font-bold hover:bg-orange-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
