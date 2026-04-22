import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password, role } = await request.json()
  const supabase = createAdminClient()

  // Create user using admin client to bypass email confirmation
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // This marks the email as confirmed immediately
    user_metadata: { role: role || 'client' }
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ 
    success: true, 
    user: data.user,
    message: 'User created and confirmed successfully'
  })
}
