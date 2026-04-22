import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Step 1: Fetch ads without joins
  const { data: ads, error: adsError } = await supabase
    .from('ads')
    .select('*')
    .in('status', ['approved', 'payment_pending', 'verified'])
    .order('created_at', { ascending: false })

  if (adsError) {
    console.error('Ads Error:', adsError)
    return NextResponse.json({ error: adsError.message }, { status: 500 })
  }

  if (!ads || ads.length === 0) return NextResponse.json([])

  // Step 2: Fetch payments for these ads separately
  const adIds = ads.map(a => a.id)
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .in('ad_id', adIds)

  // Step 3: Fetch user emails from profiles separately
  const userIds = ads.map(a => a.user_id)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds)

  // Step 4: Merge everything manually
  const merged = ads.map(ad => ({
    ...ad,
    profiles: profiles?.find(p => p.id === ad.user_id) || null,
    payments: payments?.filter(p => p.ad_id === ad.id) || []
  }))

  return NextResponse.json(merged)
}
