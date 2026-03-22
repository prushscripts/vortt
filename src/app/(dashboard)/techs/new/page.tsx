'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTechPage() {
  const router = useRouter()
  const [companyId, setCompanyId] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    certifications: [] as string[],
  })
  const [saving, setSaving] = useState(false)

  const certs = [
    'Refrigerant Cert (EPA 608)',
    'Electrical',
    'Commercial',
    'Sheet Metal',
  ]

  useEffect(() => {
    fetch('/api/auth/company', { method: 'POST' })
      .then(r => r.json())
      .then(d => { if (d.companyId) setCompanyId(d.companyId) })
  }, [])

  const toggleCert = (cert: string) => {
    setForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert],
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !companyId) return
    setSaving(true)
    try {
      const res = await fetch('/api/techs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, companyId }),
      })
      if (res.ok) router.push('/techs')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', height: 48,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--bg-border)',
    borderRadius: 10, padding: '0 14px',
    color: 'var(--text-primary)', fontSize: 15,
    outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: 'Manrope', colorScheme: 'dark' as const,
  }

  const labelStyle = {
    fontSize: 11, textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', color: 'var(--text-muted)',
    display: 'block', marginBottom: 6,
    fontFamily: 'Space Grotesk',
  }

  return (
    <div style={{maxWidth: 600, margin: '0 auto', padding: '24px 16px'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:28}}>
        <button onClick={() => router.back()} style={{
          width:36, height:36, borderRadius:10,
          background:'var(--bg-elevated)',
          border:'1px solid var(--bg-border)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', flexShrink:0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="var(--text-secondary)" strokeWidth="2"
               strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h1 style={{fontFamily:'Space Grotesk',fontWeight:800,
                      fontSize:24,color:'var(--text-primary)',margin:0}}>
            Add Technician
          </h1>
          <p style={{color:'var(--text-secondary)',fontSize:13,
                     margin:'2px 0 0'}}>
            Add a tech to your crew
          </p>
        </div>
      </div>

      {/* Form card */}
      <div style={{
        background:'var(--bg-surface)',
        border:'1px solid var(--bg-border)',
        borderRadius:16, padding:24, marginBottom:16,
      }}>
        <p style={{
          fontFamily:'Space Grotesk',fontWeight:700,fontSize:12,
          color:'var(--text-muted)',textTransform:'uppercase',
          letterSpacing:'0.08em',margin:'0 0 16px',
        }}>Tech Info</p>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <label style={labelStyle}>FULL NAME *</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({...p, name: e.target.value}))}
              placeholder="Jake Torres"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor='var(--orange)'}
              onBlur={e => e.target.style.borderColor='var(--bg-border)'}
            />
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              <label style={labelStyle}>PHONE</label>
              <input
                value={form.phone}
                onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                placeholder="(512) 000-0000"
                type="tel"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor='var(--orange)'}
                onBlur={e => e.target.style.borderColor='var(--bg-border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input
                value={form.email}
                onChange={e => setForm(p => ({...p, email: e.target.value}))}
                placeholder="jake@company.com"
                type="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor='var(--orange)'}
                onBlur={e => e.target.style.borderColor='var(--bg-border)'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div style={{
        background:'var(--bg-surface)',
        border:'1px solid var(--bg-border)',
        borderRadius:16, padding:24, marginBottom:24,
      }}>
        <p style={{
          fontFamily:'Space Grotesk',fontWeight:700,fontSize:12,
          color:'var(--text-muted)',textTransform:'uppercase',
          letterSpacing:'0.08em',margin:'0 0 16px',
        }}>Certifications</p>

        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {certs.map(cert => (
            <label key={cert} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'12px 14px',
              background: form.certifications.includes(cert)
                ? 'rgba(255,107,43,0.08)' : 'var(--bg-elevated)',
              border: `1px solid ${form.certifications.includes(cert)
                ? 'rgba(255,107,43,0.3)' : 'var(--bg-border)'}`,
              borderRadius:10, cursor:'pointer',
              transition:'all 0.15s ease',
            }}>
              <div style={{
                width:20, height:20, borderRadius:6, flexShrink:0,
                background: form.certifications.includes(cert)
                  ? 'var(--orange)' : 'var(--bg-elevated)',
                border: `2px solid ${form.certifications.includes(cert)
                  ? 'var(--orange)' : 'var(--bg-border)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.15s ease',
              }}>
                {form.certifications.includes(cert) && (
                  <svg width="10" height="10" viewBox="0 0 24 24"
                       fill="none" stroke="white" strokeWidth="3"
                       strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={form.certifications.includes(cert)}
                onChange={() => toggleCert(cert)}
                style={{display:'none'}}
              />
              <span style={{
                fontSize:14, fontFamily:'Manrope',
                color: form.certifications.includes(cert)
                  ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}>{cert}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:12}}>
        <button onClick={() => router.back()} style={{
          height:52, background:'var(--bg-elevated)',
          border:'1px solid var(--bg-border)', borderRadius:12,
          color:'var(--text-secondary)', fontFamily:'Space Grotesk',
          fontWeight:600, fontSize:15, cursor:'pointer',
        }}>Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={saving || !form.name.trim()}
          style={{
            height:52,
            background: form.name.trim() ? 'var(--orange)' : 'var(--bg-elevated)',
            border:'none', borderRadius:12,
            color: form.name.trim() ? 'white' : 'var(--text-muted)',
            fontFamily:'Space Grotesk', fontWeight:700,
            fontSize:15, cursor: form.name.trim() ? 'pointer' : 'not-allowed',
            boxShadow: form.name.trim()
              ? '0 4px 20px rgba(255,107,43,0.35)' : 'none',
            transition:'all 0.15s ease',
          }}
        >
          {saving ? 'Saving...' : 'Add Tech'}
        </button>
      </div>
    </div>
  )
}
