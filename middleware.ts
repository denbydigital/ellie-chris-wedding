import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Content pages stay locked until a guest has RSVP'd "attending".
 * The /api/rsvp route sets an `ec-access=yes` cookie on a yes reply;
 * declining never sets it. Without the cookie, any content route
 * redirects back to the RSVP gate.
 *
 * Not protected: / (password), /gate (RSVP), /admin (own auth),
 * /api/*, and static assets.
 */
export function middleware(req: NextRequest) {
  const access = req.cookies.get('ec-access')?.value
  if (access === 'yes') return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/gate'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/home/:path*',
    '/story/:path*',
    '/schedule/:path*',
    '/travel/:path*',
    '/rsvp/:path*',
    '/registry/:path*',
    '/gallery/:path*',
    '/faq/:path*',
  ],
}
