import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'VORTT — AI Operations for HVAC Contractors'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#0E0E10',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,43,0.15) 0%, transparent 70%)',
          display: 'flex',
        }}/>

        {/* Bottom left glow */}
        <div style={{
          position: 'absolute',
          bottom: -150,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,43,0.08) 0%, transparent 70%)',
          display: 'flex',
        }}/>

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,107,43,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,43,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }}/>

        {/* Logo mark */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 48,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: '#FF6B2B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(255,107,43,0.5)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'sans-serif',
            fontWeight: 800,
            fontSize: 36,
            color: '#F5F5F7',
            letterSpacing: '-1px',
          }}>VORTT</span>
          <div style={{
            background: 'rgba(48,209,88,0.15)',
            border: '1px solid rgba(48,209,88,0.3)',
            borderRadius: 6,
            padding: '4px 12px',
            display: 'flex',
          }}>
            <span style={{
              color: '#30D158',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'sans-serif',
            }}>Beta</span>
          </div>
        </div>

        {/* Main headline */}
        <div style={{
          fontSize: 64,
          fontWeight: 800,
          color: '#F5F5F7',
          fontFamily: 'sans-serif',
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: 24,
          maxWidth: 700,
          display: 'flex',
          flexWrap: 'wrap',
        }}>
          Run your shop smarter.
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 24,
          color: '#8E8E93',
          fontFamily: 'sans-serif',
          lineHeight: 1.4,
          maxWidth: 600,
          marginBottom: 48,
          display: 'flex',
        }}>
          AI dispatch, job tracking, and contract management 
          for HVAC contractors.
        </div>

        {/* Feature pills */}
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          {[
            'AI Dispatch',
            'Job Tracking', 
            'Contract Renewals',
            'Mobile First',
            'Invoicing',
          ].map(feature => (
            <div key={feature} style={{
              background: 'rgba(255,107,43,0.1)',
              border: '1px solid rgba(255,107,43,0.25)',
              borderRadius: 8,
              padding: '8px 16px',
              display: 'flex',
            }}>
              <span style={{
                color: '#FF6B2B',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'sans-serif',
              }}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Bottom right URL */}
        <div style={{
          position: 'absolute',
          bottom: 48,
          right: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            color: '#48484A',
            fontSize: 18,
            fontFamily: 'sans-serif',
            fontWeight: 500,
          }}>vortt.app</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
