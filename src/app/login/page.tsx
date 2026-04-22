'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, ArrowRight, Loader2, Sparkles, UserPlus, LogIn } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // SIGNUP: Use our custom API to auto-confirm email
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ email, password, role: 'client' }),
          headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error || 'Signup failed')
        
        // After successful auto-confirmed signup, log them in automatically
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
        
        router.push('/dashboard/client')
      } else {
        // LOGIN: Automatic redirection based on role from metadata
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        // Get role directly from user metadata (much more robust)
        const role = data.user?.user_metadata?.role || 'client'
        
        router.push(`/dashboard/${role}`)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', alignItems: 'center', justifyContent: 'center', background: 'transparent', padding: '0 1rem' }}>
      
      <div className="animate-fade-in" style={{ position: 'relative', w: '100%', maxWidth: '440px', width: '100%' }}>
        <div style={{ position: 'absolute', top: '-2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
           <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '1.25rem', boxShadow: '0 10px 40px var(--primary-glow)', transform: 'rotate(5deg)' }}>
             <Sparkles className="text-white" size={32} />
           </div>
        </div>

        <div className="premium-card" style={{ padding: '3.5rem 2.5rem 2.5rem 2.5rem', background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(30px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
              {isSignUp ? 'Establish Presence' : 'Secure Entry'}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
              {isSignUp ? 'Initiate your professional advertiser profile' : 'Access the AdFlow Pro command center'}
            </p>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAuth}>
            {error && (
              <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', padding: '1rem', borderRadius: '0.875rem', fontSize: '0.85rem', color: '#fb7185', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', marginLeft: '0.5rem' }}>Command Identifier</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} size={20} />
                  <input
                    type="email"
                    required
                    className="premium-input"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="architect@adflow.pro"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#475569', marginLeft: '0.5rem' }}>Access Cipher</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} size={20} />
                  <input
                    type="password"
                    required
                    className="premium-input"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '1.125rem', marginTop: '1rem' }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: 800 }}>
                  {isSignUp ? <><UserPlus size={20} /> Initialize Access</> : <><LogIn size={20} /> Authenticate Session</>}
                </div>
              )}
            </button>

            <div style={{ textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' }}
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Already possess credentials? <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Secure Login</span></span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Lacking credentials? <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Join the Elite</span></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)' }} /></div>}>
      <LoginContent />
    </Suspense>
  )
}
