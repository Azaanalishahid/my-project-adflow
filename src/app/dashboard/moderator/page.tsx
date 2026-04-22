'use client'

import { useState, useEffect } from 'react'
import { Ad } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { CheckCircle, XCircle, ExternalLink, Loader2, Inbox } from 'lucide-react'
import Link from 'next/link'

export default function ModeratorDashboard() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { fetchQueue() }, [])

  const fetchQueue = async () => {
    setLoading(true)
    const res = await fetch('/api/moderator/review')
    const data = await res.json()
    if (Array.isArray(data)) setAds(data)
    setLoading(false)
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id)
    const res = await fetch('/api/moderator/action', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    })
    if (res.ok) setAds(prev => prev.filter(a => a.id !== id))
    setActionLoading(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', padding: '3.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '3.5rem' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'block', height: '4px', width: '2.5rem', background: 'var(--primary)', borderRadius: '9999px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--primary)' }}>
              Content Integrity
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1 }}>
              Review Queue
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: 'rgba(16,185,129,0.05)', border: '1px solid var(--primary)', borderRadius: '1rem', boxShadow: '0 0 30px var(--primary-glow)' }}>
              <span className="animate-pulse" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{ads.length} Operational Tasks</span>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '1.5rem' }}>
            <Loader2 className="animate-spin" size={56} style={{ color: 'var(--primary)' }} />
            <span style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em' }}>ANALYZING INBOUND DATA...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {ads.map((ad, idx) => (
              <div
                key={ad.id}
                className="premium-card animate-fade-in"
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '2.5rem', 
                  alignItems: 'center', 
                  padding: '2.5rem',
                  animationDelay: `${idx * 0.05}s`,
                  borderLeft: '4px solid var(--primary)'
                }}
              >
                {/* Visual Asset */}
                <div style={{ position: 'relative', width: '320px', maxWidth: '100%', height: '180px', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: '-8px', background: 'var(--primary)', opacity: 0.05, filter: 'blur(15px)', borderRadius: '1.5rem' }} />
                  <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={ad.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>

                {/* Narrative Details */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{ad.title}</h3>
                    <StatusBadge status={ad.status} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[`SENDER: ${ad.profiles?.email}`, `REGION: ${ad.city}`, `DOMAIN: ${ad.category}`].map((tag) => (
                      <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '0.5rem', padding: '0.375rem 0.875rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.8, fontStyle: 'italic', maxWidth: '600px', marginBottom: '1.5rem', borderLeft: '2px solid var(--border)', paddingLeft: '1.25rem' }}>
                    "{ad.description}"
                  </p>

                  <Link
                    href={`/ads/${ad.id}`}
                    target="_blank"
                    className="btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.85rem', padding: '0.625rem 1.25rem', textDecoration: 'none' }}
                  >
                    Deep Audit Campaign <ExternalLink size={16} />
                  </Link>
                </div>

                {/* Decision Nexus */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleAction(ad.id, 'approve')}
                    disabled={actionLoading === ad.id}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.125rem' }}
                  >
                    {actionLoading === ad.id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                    Authorize Asset
                  </button>
                  <button
                    onClick={() => handleAction(ad.id, 'reject')}
                    disabled={actionLoading === ad.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                      width: '100%', padding: '1.125rem', borderRadius: '1rem',
                      background: 'rgba(244,63,94,0.03)', border: '1px solid rgba(244,63,94,0.1)',
                      color: '#fb7185', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.08)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.03)' }}
                  >
                    {actionLoading === ad.id ? <Loader2 size={20} className="animate-spin" /> : <XCircle size={20} />}
                    Decline Asset
                  </button>
                </div>
              </div>
            ))}

            {ads.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem', textAlign: 'center', background: 'var(--surface-1)', border: '2px dashed var(--border)', borderRadius: '2.5rem' }}>
                <div style={{ width: '6rem', height: '6rem', borderRadius: '2rem', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 0 50px var(--primary-glow)' }}>
                  <Inbox size={40} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Operational Efficiency</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px' }}>Review queue successfully neutralized. All incoming assets have been processed.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
