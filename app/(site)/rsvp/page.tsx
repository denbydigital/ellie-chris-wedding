import { redirect } from 'next/navigation'

// RSVP is final and submitted via the gate; this route just sends
// attending guests (the only ones who can reach it) into the site.
export default function RSVPPage() {
  redirect('/home')
}
