"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatRelative } from "@/lib/utils/format";
import { createClient } from "@/lib/supabase/client";
import type { DashboardMetrics } from "@/types";

const mockMetrics: DashboardMetrics = {
  todayJobs: 12,
  assignedJobs: 9,
  unassignedJobs: 3,
  revenueThisMonth: 48200,
  revenueCollected: 31500,
  revenueOutstanding: 16700,
  contractsExpiringSoon: 7,
  contractsExpiringValue: 9800,
  techUtilization: [
    { techId: "1", techName: "Jake Torres", jobsToday: 4, hoursWorked: 6.5, jobsCompleted: 3 },
    { techId: "2", techName: "Marcus Webb", jobsToday: 3, hoursWorked: 5, jobsCompleted: 2 },
    { techId: "3", techName: "Devon Hall", jobsToday: 3, hoursWorked: 4, jobsCompleted: 3 },
    { techId: "4", techName: "Riley Chen", jobsToday: 2, hoursWorked: 3, jobsCompleted: 1 },
  ],
  recentActivity: [
    { id: "1", type: "job_completed", description: "Jake completed AC repair — Smith Residence", timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: "2", type: "invoice_sent", description: "Invoice #1042 sent to Maria Gonzalez — $850", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: "3", type: "job_created", description: "New emergency call — Johnson HVAC failure", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: "4", type: "review_sent", description: "Review request sent to Tom Bradley", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: "5", type: "contract_renewed", description: "Contract renewed — Davis Family, $399/yr", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  ],
};

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <Card>
      <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-2">{label}</p>
      <p className="font-heading font-bold text-3xl text-[#F8F8FA] leading-none" style={accent ? { color: accent } : {}}>
        {value}
      </p>
      {sub && <p className="text-xs text-[rgba(248,248,250,0.38)] mt-1.5">{sub}</p>}
    </Card>
  );
}

