import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { addDays } from 'date-fns'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { id, action, paymentId } = await request.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (action === 'verify-payment') {
    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'verified' })
      .eq('id', paymentId)

    // Update ad status
    const { error } = await supabase
      .from('ads')
      .update({ status: 'verified' })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, status: 'verified' })
  }

  if (action === 'publish') {
    const { data: ad } = await supabase
      .from('ads')
      .select('package')
      .eq('id', id)
      .single()

    if (!ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 })

    let days = 7
    if (ad.package === 'standard') days = 15
    if (ad.package === 'premium') days = 30

    const published_at = new Date().toISOString()
    const expires_at = addDays(new Date(), days).toISOString()

    const { error } = await supabase
      .from('ads')
      .update({ 
        status: 'published',
        published_at,
        expires_at
      })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, status: 'published' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
