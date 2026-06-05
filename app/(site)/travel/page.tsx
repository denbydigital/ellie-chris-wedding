import SectionHeader from '@/components/site/SectionHeader'
import Card from '@/components/ui/Card'

const cards = [
  { title: 'By Car', icon: <><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>, body: ['From the M6: exit at junction 31, follow the A59 towards Clitheroe.', 'Postcode for sat-nav: BB7 1AX', 'Free on-site parking for all guests.', 'Cars may be left overnight — please collect by noon on Sunday.'] },
  { title: 'By Train', icon: <><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6V4M16 6V4M2 10h20"/></>, body: ['Clitheroe station is 15 minutes\' drive from the venue.', 'Regular services from Manchester Victoria (approx. 1hr).', 'Taxis available from the station — we recommend pre-booking.'] },
  { title: 'Staying Over', icon: <><path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"/></>, body: ['On-site glamping — a handful of bell tents (first come, first served). Email us to reserve.', 'The Swan, Clitheroe — 10 min drive. We\'ve reserved a block; mention the wedding when booking.', 'Ribble Valley Inn — 15 min drive. Lovely rooms, great breakfast.'] },
  { title: 'End of Evening', icon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/>, body: ['Taxis leave from the main gate at 11:30 pm.', 'If you\'re driving, leaving your car overnight is absolutely fine.', 'Please don\'t drink and drive. The hills will still be here in the morning.'] },
]

export default function TravelPage() {
  return (
    <div>
      <SectionHeader eyebrow="Getting here" title="Travel & Stay" intro="Hobbit Hill is tucked in the Ribble Valley, just outside Clitheroe. Here's how to find us." />
      <section className="bg-cream px-8 py-20 pb-24">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 gap-5">
          {cards.map(c => (
            <Card key={c.title}>
              <h3 className="font-[var(--font-display)] font-semibold text-[22px] text-fg1 flex items-center gap-3 mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
                {c.title}
              </h3>
              <ul className="pl-5 flex flex-col gap-1.5">
                {c.body.map((b, i) => <li key={i} className="font-[var(--font-body)] text-[16px] leading-[1.65] text-fg2">{b}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
