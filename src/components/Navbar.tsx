'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { LogOut, LayoutDashboard, Sparkles, ChevronRight } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) setRole(user.user_metadata?.role || 'client')
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="glass-nav">
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', height: '68px', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem' }}>

        {/* Left: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              boxShadow: '0 4px 14px var(--primary-glow)',
              transition: 'transform 0.2s',
            }}>
              <Sparkles size={20} fill="white" color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--foreground)' }}>
              ADFLOW<span style={{ color: 'var(--primary)' }}>PRO</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link
              href="/ads"
              style={{
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.12em', textDecoration: 'none', transition: 'color 0.2s',
                color: pathname === '/ads' ? 'var(--primary)' : '#94a3b8',
              }}
            >
              Marketplace
            </Link>
          </div>
        </div>

        {/* Right: Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <Link
                href={`/dashboard/${role}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '0.75rem',
                  background: 'var(--primary-glow)', border: '1px solid var(--primary)',
                  fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', padding: '0.625rem',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: '0.75rem', color: '#94a3b8', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--danger)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s',
                }}
              >
                Log In
              </Link>
              <Link
                href="/login?signup=true"
                className="btn-primary"
                style={{
                  padding: '0.5rem 1.25rem', fontSize: '0.82rem', borderRadius: '0.75rem', textDecoration: 'none'
                }}
              >
                Sign Up <ChevronRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
