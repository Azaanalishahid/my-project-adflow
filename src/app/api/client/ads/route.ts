import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const adData = await request.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...data } = adData

  if (id) {
    // Update
    const { error } = await supabase
      .from('ads')
      .update({ ...data, user_id: user.id })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure ownership

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, id })
  } else {
    // Create
    const { data: newAd, error } = await supabase
      .from('ads')
      .insert([{ ...data, user_id: user.id }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, id: newAd.id })
  }
}
