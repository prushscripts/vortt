'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FeedbackPage() {
  const router = useRouter()
  const [type, setType] = useState<'bug'|'feature'|'general'>('general')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, rating, message }),
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const labelStyle = {
    fontSize: 11, textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', color: 'var(--text-muted)',
    display: 'block', marginBottom: 6,
    fontFamily: 'Space Grotesk',
  }

  const inputStyle = {
    width: '100%', height: 48,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--bg-border)',
    borderRadius: 10, padding: '0 14px',
    color: 'var(--text-primary)', fontSize: 15,
    outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: 'Manrope',
  }

  if (submitted) return (
    <div style={{
      maxWidth: 560, margin: '0 auto', padding: '60px 16px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 16, textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(48,209,88,0.12)',
        border: '1px solid rgba(48,209,88,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="#30D158" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 style={{fontFamily:'Space Grotesk',fontWeight:700,
                  fontSize:22,color:'var(--text-primary)',margin:0}}>
        Thanks for the feedback
      </h2>
      <p style={{color:'var(--text-secondary)',fontSize:14,
                 margin:0,maxWidth:300,lineHeight:1.6}}>
        Every submission is read personally and shapes what gets built next.
      </p>
      <button
        onClick={() => router.push('/dashboard')}
        style={{
          marginTop: 8, background: 'var(--orange)', color: 'white',
          border: 'none', borderRadius: 10, padding: '12px 28px',
          fontFamily: 'Space Grotesk', fontWeight: 600,
          fontSize: 14, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(255,107,43,0.3)',
        }}
      >Back to Dashboard</button>
    </div>
  )

  return (
    <div style={{maxWidth: 560, margin: '0 auto', padding: '24px 16px'}}>
      {/* Header */}
      <div style={{marginBottom: 28}}>
        <h1 style={{fontFamily:'Space Grotesk',fontWeight:800,
                    fontSize:26,color:'var(--text-primary)',
                    margin:0,letterSpacing:'-0.02em'}}>
          Send Feedback
        </h1>
        <p style={{color:'var(--text-secondary)',fontSize:14,marginTop:6}}>
          Tell us what's working, broken, or what you wish existed.
        </p>
      </div>

      {/* Type selector */}
      <div style={{marginBottom: 20}}>
        <label style={labelStyle}>TYPE</label>
        <div style={{display:'flex',gap:8}}>
          {([
            {id:'bug',label:'🐛 Bug'},
            {id:'feature',label:'💡 Feature'},
            {id:'general',label:'💬 General'},
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              style={{
                flex: 1, height: 40,
                background: type === t.id
                  ? 'rgba(255,107,43,0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${type === t.id
                  ? 'rgba(255,107,43,0.4)' : 'var(--bg-border)'}`,
                borderRadius: 10,
                color: type === t.id ? 'var(--orange)' : 'var(--text-secondary)',
                fontFamily: 'Space Grotesk', fontWeight: 600,
                fontSize: 13, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div style={{marginBottom: 20}}>
        <label style={labelStyle}>RATING (OPTIONAL)</label>
        <div style={{display:'flex',gap:8}}>
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => setRating(rating === n ? 0 : n)}
              style={{
                width: 44, height: 44, borderRadius: 10,
                background: rating >= n
                  ? 'rgba(255,107,43,0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${rating >= n
                  ? 'rgba(255,107,43,0.4)' : 'var(--bg-border)'}`,
                color: rating >= n ? 'var(--orange)' : 'var(--text-muted)',
                fontSize: 20, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >★</button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div style={{marginBottom: 24}}>
        <label style={labelStyle}>YOUR FEEDBACK</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Be specific — what page, what happened, what did you expect?"
          rows={5}
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            borderRadius: 12, padding: '14px 16px',
            color: 'var(--text-primary)', fontSize: 15,
            outline: 'none', resize: 'vertical',
            fontFamily: 'Manrope', lineHeight: 1.5,
            boxSizing: 'border-box' as const,
            colorScheme: 'dark',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--orange)'}
          onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !message.trim()}
        style={{
          width: '100%', height: 52,
          background: message.trim() ? 'var(--orange)' : 'var(--bg-elevated)',
          border: 'none', borderRadius: 12,
          color: message.trim() ? 'white' : 'var(--text-muted)',
          fontFamily: 'Space Grotesk', fontWeight: 700,
          fontSize: 16, cursor: message.trim() ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s ease',
          boxShadow: message.trim()
            ? '0 4px 20px rgba(255,107,43,0.35)' : 'none',
        }}
      >
        {submitting ? 'Sending...' : 'Send Feedback'}
      </button>
    </div>
  )
}
