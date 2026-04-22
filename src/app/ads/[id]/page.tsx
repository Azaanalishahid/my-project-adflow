import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Tag, Calendar, ShieldCheck, ArrowLeft, Star } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Step 1: Fetch ad WITHOUT join to avoid schema errors
  const { data: ad, error } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !ad) {
    notFound()
  }

  // Step 2: Access control for non-published ads
  if (ad.status !== 'published') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) notFound()

    const userRole = user.user_metadata?.role
    const isOwner = user.id === ad.user_id
    const isStaff = userRole === 'moderator' || userRole === 'admin'

    if (!isOwner && !isStaff) {
      notFound()
    }
  }

  // Step 3: Fetch seller email separately
  const { data: sellerProfile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', ad.user_id)
    .single()

  const packageDays = ad.package === 'premium' ? 30 : ad.package === 'standard' ? 15 : 7

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Link */}
        <Link
          href="/ads"
          className="animate-fade-in"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem', 
            fontSize: '0.9rem', fontWeight: 800, color: '#64748b', 
            textDecoration: 'none', marginBottom: '3rem', transition: 'color 0.3s'
          }}
        >
          <ArrowLeft size={18} /> BACK TO MARKETPLACE
        </Link>

        <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Main Content Column */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-fade-in">
            {/* Visual Asset Container */}
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '2.5rem', background: 'var(--surface-3)', border: '1px solid var(--border)', aspectRatio: '16/9' }}>
               <img
                src={ad.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=60'}
                alt={ad.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
            </div>

            {/* Core Narrative */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                    {ad.title}
                  </h1>
                  <StatusBadge status={ad.status} />
                  {ad.package === 'premium' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#fff', padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 900, boxShadow: '0 4px 15px var(--primary-glow)' }}>
                      <Star size={12} /> PREMIUM ASSET
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'var(--surface-1)', border: '1px solid var(--border)', padding: '0.625rem 1.25rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
                    <MapPin size={16} style={{ color: 'var(--primary)' }} /> {ad.city}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'var(--surface-1)', border: '1px solid var(--border)', padding: '0.625rem 1.25rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
                    <Tag size={16} style={{ color: 'var(--primary)' }} /> {ad.category}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'var(--surface-1)', border: '1px solid var(--border)', padding: '0.625rem 1.25rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
                    <Calendar size={16} style={{ color: 'var(--primary)' }} /> {format(new Date(ad.created_at), 'dd MMM yyyy')}
                  </div>
                </div>
              </div>

              <div className="premium-card" style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Narrative</h2>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: 1.8, color: '#94a3b8' }}>
                  {ad.description || 'No detailed narrative provided for this asset.'}
                </p>
              </div>
            </div>
          </div>

          {/* Transactional Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
            {/* Value Matrix Card */}
            <div className="premium-card" style={{ padding: '2.5rem', border: '1px solid var(--primary)', background: 'rgba(16,185,129,0.03)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '0.75rem' }}>Current Valuation</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', marginBottom: '2.5rem', lineHeight: 1 }}>
                ${Number(ad.price).toLocaleString()}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Deployment Tier', value: ad.package, color: 'var(--primary)' },
                  { label: 'Service Duration', value: `${packageDays} Standard Cycles`, color: '#fff' },
                  { label: 'Authorized Dealer', value: sellerProfile?.email || 'Anonymous', color: '#fff' },
                  { label: 'Activation Date', value: ad.published_at ? format(new Date(ad.published_at), 'dd MMM yyyy') : 'Pending', color: '#fff' },
                  { label: 'Termination Date', value: ad.expires_at ? format(new Date(ad.expires_at), 'dd MMM yyyy') : 'Indefinite', color: '#fff' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontWeight: 800, color: row.color, textTransform: i === 0 ? 'uppercase' : 'none' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
                Secure Interaction Channel
              </button>
            </div>

            {/* Protocol Card */}
            <div className="premium-card" style={{ padding: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>
                <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
                Safety Protocol
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Execute transactions in neutral territories.',
                  'Perform full hardware audit prior to settlement.',
                  'Reject any requests for advanced wire transfers.',
                  'Prioritize internal instinct over perceived urgency.'
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', lineHeight: 1.5, color: '#64748b' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 900 }}>0{i+1}</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
