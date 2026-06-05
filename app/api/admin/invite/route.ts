import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { guestId, name, email, personalNote } = await req.json()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://denbydigital.github.io/ellie-chris-wedding'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,400&family=Jost:wght@400&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#939D8C;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#939D8C;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border:1px solid rgba(241,242,235,0.45);background:transparent;">
        <tr><td style="padding:48px 40px;text-align:center;border:1px solid rgba(220,196,137,0.55);margin:11px;">
          <p style="font-family:'Jost',sans-serif;font-size:12px;letter-spacing:0.34em;text-transform:uppercase;color:#DCC489;margin:0 0 12px">Together with their families</p>
          <p style="font-family:Georgia,serif;font-style:italic;font-size:24px;color:#DCC489;margin:0 0 10px">the wedding of</p>
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:52px;line-height:1;color:#F1F2EB;margin:0 0 20px">Ellie &amp; Chris</h1>
          <p style="font-family:'Jost',sans-serif;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#DDE1D3;margin:0 0 8px">Saturday, 10 July 2027</p>
          <p style="font-family:'Jost',sans-serif;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#DDE1D3;margin:0 0 28px">Hobbit Hill &middot; Clitheroe</p>
          <hr style="border:none;border-top:1px solid rgba(220,196,137,0.4);margin:0 auto 24px;width:60%">
          <p style="font-family:Georgia,serif;font-style:italic;font-size:17px;line-height:1.65;color:#DDE1D3;margin:0 0 6px">Dear ${name},</p>
          ${personalNote ? `<p style="font-family:Georgia,serif;font-size:17px;line-height:1.65;color:#DDE1D3;margin:0 0 24px">${personalNote}</p>` : ''}
          <p style="font-family:Georgia,serif;font-size:17px;line-height:1.65;color:#DDE1D3;margin:0 0 24px">We&apos;d be so happy to have you join us on our big day. Please let us know if you can make it &mdash; kindly reply by 1 April 2027.</p>
          <a href="${siteUrl}" style="display:inline-block;background:#C2A24E;color:#283228;font-family:'Jost',sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:4px">RSVP now</a>
          <p style="font-family:Georgia,serif;font-style:italic;font-size:14px;color:#C4CAB6;margin:28px 0 0">With love, Ellie &amp; Chris</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hello@ellieandchris.co.uk',
      to: email,
      subject: 'You\'re invited — Ellie & Chris, 10 July 2027',
      html,
    })

    // Mark invite as sent in DB
    if (guestId) {
      await supabaseAdmin().from('guests').update({ invite_sent_at: new Date().toISOString() }).eq('id', guestId)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
