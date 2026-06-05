import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { RSVPFormData } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body: RSVPFormData = await req.json()
  const { attending, name, email, guests, song, notes } = body

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const status = attending === 'yes' ? 'attending' : 'declined'

  // Upsert by email so guests can update their reply
  const { error } = await db
    .from('guests')
    .upsert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status,
      party_size: attending === 'yes' ? guests.length : 0,
      guests_json: attending === 'yes' ? guests : [],
      song: song?.trim() || '',
      notes: notes?.trim() || '',
      responded_at: new Date().toISOString(),
    }, { onConflict: 'email' })

  if (error) {
    console.error('RSVP upsert error:', error)
    return NextResponse.json({ error: 'Failed to save your reply. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
