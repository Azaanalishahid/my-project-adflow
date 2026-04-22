import { Ad } from '@/types'
import Link from 'next/link'
import { MapPin, Tag, Clock, ArrowUpRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface AdCardProps {
  ad: Ad
}

export default function AdCard({ ad }: AdCardProps) {
  return (
    <Link 
      href={`/ads/${ad.id}`} 
      className="premium-card animate-fade-in"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '0.625rem',
        textDecoration: 'none',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: ad.package === 'premium' ? '1px solid var(--primary)' : '1px solid var(--border)',
        boxShadow: ad.package === 'premium' ? '0 0 30px var(--primary-glow)' : 'none'
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '4/3', width: '100%', overflow: 'hidden', borderRadius: '1.5rem', background: 'var(--surface-3)' }}>
        <img 
          src={ad.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60'} 
          alt={ad.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
        
        {ad.package === 'premium' && (
          <div style={{ position: 'absolute', right: '1rem', top: '1rem', zIndex: 10, background: 'var(--primary)', padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', boxShadow: '0 4px 15px var(--primary-glow)' }}>
            Premium Placement
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>
            <Tag size={12} />
            {ad.category}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>
            <Clock size={12} />
            {formatDistanceToNow(new Date(ad.created_at))} ago
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          {ad.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1.5rem' }}>
          <MapPin size={14} style={{ color: 'var(--primary)' }} />
          {ad.city}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            ${ad.price.toLocaleString()}
          </div>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.3s' }}>
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  )
}
