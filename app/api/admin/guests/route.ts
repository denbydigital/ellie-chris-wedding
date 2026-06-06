import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const auth = req.headers.get('x-admin-password')
  return auth === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const db = supabaseAdmin()
  const { data, error } = await db.from('guests').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const body = await req.json()
  const db = supabaseAdmin()

  let { data, error } = await db.from('guests').insert(body).select().single()

  // If a column (e.g. max_guests / invite_token) doesn't exist yet because the
  // DB migration hasn't been run, strip optional columns and retry so the core
  // insert still succeeds.
  if (error && /column .* does not exist/i.test(error.message)) {
    const { max_guests, invite_token, ...core } = body
    void max_guests; void invite_token
    ;({ data, error } = await db.from('guests').insert(core).select().single())
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id, ...updates } = await req.json()
  const db = supabaseAdmin()
  const { data, error } = await db.from('guests').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
