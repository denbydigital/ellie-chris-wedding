import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

function csv(rows: string[][]): string {
  return rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n')
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const type = new URL(req.url).searchParams.get('type') || 'guests'
  const db = supabaseAdmin()
  const { data } = await db.from('guests').select('*').order('created_at')

  if (!data) return NextResponse.json({ error: 'No data' }, { status: 500 })

  let rows: string[][] = []
  let filename = 'export.csv'

  if (type === 'guests') {
    filename = 'ellie-chris-guests.csv'
    rows = [
      ['Lead Name', 'Email', 'Status', 'Party Size', 'Meal Choices', 'Song Request', 'Notes', 'Responded At'],
      ...data.map(g => [
        g.name, g.email, g.status, String(g.party_size),
        (g.guests_json || []).map((x: { name: string; meal: string }) => `${x.name} (${x.meal})`).join('; '),
        g.song || '', g.notes || '', g.responded_at || '',
      ]),
    ]
  } else if (type === 'meals') {
    filename = 'ellie-chris-meals.csv'
    const counts: Record<string, number> = { Chicken: 0, Beef: 0, Vegetarian: 0, Vegan: 0, Child: 0 }
    data.filter(g => g.status === 'attending').forEach(g =>
      (g.guests_json || []).forEach((x: { meal: string }) => { if (counts[x.meal] !== undefined) counts[x.meal]++ })
    )
    rows = [['Meal Choice', 'Count'], ...Object.entries(counts).map(([k, v]) => [k, String(v)])]
  } else if (type === 'songs') {
    filename = 'ellie-chris-songs.csv'
    rows = [['Song Request', 'From Guest'], ...data.filter(g => g.song).map(g => [g.song, g.name])]
  } else if (type === 'pending') {
    filename = 'ellie-chris-pending.csv'
    rows = [['Name', 'Email', 'Invite Sent'], ...data.filter(g => g.status === 'pending').map(g => [g.name, g.email, g.invite_sent_at || ''])]
  }

  return new NextResponse(csv(rows), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
