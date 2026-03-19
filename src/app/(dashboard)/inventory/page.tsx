"use client";

import { useState } from "react";
import { Package, AlertTriangle, Plus, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/format";
import type { Part } from "@/types";

const mockParts: Part[] = [
  { id: "p1", companyId: "c1", name: "Capacitor 35/5 MFD", partNumber: "CAP-35-5", supplier: "Johnstone Supply", unitCost: 12, sellPrice: 45, stockQty: 8, minStock: 3, createdAt: new Date().toISOString() },
  { id: "p2", companyId: "c1", name: "Contactor 30A", partNumber: "CON-30A", supplier: "Johnstone Supply", unitCost: 18, sellPrice: 65, stockQty: 1, minStock: 2, createdAt: new Date().toISOString() },
  { id: "p3", companyId: "c1", name: "Filter 16x25x1", partNumber: "FLT-16251", supplier: "Ferguson HVAC", unitCost: 4, sellPrice: 12, stockQty: 24, minStock: 10, createdAt: new Date().toISOString() },
  { id: "p4", companyId: "c1", name: "Thermostat Honeywell T6", partNumber: "TH-T6-PRO", supplier: "HD Supply", unitCost: 55, sellPrice: 149, stockQty: 3, minStock: 2, createdAt: new Date().toISOString() },
  { id: "p5", companyId: "c1", name: "Blower Motor 1/3 HP", partNumber: "BLW-13HP", supplier: "Johnstone Supply", unitCost: 85, sellPrice: 220, stockQty: 0, minStock: 1, createdAt: new Date().toISOString() },
  { id: "p6", companyId: "c1", name: "R-410A Refrigerant 25lb", partNumber: "R410A-25", supplier: "Ferguson HVAC", unitCost: 140, sellPrice: 280, stockQty: 2, minStock: 2, createdAt: new Date().toISOString() },
];

export default function InventoryPage() {
  const [parts, setParts] = useState(mockParts);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

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
              filter === val ? "bg-vortt-charcoal text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((part) => {
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
                  <button className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 text-lg font-bold transition-colors">−</button>
                  <button className="w-8 h-8 rounded-lg bg-vortt-orange text-white flex items-center justify-center text-lg font-bold hover:bg-orange-600 transition-colors">+</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
