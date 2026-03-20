"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, Wrench, CheckCircle, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPhone } from "@/lib/utils/format";
import type { Tech } from "@/types";


const skillLabels: Record<string, string> = {
  refrigerant_certified: "Refrigerant Cert.",
  electrical: "Electrical",
  commercial: "Commercial",
};

export default function TechsPage() {
  const [techs, setTechs] = useState<Tech[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then(({ companyId: cid }: { companyId?: string }) => {
        if (!cid) {
          setDataLoaded(true);
          return;
        }
        return fetch(`/api/techs?companyId=${cid}`)
          .then((r) => r.json())
          .then((d: Tech[]) => {
            const list = Array.isArray(d) ? d : [];
            setTechs(list);
            setDataLoaded(true);
          });
      })
      .catch(() => {
        setDataLoaded(true);
      });
  }, []);

  return (
    <div className="space-y-5">
      <div style={{
        display: 'flex', justifyContent: 'space-between', 
        alignItems: 'flex-start', marginBottom: 24
      }}>
        <div>
          <h1 style={{fontFamily:'Space Grotesk',fontWeight:800,fontSize:28,
                      color:'var(--text-primary)',margin:0,letterSpacing:'-0.02em'}}>
            Technicians
          </h1>
          <p style={{color:'var(--text-secondary)',fontSize:14,marginTop:4}}>
            {techs.filter(t => t.isActive).length} active
          </p>
        </div>
        <button style={{
          height:40, background:'var(--orange)', color:'white',
          border:'none', borderRadius:10, padding:'0 18px',
          fontFamily:'Space Grotesk', fontWeight:600, fontSize:14,
          cursor:'pointer', boxShadow:'0 4px 16px rgba(255,107,43,0.3)',
          flexShrink:0, alignSelf:'center',
          transition:'all 0.15s ease',
        }}>+ Add Tech</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        {dataLoaded && techs.length === 0 && (
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
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <p style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:18, color:'var(--text-primary)', margin:0}}>
                No technicians added
              </p>
              <p style={{color:'var(--text-secondary)', fontSize:14, marginTop:6, margin:'6px 0 0'}}>
                Add your techs to start assigning jobs
              </p>
            </div>
            <a href="#" style={{
              background: 'var(--orange)', color: 'white', borderRadius: 10,
              padding: '10px 24px', fontFamily: 'Space Grotesk', fontWeight: 600,
              fontSize: 14, textDecoration: 'none', marginTop: 8,
              boxShadow: '0 4px 16px rgba(255,107,43,0.3)'
            }}>+ Add Tech</a>
          </div>
        )}
        {dataLoaded && techs.map((tech) => (
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
