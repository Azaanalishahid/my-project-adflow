import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { ad_id, transaction_id, amount } = await request.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ad ownership
  const { data: ad } = await supabase
    .from('ads')
    .select('id')
    .eq('id', ad_id)
    .eq('user_id', user.id)
    .single()

  if (!ad) return NextResponse.json({ error: 'Ad not found or unauthorized' }, { status: 404 })

  // Insert payment
  const { error: paymentError } = await supabase
    .from('payments')
    .insert([{
      ad_id,
      transaction_id,
      amount,
      status: 'pending'
    }])

  if (paymentError) return NextResponse.json({ error: paymentError.message }, { status: 500 })

  // Update ad status to payment_pending
  const { error: adError } = await supabase
    .from('ads')
    .update({ status: 'payment_pending' })
    .eq('id', ad_id)

  if (adError) return NextResponse.json({ error: adError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
