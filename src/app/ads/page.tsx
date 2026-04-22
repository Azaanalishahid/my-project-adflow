import { createClient } from '@/lib/supabase/server'
import AdCard from '@/components/AdCard'
import { Ad } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdsPage() {
  const supabase = await createClient()

  // Fetch published ads
  // We handle expiration logic here: if current date > expires_at, it's expired.
  // In SQL: expires_at > NOW() or expires_at IS NULL
  const now = new Date().toISOString()
  
  const { data: ads, error } = await supabase
    .from('ads')
    .select('*')
    .eq('status', 'published')
    .gt('expires_at', now)
    .order('package', { ascending: false }) // Premium, then Standard, then Basic (lexicographical order P, S, B is tricky, might need manual sort)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="container mx-auto p-10 text-center text-red-500">Error loading ads: {error.message}</div>
  }

  // Custom sort for package priority: Premium > Standard > Basic
  const sortedAds = (ads as Ad[] || []).sort((a, b) => {
    const priority: Record<string, number> = { premium: 3, standard: 2, basic: 1 }
    const diff = priority[b.package] - priority[a.package]
    if (diff !== 0) return diff
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div style={{ marginBottom: '4rem' }} className="animate-fade-in">
        <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '1rem' }}>Global Inventory</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1 }}>Explore Marketplace</h1>
      </div>

      {sortedAds.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem', textAlign: 'center', background: 'var(--surface-1)', border: '2px dashed var(--border)', borderRadius: '2.5rem' }} className="animate-fade-in">
          <div style={{ width: '6rem', height: '6rem', borderRadius: '2rem', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 0 50px var(--primary-glow)' }}>
             <svg style={{ width: '40px', height: '40px', color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
             </svg>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Marketplace Latency</h3>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px' }}>Current active listings are at zero. Check back shortly for new synchronized assets.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {sortedAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  )
}
