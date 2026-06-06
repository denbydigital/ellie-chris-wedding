import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/guest?token=abc123 — look up a guest by their invite token
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })

  const { data, error } = await supabaseAdmin()
    .from('guests')
    .select('id, name, email, status, party_size, max_guests, guests_json, song, notes')
    .eq('invite_token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Invalid invite link' }, { status: 404 })

  return NextResponse.json(data)
}
