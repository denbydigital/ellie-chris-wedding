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
    // One row per individual guest, each with their own meal choice.
    rows = [['Guest Name', 'Meal', 'Invitation', 'Email', 'Status', 'Song Request', 'Notes', 'Responded At']]
    for (const g of data) {
      const people = (g.guests_json || []) as { name: string; meal: string }[]
      if (g.status === 'attending' && people.length > 0) {
        people.forEach((p, i) => {
          rows.push([
            p.name?.trim() || `Guest ${i + 1}`,
            p.meal || '',
            g.name,                 // the invitation / party name
            g.email,
            g.status,
            i === 0 ? (g.song || '') : '',   // song/notes belong to the invite, show once
            i === 0 ? (g.notes || '') : '',
            g.responded_at ? g.responded_at.slice(0, 10) : '',
          ])
        })
      } else {
        // Declined or pending (or attending with no names) — single row
        rows.push([
          g.name, '', g.name, g.email, g.status,
          g.song || '', g.notes || '',
          g.responded_at ? g.responded_at.slice(0, 10) : '',
        ])
      }
    }
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
