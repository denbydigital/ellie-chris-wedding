import FloralCorners from '@/components/ui/FloralCorners'
import GoldDivider from '@/components/ui/GoldDivider'
import RSVPForm from '@/components/site/RSVPForm'
import { supabaseAdmin } from '@/lib/supabase'

interface GuestRecord {
  id: string
  name: string
  email: string
  status: string
  party_size: number
  max_guests: number
  guests_json: { name: string; meal: string }[]
  song: string
  notes: string
}

async function getGuestByToken(token: string): Promise<GuestRecord | null> {
  const { data } = await supabaseAdmin()
    .from('guests')
    .select('id, name, email, status, party_size, max_guests, guests_json, song, notes')
    .eq('invite_token', token)
    .single()
  return data ?? null
}

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; declined?: string }>
}) {
  const params = await searchParams
  const token = params.invite
  const declined = params.declined === '1'
  const guest = token ? await getGuestByToken(token) : null

  return (
    <div className="relative min-h-screen bg-sage-500 flex flex-col items-center justify-center px-6 py-14 overflow-hidden">
      <div className="paper-wash" />
      <FloralCorners size={340} />

      <div className="relative z-10 w-full max-w-[640px] text-center">

        {/* Invitation lockup */}
        <div className="invitation-frame">
          <p className="font-[var(--font-ui)] text-[13px] tracking-[0.34em] uppercase text-gold-300 mb-3.5">
            Together with their families
          </p>
          <p className="font-[var(--font-script)] text-[28px] leading-none text-gold-300 mb-3">
            the wedding of
          </p>
          <h1
            className="font-[var(--font-display)] font-medium leading-[1.02] text-[var(--on-sage-1)] tracking-[0.01em]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 4.6rem)' }}
          >
            Ellie <span className="font-[var(--font-script)] text-gold-300" style={{ fontSize: '0.78em' }}>&amp;</span> Chris
          </h1>
          <div className="my-5">
            <GoldDivider label="Saturday the 10th July, 2027" width={64} animate={false} />
          </div>
          <p className="font-[var(--font-ui)] text-[13px] tracking-[0.28em] uppercase text-[var(--on-sage-2)]">
            Hobbit Hill &middot; Clitheroe
          </p>
          {!declined && (
            <p className="font-[var(--font-script)] text-[30px] leading-none text-[var(--on-sage-1)] mt-5">
              An unexpected journey begins
            </p>
          )}

          {/* Declined confirmation — gracious dead-end */}
          {declined && (
            <div className="mt-7 pt-6 border-t border-[var(--line-on-sage)]">
              <p className="font-[var(--font-body)] text-[18px] leading-[1.7] text-[var(--on-sage-1)] max-w-[440px] mx-auto">
                Thank you for letting us know — we&apos;ll truly miss you, and we&apos;ll raise a glass to you on the day.
              </p>
            </div>
          )}

          {/* Personalised greeting (only when still replying) */}
          {!declined && guest && (
            <div className="mt-7 pt-6 border-t border-[var(--line-on-sage)]">
              <p className="font-[var(--font-body)] italic text-[18px] leading-[1.65] text-[var(--on-sage-2)]">
                Dear {guest.name},
              </p>
              <p className="font-[var(--font-body)] text-[16px] leading-[1.65] text-[var(--on-sage-2)] mt-1">
                We&apos;d be so happy to have you join us on our big day.
              </p>
            </div>
          )}
        </div>

        {/* RSVP form — hidden once declined */}
        {!declined && (
          <>
            <RSVPForm
              prefill={guest ? {
                name: guest.name,
                email: guest.email,
                maxGuests: guest.max_guests ?? 8,
                existingGuests: (guest.guests_json ?? []) as { name: string; meal: 'Chicken' | 'Beef' | 'Vegetarian' | 'Vegan' | 'Child' }[],
                existingSong: guest.song,
                existingNotes: guest.notes,
                existingStatus: guest.status as 'pending' | 'attending' | 'declined',
              } : undefined}
            />

            <p className="font-[var(--font-body)] text-[14px] text-[var(--on-sage-3)] mt-5 italic">
              Kindly reply by 1 April 2027. One reply per invitation.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