function DashboardBody({ m, userName }: { m: DashboardMetrics; userName: string }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h2 className="font-heading font-bold text-2xl text-[#F8F8FA]">Good morning{userName ? `, ${userName}` : ''}</h2>
        </div>
        <Link href="/dispatch">
          <Button
            size="md"
            style={{
              background: "var(--orange)",
              color: "white",
              border: "none",
              borderRadius: 10,
              height: 44,
              padding: "0 20px",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(255,107,43,0.4)",
              animation: "glowPulse 2.5s ease-in-out infinite",
              transition: "all 0.15s ease",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,107,43,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,107,43,0.4)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          >
            Run AI Dispatch
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/jobs/new", label: "New Job" },
          { href: "/customers/new", label: "Add Customer" },
          { href: "/dispatch", label: "Dispatch" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}>
            <Card hover padding="sm" className="text-center py-4">
              <p className="text-xs font-medium text-[rgba(248,248,250,0.65)]">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Jobs Today" value={String(m.todayJobs)} sub={`${m.unassignedJobs} unassigned`} />
        <StatCard label="Revenue MTD" value={formatCurrency(m.revenueThisMonth)} sub="this month" />
        <StatCard label="Outstanding" value={formatCurrency(m.revenueOutstanding)} sub="uncollected" accent="#F59E0B" />
        <StatCard label="Expiring" value={String(m.contractsExpiringSoon)} sub={`${formatCurrency(m.contractsExpiringValue)} at risk`} accent="#F43F5E" />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider">Tech Utilization</p>
            <Link href="/techs" className="text-xs text-[#FF6B2B] hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {m.techUtilization.length === 0 ? (
              <p className="text-sm text-[rgba(248,248,250,0.38)]">
                No techs added yet · <Link href="/techs" className="text-[#FF6B2B] hover:underline">Add your first tech</Link>
              </p>
            ) : (
              m.techUtilization.map((tech) => {
                const pct = Math.round((tech.jobsCompleted / tech.jobsToday) * 100);
                return (
                  <div key={tech.techId} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#FF6B2B]"
                      style={{ background: "rgba(255,107,43,0.12)" }}
                    >
                      {tech.techName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[#F8F8FA] truncate">{tech.techName}</p>
                        <span className="text-xs text-[rgba(248,248,250,0.38)] ml-2 flex-shrink-0">{tech.jobsCompleted}/{tech.jobsToday}</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? "#22C55E" : "#FF6B2B" }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider">Dispatch Status</p>
            <Link href="/dispatch" className="text-xs text-[#FF6B2B] hover:underline">Open →</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "Assigned", value: m.assignedJobs, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
              { label: "Unassigned", value: m.unassignedJobs, color: "#F43F5E", bg: "rgba(244,63,94,0.1)" },
              { label: "Total", value: m.todayJobs, color: "#F8F8FA", bg: "rgba(255,255,255,0.06)" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="flex items-center justify-between px-3 py-2.5 rounded-[10px]" style={{ background: bg }}>
                <span className="text-sm text-[rgba(248,248,250,0.65)]">{label}</span>
                <span className="font-heading font-bold text-lg" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
          {m.unassignedJobs > 0 && (
            <Link href="/dispatch">
              <Button fullWidth variant="outline" size="sm" className="mt-3">
                ⚡ Run AI Dispatch
              </Button>
            </Link>
          )}
        </Card>
      </div>

      <Card>
        <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-4">Recent Activity</p>
        <div className="space-y-1">
          {m.recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-[rgba(255,107,43,0.05)] transition-colors">
                <span className="text-base w-6 flex-shrink-0">•</span>
                <p className="flex-1 text-sm text-[rgba(248,248,250,0.65)] min-w-0 truncate">{item.description}</p>
                <span className="text-xs text-[rgba(248,248,250,0.28)] flex-shrink-0 font-mono-label">{formatRelative(item.timestamp)}</span>
              </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function DashboardPageInner() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [metricsLoaded, setMetricsLoaded] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showBetaBanner, setShowBetaBanner] = useState(false);
  const [showDashboardTransition, setShowDashboardTransition] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem('vortt_welcome_seen');
    if (!seen) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showWelcome]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const meta = data.user.user_metadata;
        let name = '';
        
        if (meta?.first_name) {
          name = meta.first_name;
        } else if (meta?.full_name) {
          name = meta.full_name.split(' ')[0];
        } else if (data.user.email) {
          const prefix = data.user.email.split('@')[0];
          name = prefix.charAt(0).toUpperCase() + prefix.slice(1, 12);
        }
        
        setUserName(name);
      }
    });
  }, []);


  const dismissWelcome = () => {
    localStorage.setItem('vortt_welcome_seen', 'true');
    setShowWelcome(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const bannerDismissed = localStorage.getItem('vortt_beta_banner_dismissed');
    if (!bannerDismissed) setShowBetaBanner(true);
  };

  const handleGetStarted = () => {
    localStorage.setItem('vortt_welcome_seen', 'true');
    setShowDashboardTransition(true);
    
    setTimeout(() => {
      setShowWelcome(false);
      setShowDashboardTransition(false);
      window.scrollTo(0, 0);
      const bannerDismissed = localStorage.getItem('vortt_beta_banner_dismissed');
      if (!bannerDismissed) setShowBetaBanner(true);
    }, 1800);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d?.companyId) {
          setMetricsLoaded(true);
          return Promise.resolve(null);
        }
        return fetch(`/api/dashboard/metrics?companyId=${d.companyId}`).then((r) => r.json());
      })
      .then((d: unknown) => {
        if (cancelled || !d || typeof d !== "object") return;
        const row = d as Record<string, unknown>;
        if ("error" in row && row.error) {
          setMetricsLoaded(true);
          return;
        }
        setMetrics({
          todayJobs: (row.jobsToday as number) ?? 0,
          assignedJobs: ((row.dispatchStatus as { assigned?: number })?.assigned) ?? 0,
          unassignedJobs: (row.unassigned as number) ?? 0,
          revenueThisMonth: (row.revenueMTD as number) ?? 0,
          revenueCollected: (row.revenueMTD as number) ?? 0,
          revenueOutstanding: (row.outstanding as number) ?? 0,
          contractsExpiringSoon: (row.expiringContracts as number) ?? 0,
          contractsExpiringValue: (row.atRiskValue as number) ?? 0,
          techUtilization: ((row.techUtilization as Array<{ id: string; name: string; assigned: number; completed: number }>) ?? []).map((t) => ({
            techId: t.id,
            techName: t.name,
            jobsToday: t.assigned || 1,
            hoursWorked: 0,
            jobsCompleted: t.completed || 0,
          })),
          recentActivity: ((row.recentActivity as Array<{ id: string; text: string; timestamp: string; type: string }>) ?? []).map((a) => ({
            id: a.id,
            type: a.type === "completed" ? "job_completed" : "job_created",
            description: a.text,
            timestamp: a.timestamp,
          })),
        });
        setMetricsLoaded(true);
      })
      .catch(() => {
        setMetricsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("subscribed") === "true") {
      setToastVisible(true);
      const timer = setTimeout(() => {
        setToastVisible(false);
        router.replace("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const m = useMemo(() => {
    if (metricsLoaded && metrics) return metrics;
    if (metricsLoaded && !metrics) {
      return {
        todayJobs: 0,
        assignedJobs: 0,
        unassignedJobs: 0,
        revenueThisMonth: 0,
        revenueCollected: 0,
        revenueOutstanding: 0,
        contractsExpiringSoon: 0,
        contractsExpiringValue: 0,
        techUtilization: [],
        recentActivity: [],
      };
    }
    return mockMetrics;
  }, [metrics, metricsLoaded]);

  return (
    <div className="space-y-6 animate-fade-in">
{/* Welcome Overlay */}
      {mounted && showWelcome && !showDashboardTransition && (
        <div className="welcome-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          background: 'rgba(14,14,16,0.96)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingTop: 20,
          paddingBottom: 100,
          paddingLeft: 16,
          paddingRight: 16,
          boxSizing: 'border-box' as const,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,107,43,0.2)',
            borderRadius: 24,
            padding: '28px 22px',
            position: 'relative',
            boxShadow: '0 0 80px rgba(255,107,43,0.08)',
          }}>
            <button onClick={dismissWelcome} style={{
              position: 'absolute', top: 14, right: 14,
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              color: 'var(--text-muted)',
              fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', lineHeight: 1,
              zIndex: 1,
            }}>×</button>

            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <div style={{
                width:40, height:40, borderRadius:12,
                background:'var(--orange)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 20px rgba(255,107,43,0.4)', flexShrink:0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span style={{fontFamily:'Space Grotesk',fontWeight:800,
                            fontSize:20,color:'var(--text-primary)'}}>VORTT</span>
              <div style={{
                background:'rgba(255,107,43,0.12)',
                border:'1px solid rgba(255,107,43,0.3)',
                borderRadius:6, padding:'3px 8px',
              }}>
                <span style={{color:'var(--orange)',fontSize:10,fontWeight:700,
                              textTransform:'uppercase',letterSpacing:'0.08em'}}>
                  Early Beta
                </span>
              </div>
            </div>

            <h2 style={{
              fontFamily:'Space Grotesk', fontWeight:800,
              fontSize:24, color:'var(--text-primary)',
              margin:'0 0 10px', lineHeight:1.2,
              letterSpacing:'-0.02em',
            }}>Welcome to VORTT</h2>

            <p style={{
              color:'var(--text-secondary)', fontSize:14,
              lineHeight:1.6, margin:'0 0 18px',
            }}>
              VORTT is an AI operations platform built for small HVAC 
              contractors. It handles dispatch, job tracking, maintenance 
              contracts, inventory, and invoicing — all from your phone.
            </p>

            <div style={{
              background:'rgba(255,214,10,0.06)',
              border:'1px solid rgba(255,214,10,0.2)',
              borderRadius:10, padding:'12px 14px',
              marginBottom:18,
              display:'flex', gap:10, alignItems:'flex-start',
            }}>
              <div style={{
                width:18, height:18, borderRadius:'50%',
                background:'rgba(255,214,10,0.15)',
                border:'1px solid rgba(255,214,10,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, marginTop:1,
              }}>
                <span style={{fontSize:10,color:'var(--yellow)',fontWeight:700}}>!</span>
              </div>
              <div>
                <p style={{fontFamily:'Space Grotesk',fontWeight:700,
                           fontSize:12,color:'var(--yellow)',margin:'0 0 3px'}}>
                  You're using an early beta version
                </p>
                <p style={{fontSize:12,color:'var(--text-secondary)',
                           margin:0,lineHeight:1.5}}>
                  Some features are still being built. Any names or data 
                  you see that aren't yours are placeholder examples — 
                  your real data is separate and private. Please report 
                  anything that seems off.
                </p>
              </div>
            </div>

            <p style={{
              fontFamily:'Space Grotesk', fontWeight:700,
              fontSize:11, color:'var(--text-muted)',
              textTransform:'uppercase', letterSpacing:'0.08em',
              margin:'0 0 10px',
            }}>TO GET STARTED</p>

            {[
              'Add your technicians under the Techs tab',
              'Add your first customer',
              'Create a job and assign it to a tech',
            ].map((step, i) => (
              <div key={i} style={{
                display:'flex', gap:12, alignItems:'center',
                padding:'10px 0',
                borderBottom: i < 2 ? '1px solid var(--bg-border)' : 'none',
              }}>
                <div style={{
                  width:24, height:24, borderRadius:'50%', flexShrink:0,
                  background:'rgba(255,107,43,0.12)',
                  border:'1px solid rgba(255,107,43,0.25)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <span style={{fontFamily:'Space Grotesk',fontWeight:700,
                                fontSize:11,color:'var(--orange)'}}>{i+1}</span>
                </div>
                <span style={{fontSize:13,color:'var(--text-secondary)'}}>
                  {step}
                </span>
              </div>
            ))}

            <div style={{
              marginTop:18, padding:'12px 14px',
              background:'var(--bg-elevated)',
              border:'1px solid var(--bg-border)',
              borderRadius:10,
              display:'flex', alignItems:'center',
              justifyContent:'space-between', gap:12,
            }}>
              <div>
                <p style={{fontFamily:'Space Grotesk',fontWeight:600,
                           fontSize:12,color:'var(--text-primary)',margin:0}}>
                  Found something broken?
                </p>
                <p style={{fontSize:11,color:'var(--text-muted)',margin:'2px 0 0'}}>
                  Your feedback shapes what gets built next.
                </p>
              </div>
              <button
                onClick={() => { dismissWelcome(); router.push('/feedback') }}
                style={{
                  background:'var(--orange)', color:'white',
                  borderRadius:8, padding:'7px 14px',
                  fontFamily:'Space Grotesk', fontWeight:600,
                  fontSize:12, border:'none', cursor:'pointer',
                  flexShrink:0,
                  boxShadow:'0 4px 12px rgba(255,107,43,0.3)',
                }}
              >Give Feedback</button>
            </div>

            <button
              onClick={handleGetStarted}
              style={{
                width:'100%', height:50, marginTop:14,
                background:'var(--orange)', border:'none',
                borderRadius:12, color:'white',
                fontFamily:'Space Grotesk', fontWeight:700,
                fontSize:15, cursor:'pointer',
                boxShadow:'0 4px 20px rgba(255,107,43,0.35)',
              }}
            >
              Take me to my dashboard →
            </button>
          </div>
        </div>
      )}

      {/* Dashboard transition — SEPARATE from welcome, renders on top */}
      {showDashboardTransition && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: 10001,
          background: '#0E0E10',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 24,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{position:'relative', width:80, height:80}}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                position:'absolute', inset:0,
                borderRadius:'50%',
                border:'1px solid rgba(255,107,43,0.4)',
                animation:'ringExpand 1.5s ease-out infinite',
                animationDelay:`${i * 0.4}s`,
              }}/>
            ))}
            <div style={{
              position:'absolute', inset:0,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{
                width:32, height:32, borderRadius:'50%',
                background:'var(--orange)',
                boxShadow:'0 0 24px rgba(255,107,43,0.6)',
                animation:'glowPulse 1s ease-in-out infinite',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
            </div>
          </div>
          <p style={{
            fontFamily:'Space Grotesk', fontWeight:600,
            fontSize:13, color:'var(--text-muted)',
            letterSpacing:'0.08em', textTransform:'uppercase',
          }}>Setting up your dashboard...</p>
        </div>
      )}

      {showBetaBanner && (
        <div style={{
          background:'rgba(255,214,10,0.06)',
          border:'1px solid rgba(255,214,10,0.15)',
          borderRadius:12, padding:'10px 16px',
          marginBottom:20,
          display:'flex', alignItems:'center',
          gap:10, justifyContent:'space-between',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{
              width:6,height:6,borderRadius:'50%',
              background:'var(--yellow)',flexShrink:0,
            }}/>
            <span style={{fontSize:13,color:'var(--text-secondary)'}}>
              <strong style={{color:'var(--yellow)'}}>Early Beta</strong>
              {' '}— some features are still being built. 
              <a href="/feedback" style={{
                color:'var(--orange)',marginLeft:6,textDecoration:'none',
                fontWeight:600,
              }}>Send feedback →</a>
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('vortt_beta_banner_dismissed','true');
              setShowBetaBanner(false);
            }}
            style={{
              background:'transparent',border:'none',
              color:'var(--text-muted)',fontSize:16,
              cursor:'pointer',padding:'0 4px',flexShrink:0,
            }}
          >×</button>
        </div>
      )}

      {!metricsLoaded ? (
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 14,
              padding: 20,
              marginBottom: 10,
              opacity: 1 - i * 0.15,
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
        </div>
      ) : (
        <DashboardBody m={m} userName={userName} />
      )}
      {toastVisible ? (
        <div
          className="fixed bottom-6 right-6 rounded-[14px] px-5 py-4"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--green)" }}
        >
          <p className="text-sm text-[var(--text-primary)]">
            Welcome to VORTT! Your 14-day free trial has started.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<div className="space-y-6 animate-fade-in"><DashboardBody m={mockMetrics} userName="" /></div>}>
      <DashboardPageInner />
    </ErrorBoundary>
  );
}
