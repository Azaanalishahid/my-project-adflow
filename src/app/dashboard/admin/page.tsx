'use client'

import { useState, useEffect } from 'react'
import { Ad } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { CheckCircle, Rocket, Loader2, DollarSign, Clock, ShieldAlert, CreditCard, RefreshCw, AlertTriangle, Globe, Zap } from 'lucide-react'

export default function AdminDashboard() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    fetchApproved()
  }, [])

  const fetchApproved = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch('/api/admin/approved')
      const data = await res.json()
      if (!res.ok) {
        setFetchError(data.error || `HTTP Error ${res.status}`)
      } else if (Array.isArray(data)) {
        setAds(data)
      }
    } catch (err: any) {
      setFetchError(err.message)
    }
    setLoading(false)
  }

  const handleAction = async (id: string, action: string, paymentId?: string) => {
    setActionLoading(id)
    const res = await fetch('/api/admin/action', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, paymentId })
    })
    if (res.ok) {
      fetchApproved()
    }
    setActionLoading(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', padding: '3.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '3.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ display: 'block', height: '4px', width: '2.5rem', background: 'var(--primary)', borderRadius: '9999px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--primary)' }}>
                System Authority
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1 }}>
              Operations Center
            </h1>
          </div>

          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={fetchApproved}
              className="btn-secondary"
              style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={16} /> Sync Queue
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1.5rem', background: 'var(--surface-1)', border: '1px solid var(--primary)', borderRadius: '0.875rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 0 30px var(--primary-glow)' }}>
              <ShieldAlert size={18} /> Admin Core
            </div>
          </div>
        </div>

        {/* ── Metrics Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Operations', value: ads.length, color: 'var(--primary)', icon: <RefreshCw size={20} /> },
            { label: 'Pending Verification', value: ads.filter(a => a.status === 'payment_pending').length, color: 'var(--accent)', icon: <CreditCard size={20} /> },
            { label: 'Ready for Launch', value: ads.filter(a => a.status === 'verified').length, color: 'var(--secondary)', icon: <Rocket size={20} /> },
            { label: 'Inbound Revenue', value: `$${ads.reduce((acc, a) => acc + (a.price || 0), 0).toFixed(0)}`, color: '#fff', icon: <DollarSign size={20} /> },
          ].map(stat => (
            <div key={stat.label} className="premium-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                 <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b' }}>{stat.label}</span>
                 <span style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Error Notification ── */}
        {fetchError && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '1.25rem', padding: '1.25rem 2rem', marginBottom: '2rem' }}>
            <AlertTriangle size={24} style={{ color: '#fb7185' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>System Sync Error: {fetchError}</p>
              <p style={{ color: '#fb7185', fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.8 }}>Verify your network connectivity and API keys.</p>
            </div>
          </div>
        )}

        {/* ── Operational Queue ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '1.5rem' }}>
            <Loader2 className="animate-spin" size={56} style={{ color: 'var(--primary)' }} />
            <span style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em' }}>RECONSTRUCTING QUEUE...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {ads.map((ad: any, idx: number) => {
              const payment = ad.payments?.[0]
              const canVerify = ad.status === 'payment_pending' && payment
              const canPublish = ad.status === 'verified'

              return (
                <div
                  key={ad.id}
                  className="premium-card animate-fade-in"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    alignItems: 'center',
                    padding: '2rem',
                    animationDelay: `${idx * 0.05}s`,
                    borderLeft: canPublish ? '4px solid var(--secondary)' : canVerify ? '4px solid var(--primary)' : '4px solid var(--border)',
                  }}
                >
                  {/* Thumbnail with Status Glow */}
                  <div style={{ position: 'relative', width: '6rem', height: '6rem', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: '-8px', background: canPublish ? 'var(--secondary)' : canVerify ? 'var(--primary)' : 'transparent', opacity: 0.1, filter: 'blur(12px)', borderRadius: '1.25rem' }} />
                    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={ad.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>

                  {/* Core Content */}
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{ad.title}</h3>
                      <StatusBadge status={ad.status} />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Globe size={16} /> {ad.profiles?.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 800 }}>
                        <DollarSign size={16} /> {ad.price}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Zap size={16} /> {ad.package}
                      </div>
                    </div>

                    {payment && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '0.625rem 1.25rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569' }}>TRANS_ID:</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{payment.transaction_id}</span>
                        <div style={{ width: '1px', height: '1rem', background: 'var(--border)' }} />
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', borderRadius: '6px', padding: '0.25rem 0.75rem',
                          background: payment.status === 'verified' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: payment.status === 'verified' ? 'var(--primary)' : 'var(--accent)',
                          border: payment.status === 'verified' ? '1px solid var(--primary)' : '1px solid var(--accent)'
                        }}>
                          {payment.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Operational Controls */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', minWidth: '220px' }}>
                    {canVerify && (
                      <button
                        onClick={() => handleAction(ad.id, 'verify-payment', payment.id)}
                        disabled={actionLoading === ad.id}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                      >
                        {actionLoading === ad.id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                        Verify Transaction
                      </button>
                    )}
                    {canPublish && (
                      <button
                        onClick={() => handleAction(ad.id, 'publish')}
                        disabled={actionLoading === ad.id}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--secondary), #0369a1)' }}
                      >
                        {actionLoading === ad.id ? <Loader2 size={20} className="animate-spin" /> : <Rocket size={20} />}
                        Execute Launch
                      </button>
                    )}
                    {!canVerify && !canPublish && ad.status === 'approved' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '1rem', borderRadius: '0.875rem', background: 'var(--surface-1)', color: '#475569', fontWeight: 700, fontSize: '0.9rem', border: '1px solid var(--border)' }}>
                        <Clock size={18} /> Awaiting Client Action
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {ads.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem', textAlign: 'center', background: 'var(--surface-1)', border: '2px dashed var(--border)', borderRadius: '2.5rem' }}>
                <div style={{ width: '6rem', height: '6rem', borderRadius: '2rem', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 0 50px var(--primary-glow)' }}>
                  <ShieldAlert size={40} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Queue Fully Cleared</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px' }}>All system operations are currently up to date. No pending actions required.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
