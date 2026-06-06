import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Cross-device unlock: an attending guest who opens their personalised
 * link gets the access cookie set and is sent into the site — no need to
 * re-submit the form. Honours the stored RSVP so it works on any device.
 */
export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.redirect(`${origin}/gate`)

  const { data } = await supabaseAdmin()
    .from('guests')
    .select('status')
    .eq('invite_token', token)
    .single()

  if (data?.status === 'attending') {
    const res = NextResponse.redirect(`${origin}/home`)
    res.cookies.set('ec-access', 'yes', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return res
  }

  // Pending or declined → send back to the gate carrying the token
  return NextResponse.redirect(`${origin}/gate?invite=${token}`)
}
