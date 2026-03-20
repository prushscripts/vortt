"use client";

export default function AboutPage() {
  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'AI Dispatch',
      desc: 'Assigns the right tech to every job based on location, certifications, and current workload. One tap to notify.',
      color: 'var(--orange)',
      colorRgb: '255,107,43',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      title: 'Job Tracking',
      desc: 'Create jobs, track status from scheduled to complete, log parts used, and generate invoices automatically.',
      color: 'var(--blue)',
      colorRgb: '10,132,255',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
      ),
      title: 'Contract Renewals',
      desc: 'Track maintenance contracts. Get alerts 30/60/90 days before renewal. AI drafts the outreach text for you.',
      color: 'var(--green)',
      colorRgb: '48,209,88',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" strokeWidth="2" strokeLinecap="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
      title: 'Inventory',
      desc: 'Track parts across vans and warehouse. Low stock alerts before you show up to a job missing what you need.',
      color: 'var(--yellow)',
      colorRgb: '255,214,10',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      ),
      title: 'Invoicing',
      desc: 'Generate professional invoices from completed jobs. Send via text or email. Track paid vs outstanding.',
      color: 'var(--green)',
      colorRgb: '48,209,88',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
      ),
      title: 'Mobile First',
      desc: 'Built for a phone, not a desktop. Your techs can update job status, log notes, and call customers from the field.',
      color: 'var(--orange)',
      colorRgb: '255,107,43',
    },
  ];

  const roadmap = [
    { phase: 'Phase 0', name: 'Foundation', status: 'done', desc: 'Brand, deployment, auth' },
    { phase: 'Phase 1', name: 'MVP Build', status: 'done', desc: 'Dispatch, jobs, customers, contracts' },
    { phase: 'Phase 2', name: 'Beta', status: 'active', desc: 'Real contractors, feedback, iteration' },
    { phase: 'Phase 3', name: 'Growth', status: 'upcoming', desc: 'AI features, SMS, Stripe billing' },
    { phase: 'Phase 4', name: 'Scale', status: 'upcoming', desc: 'Parts tracking, finance, review autopilot' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      {/* Section 1: Hero block */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,107,43,0.08) 0%, transparent 60%)',
        border: '1px solid rgba(255,107,43,0.15)',
        borderRadius: 20,
        padding: '40px 36px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow orb */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,43,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255,107,43,0.4)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 800,
            fontSize: 22, color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>VORTT</span>
          <span style={{
            background: 'rgba(48,209,88,0.12)', color: 'var(--green)',
            border: '1px solid rgba(48,209,88,0.25)',
            borderRadius: 6, padding: '3px 10px',
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>Beta</span>
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 32,
          color: 'var(--text-primary)', margin: '0 0 12px',
          lineHeight: 1.2, letterSpacing: '-0.02em',
        }}>
          The AI operations brain<br />for HVAC contractors.
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: 16,
          lineHeight: 1.6, margin: 0, maxWidth: 520,
        }}>
          Built for 3–15 truck shops who are too busy running jobs
          to run their business. VORTT handles dispatch, scheduling,
          contracts, and invoicing — so you can focus on the work.
        </p>
      </div>

      {/* Section 2: What VORTT does — feature grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        {features.map(f => (
          <div key={f.title} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderRadius: 14, padding: 20,
            transition: 'border-color 0.15s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,107,43,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bg-border)'}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `rgba(${f.colorRgb},0.12)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>{f.icon}</div>
            <p style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15,
              color: 'var(--text-primary)', margin: '0 0 6px',
            }}>{f.title}</p>
            <p style={{
              fontSize: 13, color: 'var(--text-secondary)',
              lineHeight: 1.55, margin: 0,
            }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 3: Who this is for */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
        borderRadius: 16, padding: 24, marginBottom: 24,
      }}>
        <h2 style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18,
          color: 'var(--text-primary)', margin: '0 0 16px',
        }}>Built for the 3–15 truck shop</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Target customer', value: 'HVAC contractor, 3–15 trucks' },
            { label: 'Owner age', value: '26–40, mobile-native' },
            { label: 'Current tools', value: 'Whiteboard, group texts, memory' },
            { label: 'Why VORTT', value: 'ServiceTitan costs $1,500/mo and needs an ops team' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '14px 16px',
              background: 'var(--bg-elevated)',
              borderRadius: 10,
            }}>
              <p style={{
                fontSize: 11, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                margin: '0 0 4px'
              }}>{item.label}</p>
              <p style={{
                fontSize: 14, color: 'var(--text-primary)',
                fontWeight: 600, margin: 0
              }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Roadmap status */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
        borderRadius: 16, padding: 24, marginBottom: 24,
      }}>
        <h2 style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18,
          color: 'var(--text-primary)', margin: '0 0 20px'
        }}>
          Where we are
        </h2>

        {roadmap.map((item, i) => (
          <div key={item.phase} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            paddingBottom: i < roadmap.length - 1 ? 20 : 0,
            position: 'relative',
          }}>
            {/* Timeline dot + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: item.status === 'done' ? 'rgba(48,209,88,0.15)' :
                  item.status === 'active' ? 'rgba(255,107,43,0.15)' :
                    'var(--bg-elevated)',
                border: `2px solid ${item.status === 'done' ? 'var(--green)' :
                  item.status === 'active' ? 'var(--orange)' :
                    'var(--bg-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>
                {item.status === 'done' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="var(--green)" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : item.status === 'active' ? (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--orange)',
                    animation: 'glowPulse 2s infinite'
                  }} />
                ) : (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--bg-border)'
                  }} />
                )}
              </div>
              {i < roadmap.length - 1 && (
                <div style={{
                  width: 2, flex: 1, marginTop: 4,
                  background: item.status === 'done'
                    ? 'rgba(48,209,88,0.3)'
                    : 'var(--bg-border)',
                  minHeight: 20,
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14,
                  color: 'var(--text-primary)'
                }}>{item.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.phase}</span>
                {item.status === 'active' && (
                  <span style={{
                    background: 'rgba(255,107,43,0.12)', color: 'var(--orange)',
                    border: '1px solid rgba(255,107,43,0.25)',
                    borderRadius: 4, padding: '1px 7px',
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  }}>Active</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Section 5: Footer note */}
      <div style={{
        textAlign: 'center', padding: '20px 0 8px',
        borderTop: '1px solid var(--bg-border)',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 4px' }}>
          VORTT is in active development.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
          Built for the trades. Runs on AI. No enterprise contract required.
        </p>
      </div>
    </div>
  );
}
