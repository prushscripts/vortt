'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoggingOut(true)
    
    setTimeout(async () => {
      await supabase.auth.signOut()
      router.push('/login')
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {loggingOut && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10002,
          background: '#0E0E10',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 20,
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{position:'relative', width:60, height:60}}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: 4, height: 4,
                borderRadius: '50%',
                background: 'rgba(255,107,43,0.6)',
                top: '50%', left: '50%',
                animation: `particleFly 1.2s ease-out forwards`,
                animationDelay: `${i * 0.08}s`,
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
              }}/>
            ))}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--orange)',
                animation: 'shrinkFade 1.2s ease forwards',
              }}/>
            </div>
          </div>
          <p style={{
            fontFamily: 'Space Grotesk', fontWeight: 600,
            fontSize: 14, color: 'var(--text-muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Signing out...</p>
        </div>
      )}

      {!loggingOut && (
        <div style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-border)',
          borderRadius: 20,
          padding: '32px 28px',
          width: 'calc(100% - 48px)',
          maxWidth: 360,
          animation: 'slideUpFade 0.25s ease',
          textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,69,58,0.1)',
            border: '1px solid rgba(255,69,58,0.2)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" 
                 fill="none" stroke="var(--red)" strokeWidth="1.8"
                 strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>

          <h3 style={{
            fontFamily: 'Space Grotesk', fontWeight: 700,
            fontSize: 20, color: 'var(--text-primary)',
            margin: '0 0 8px',
          }}>Sign out of VORTT?</h3>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 14,
            margin: '0 0 28px', lineHeight: 1.5,
          }}>
            You'll need to sign back in to access your dashboard.
          </p>

          <div style={{display:'flex', gap:10}}>
            <button
              onClick={onClose}
              style={{
                flex: 1, height: 48,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--bg-border)',
                borderRadius: 12, color: 'var(--text-secondary)',
                fontFamily: 'Space Grotesk', fontWeight: 600,
                fontSize: 15, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              style={{
                flex: 1, height: 48,
                background: 'rgba(255,69,58,0.12)',
                border: '1px solid rgba(255,69,58,0.3)',
                borderRadius: 12, color: 'var(--red)',
                fontFamily: 'Space Grotesk', fontWeight: 700,
                fontSize: 15, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,69,58,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,69,58,0.12)'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
