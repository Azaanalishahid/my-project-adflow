import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// ONE-TIME USE ENDPOINT to seed admin and moderator accounts
// Visit: GET /api/seed to create the accounts
export async function GET() {
  const supabase = createAdminClient()

  const users = [
    { email: 'admin@gmail.com', password: '000000', role: 'admin' },
    { email: 'moderator@gmail.com', password: '000000', role: 'moderator' },
  ]

  const results = []

  for (const u of users) {
    // First, try to delete existing user if any (cleanup)
    const { data: existing } = await supabase.auth.admin.listUsers()
    const existingUser = existing?.users?.find(eu => eu.email === u.email)
    if (existingUser) {
      await supabase.auth.admin.deleteUser(existingUser.id)
    }

    // Create fresh user with email_confirm: true
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { role: u.role },
      app_metadata: { role: u.role },
    })

    if (error) {
      results.push({ email: u.email, status: 'FAILED', error: error.message })
    } else {
      // Also upsert into profiles table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: u.email,
        role: u.role,
      })
      results.push({ email: u.email, status: 'SUCCESS', role: u.role })
    }
  }

  return NextResponse.json({ results })
}
