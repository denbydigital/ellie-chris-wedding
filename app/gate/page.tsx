import FloralCorners from '@/components/ui/FloralCorners'
import GoldDivider from '@/components/ui/GoldDivider'
import RSVPForm from '@/components/site/RSVPForm'

export default function GatePage({ searchParams }: { searchParams: Promise<{ declined?: string }> }) {
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
          <h1 className="font-[var(--font-display)] font-medium leading-[1.02] text-[var(--on-sage-1)] tracking-[0.01em]"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 4.6rem)' }}>
            Ellie <span className="font-[var(--font-script)] text-gold-300" style={{ fontSize: '0.78em' }}>&amp;</span> Chris
          </h1>
          <div className="my-5">
            <GoldDivider label="Saturday the 10th July, 2027" width={64} />
          </div>
          <p className="font-[var(--font-ui)] text-[13px] tracking-[0.28em] uppercase text-[var(--on-sage-2)]">
            Hobbit Hill &middot; Clitheroe
          </p>
          <p className="font-[var(--font-script)] text-[30px] leading-none text-[var(--on-sage-1)] mt-5">
            An unexpected journey begins
          </p>
        </div>

        {/* RSVP form / declined message */}
        <RSVPForm />

        <p className="font-[var(--font-body)] text-[14px] text-[var(--on-sage-3)] mt-5 italic">
          Kindly reply by 1 April 2027. One reply per invitation.
        </p>
      </div>
    </div>
  )
}
