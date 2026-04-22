'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Ad } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { Plus, Edit, Send, CreditCard, Trash2, Loader2, CheckCircle2, Clock, AlertCircle, Eye, Rocket, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const WORKFLOW_STEPS = [
  { status: 'draft', label: 'Draft' },
  { status: 'submitted', label: 'Submitted' },
  { status: 'under_review', label: 'Under Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'payment_pending', label: 'Payment Pending' },
  { status: 'verified', label: 'Verified' },
  { status: 'published', label: 'Published' },
]

function WorkflowProgress({ status }: { status: string }) {
  const currentIndex = WORKFLOW_STEPS.findIndex(s => s.status === status)
  if (status === 'rejected') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '0.75rem', padding: '0.5rem 1rem' }}>
        <AlertCircle size={14} style={{ color: '#fb7185' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185' }}>Rejected — please edit and resubmit</span>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
      {WORKFLOW_STEPS.map((step, i) => (
        <div key={step.status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            borderRadius: '8px', padding: '4px 10px',
            fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
            background: i < currentIndex ? 'rgba(16,185,129,0.15)' : i === currentIndex ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.03)',
            color: i < currentIndex ? '#34d399' : i === currentIndex ? 'var(--primary)' : '#475569',
            border: i === currentIndex ? '1px solid var(--primary)' : '1px solid transparent',
            transition: 'all 0.3s'
          }}>
            {i < currentIndex && <CheckCircle2 size={10} strokeWidth={3} />}
            {i === currentIndex && <Clock size={10} strokeWidth={3} />}
            {step.label}
          </div>
          {i < WORKFLOW_STEPS.length - 1 && (
            <div style={{ width: '16px', height: '2px', borderRadius: '9999px', background: i < currentIndex ? '#34d399' : 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ClientDashboard() {
  const supabase = createClient()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Partial<Ad> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState('')

  useEffect(() => { fetchAds() }, [])

  const fetchAds = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('ads').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (!error && data) setAds(data as Ad[])
    setLoading(false)
  }

  const showMsg = (msg: string) => { setActionMsg(msg); setTimeout(() => setActionMsg(null), 3000) }

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const adData = {
      id: editingAd?.id,
      title: formData.get('title'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      city: formData.get('city'),
      category: formData.get('category'),
      image_url: formData.get('image_url'),
      package: formData.get('package'),
      status: editingAd?.id ? editingAd.status : 'draft'
    }
    const res = await fetch('/api/client/ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(adData) })
    const result = await res.json()
    if (res.ok) {
      setIsModalOpen(false); setEditingAd(null); await fetchAds()
      showMsg(editingAd?.id ? 'Ad updated successfully!' : 'Ad saved as draft!')
    } else { showMsg(`Error: ${result.error}`) }
    setIsSubmitting(false)
  }

  const handleSubmitAd = async (id: string) => {
    const res = await fetch('/api/client/ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'submitted' }) })
    if (res.ok) { await fetchAds(); showMsg('Ad submitted for review!') }
    else { const r = await res.json(); showMsg(`Error: ${r.error}`) }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true)
    const ad = ads.find(a => a.id === selectedAdId)
    const res = await fetch('/api/client/payment', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ad_id: selectedAdId, transaction_id: transactionId, amount: ad?.price || 0 })
    })
    const result = await res.json()
    if (res.ok) { setIsPaymentModalOpen(false); setTransactionId(''); await fetchAds(); showMsg('Payment submitted! Admin will verify shortly.') }
    else { showMsg(`Error: ${result.error}`) }
    setIsSubmitting(false)
  }

  const deleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return
    const { error } = await supabase.from('ads').delete().eq('id', id)
    if (!error) { await fetchAds(); showMsg('Ad deleted.') }
  }

  const S: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: 'transparent', padding: '3rem 1.5rem' },
    container: { maxWidth: '1100px', margin: '0 auto' },
    label: { display: 'block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.5rem' } as React.CSSProperties,
  }

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div className="animate-fade-in">
            <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '0.75rem' }}>Client Command Center</p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>My Campaigns</h1>
          </div>
          <button onClick={() => { setEditingAd({}); setIsModalOpen(true) }} className="btn-primary animate-fade-in" style={{ padding: '0.875rem 1.75rem' }}>
            <Plus size={20} /> Launch New Ad
          </button>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className="animate-fade-in" style={{ marginBottom: '1.5rem', background: 'var(--primary)', borderRadius: '1rem', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff', boxShadow: '0 8px 24px var(--primary-glow)' }}>
            {actionMsg}
          </div>
        )}

        {/* Workflow Guide */}
        <div className="premium-card animate-fade-in" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem', background: 'rgba(16,185,129,0.03)', borderColor: 'rgba(16,185,129,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
             <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Rocket size={16} style={{ color: 'var(--primary)' }} />
             </div>
             <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff' }}>Campaign Lifecycle</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
            {['Draft', 'Review', 'Approval', 'Payment', 'Verification', 'Live 🎉'].map((step, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary)', opacity: 0.8 }}>{i + 1}</span>
                <span style={{ fontWeight: 600 }}>{step}</span>
                {i < 5 && <ChevronRight size={14} style={{ color: '#334155' }} />}
              </span>
            ))}
          </div>
        </div>

        {/* Ads List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '1.5rem' }}>
            <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.05em' }}>Synchronizing Data...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {ads.map((ad, idx) => (
              <div key={ad.id} className="premium-card animate-fade-in" style={{ padding: '1.5rem', animationDelay: `${idx * 0.05}s` }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                  {/* Image with Glow */}
                  <div style={{ position: 'relative', width: '5.5rem', height: '5.5rem', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: '-4px', background: 'var(--primary)', opacity: 0.1, blur: '10px', borderRadius: '1rem' }} />
                    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={ad.image_url || 'https://via.placeholder.com/100'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100' }} />
                    </div>
                  </div>

                  {/* Information */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{ad.title}</h3>
                      <StatusBadge status={ad.status} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Package:</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{ad.package}</span>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Budget:</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--foreground)' }}>${ad.price}</span>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Region:</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>{ad.city}</span>
                       </div>
                    </div>
                    <WorkflowProgress status={ad.status} />
                  </div>

                  {/* Actions Area */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {ad.status === 'draft' && (
                      <>
                        <button onClick={() => { setEditingAd(ad); setIsModalOpen(true) }} className="btn-secondary" style={{ padding: '0.625rem 1rem', fontSize: '0.8rem' }}>
                          <Edit size={16} /> Edit
                        </button>
                        <button onClick={() => handleSubmitAd(ad.id)} className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.8rem' }}>
                          <Send size={16} /> Submit
                        </button>
                        <button onClick={() => deleteAd(ad.id)} style={{ padding: '0.625rem', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)', borderRadius: '0.75rem', color: '#fb7185', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {ad.status === 'rejected' && (
                      <>
                        <button onClick={() => { setEditingAd(ad); setIsModalOpen(true) }} className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.8rem' }}>
                          <Edit size={16} /> Fix & Resubmit
                        </button>
                        <button onClick={() => deleteAd(ad.id)} style={{ padding: '0.625rem', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)', borderRadius: '0.75rem', color: '#fb7185', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {ad.status === 'approved' && (
                      <button onClick={() => { setSelectedAdId(ad.id); setIsPaymentModalOpen(true) }} className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}>
                        <CreditCard size={18} /> Process Payment
                      </button>
                    )}
                    {ad.status === 'published' && (
                      <Link href={`/ads/${ad.id}`} className="btn-secondary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                        <Eye size={16} /> View Listing
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {ads.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '2px dashed var(--border)', borderRadius: '2rem' }}>
                <div style={{ width: '5rem', height: '5rem', borderRadius: '1.5rem', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Plus size={32} style={{ color: '#334155' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>No active campaigns</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '300px' }}>Your advertising journey starts here. Create your first campaign now.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals are updated via global premium-card and premium-input classes */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setIsModalOpen(false)} />
          <div className="premium-card" style={{ position: 'relative', width: '100%', maxWidth: '700px', padding: 0 }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '2rem' }}>{editingAd?.id ? 'Modify Campaign' : 'Initiate New Campaign'}</h2>
              <form onSubmit={handleSaveAd} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                  <div style={{ gridColumn: '1 / -1' }}><label style={S.label}>Campaign Title</label><input name="title" required defaultValue={editingAd?.title} className="premium-input" placeholder="e.g. Summer Collection 2026" /></div>
                  <div><label style={S.label}>Target Budget ($)</label><input name="price" type="number" step="0.01" min="0" required defaultValue={editingAd?.price} className="premium-input" placeholder="99.00" /></div>
                  <div><label style={S.label}>Geographic Target</label><input name="city" required defaultValue={editingAd?.city} className="premium-input" placeholder="Global or Specific City" /></div>
                  <div><label style={S.label}>Industry Vertical</label><input name="category" required defaultValue={editingAd?.category} className="premium-input" placeholder="Real Estate, Tech, etc." /></div>
                  <div>
                    <label style={S.label}>Ad Tier</label>
                    <select name="package" required defaultValue={editingAd?.package || 'basic'} className="premium-input">
                      <option value="basic">Basic (7 Days)</option>
                      <option value="standard">Standard (15 Days)</option>
                      <option value="premium">Premium (30 Days + Priority)</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={S.label}>Creative Asset URL</label><input name="image_url" required defaultValue={editingAd?.image_url} className="premium-input" placeholder="https://cdn.example.com/image.jpg" /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={S.label}>Campaign Narrative</label><textarea name="description" rows={4} required defaultValue={editingAd?.description} className="premium-input" style={{ resize: 'none' }} placeholder="Detail your offering and value proposition..." /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '0.875rem 2rem' }}>Discard</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingAd?.id ? 'Update Assets' : 'Save Draft'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setIsPaymentModalOpen(false)} />
          <div className="premium-card" style={{ position: 'relative', width: '100%', maxWidth: '450px', padding: 0 }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Finalize Transaction</h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.5 }}>Verify your transfer and provide the secure transaction hash below.</p>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Campaign:</span>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{ads.find(a => a.id === selectedAdId)?.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.75rem' }}>
                  <span style={{ fontWeight: 800, color: '#fff' }}>Settlement:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>${ads.find(a => a.id === selectedAdId)?.price}</span>
                </div>
              </div>

              <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={S.label}>Transaction Hash / ID</label>
                  <input required value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="premium-input" placeholder="Paste hash here..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Authorize Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
