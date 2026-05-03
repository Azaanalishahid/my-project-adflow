'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function DashboardRedirect() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const role = user.user_metadata?.role || 'client'
      router.replace(`/dashboard/${role}`)
    }

    checkRoleAndRedirect()
  }, [router, supabase])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '1.5rem' }}>
      <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)' }} />
      <span style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em' }}>REDIRECTING TO COMMAND CENTER...</span>
    </div>
  )
}
