"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, Wrench, CheckCircle, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPhone } from "@/lib/utils/format";
import type { Tech } from "@/types";

const mockTechs: Tech[] = [
  { id: "t1", companyId: "c1", name: "Jake Torres", phone: "5120001111", email: "jake@smithhvac.com", skills: ["refrigerant_certified", "electrical", "commercial"], isActive: true, lat: 30.2729, lng: -97.7444, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: "t2", companyId: "c1", name: "Marcus Webb", phone: "5120002222", email: "marcus@smithhvac.com", skills: ["electrical"], isActive: true, lat: 30.2951, lng: -97.7532, lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(), createdAt: new Date().toISOString() },
  { id: "t3", companyId: "c1", name: "Devon Hall", phone: "5120003333", skills: ["refrigerant_certified"], isActive: true, lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(), createdAt: new Date().toISOString() },
  { id: "t4", companyId: "c1", name: "Riley Chen", phone: "5120004444", email: "riley@smithhvac.com", skills: ["electrical", "commercial"], isActive: false, createdAt: new Date().toISOString() },
];

const skillLabels: Record<string, string> = {
  refrigerant_certified: "Refrigerant Cert.",
  electrical: "Electrical",
  commercial: "Commercial",
};

export default function TechsPage() {
  const [techs, setTechs] = useState<Tech[]>(mockTechs);

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then(({ companyId: cid }: { companyId?: string }) => {
        if (!cid) return;
        return fetch(`/api/techs?companyId=${cid}`)
          .then((r) => r.json())
          .then((d: Tech[]) => {
            if (Array.isArray(d) && d.length > 0) setTechs(d);
          });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Technicians</h1>
          <p className="text-zinc-500 text-sm">{techs.filter(t => t.isActive).length} active</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          Add Tech
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techs.map((tech) => (
          <Card key={tech.id} hover>
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-vortt-orange/10 flex items-center justify-center">
                  <span className="font-heading font-bold text-xl text-vortt-orange">
                    {tech.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${tech.isActive ? "bg-vortt-green" : "bg-zinc-300"}`} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-vortt-charcoal">{tech.name}</h3>

                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <a href={`tel:${tech.phone}`} className="text-sm text-zinc-500 hover:text-vortt-orange transition-colors">
                    {formatPhone(tech.phone)}
                  </a>
                </div>

                {tech.lastSeen && (
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-400">
                      {tech.lat && tech.lng ? "Location active" : "No location"} · last seen {new Date(tech.lastSeen).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tech.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded-lg bg-orange-50 text-vortt-orange border border-orange-100 font-medium"
                    >
                      {skillLabels[skill] ?? skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-50">
              <a href={`tel:${tech.phone}`} className="flex-1">
                <Button variant="ghost" size="sm" fullWidth>
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </a>
              <Button variant="ghost" size="sm" className="flex-1">
                View Jobs
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
