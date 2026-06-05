'use client'
import { useEffect, useState } from 'react'
import FloralCorners from '@/components/ui/FloralCorners'
import GoldDivider from '@/components/ui/GoldDivider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import RSVPForm from '@/components/site/RSVPForm'

/* ─────────────────────────────────────────
   COUNTDOWN
───────────────────────────────────────── */
function Countdown() {
  const target = new Date('2027-07-10T13:00:00')
  const [diff, setDiff] = useState(Math.max(0, target.getTime() - Date.now()))
  useEffect(() => {
    const t = setInterval(() => setDiff(Math.max(0, target.getTime() - Date.now())), 1000)
    return () => clearInterval(t)
  }, [])
  const parts = [
    [Math.floor(diff / 86400000), 'Days'],
    [Math.floor((diff % 86400000) / 3600000), 'Hours'],
    [Math.floor((diff % 3600000) / 60000), 'Minutes'],
    [Math.floor((diff % 60000) / 1000), 'Seconds'],
  ] as [number, string][]
  return (
    <div className="flex gap-12 justify-center flex-wrap">
      {parts.map(([n, l]) => (
        <div key={l} className="flex flex-col items-center min-w-[72px]">
          <span className="font-[var(--font-display)] font-medium text-[56px] leading-none text-sage-700">
            {String(n).padStart(2, '0')}
          </span>
          <span className="font-[var(--font-ui)] text-[11px] tracking-[0.26em] uppercase text-fg3 mt-2.5">{l}</span>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   STORY
───────────────────────────────────────── */
const STORY = [
  { year: '2019', title: 'A rainy queue in Manchester', body: 'We met sheltering under the same café awning on Oxford Road. Chris offered half his umbrella; Ellie offered half her chips. The rest is history.' },
  { year: '2021', title: 'The first of many hills', body: 'A misjudged "gentle stroll" up Pendle Hill turned into a five-hour adventure. We\'ve been climbing things together ever since.' },
  { year: '2023', title: 'Moving in', body: 'One small flat, two strong opinions about bookshelves, and a houseplant we somehow kept alive. It felt like home immediately.' },
  { year: '2026', title: 'The proposal', body: 'At the top of Hobbit Hill, at golden hour, with the whole valley below — Chris asked, Ellie cried, and the dog ate the ring box.' },
]

/* ─────────────────────────────────────────
   SCHEDULE
───────────────────────────────────────── */
const EVENTS = [
  { time: '1:00',  period: 'pm', title: 'Guests Arrive',      body: 'Welcome drinks on the lawn. Hats encouraged, comfortable shoes essential.',     icon: <path d="M8 22h8M12 15v7M5 3h14l-1.5 7a5.5 5.5 0 0 1-11 0L5 3Z"/> },
  { time: '1:30',  period: 'pm', title: 'The Ceremony',       body: 'Under the oak at the top of the hill. Please be seated by 1:20.',               icon: <><circle cx="9" cy="14" r="6"/><circle cx="15" cy="14" r="6"/><path d="M9 8l1.5-4h3L15 8"/></> },
  { time: '2:30',  period: 'pm', title: 'Drinks & Canapés',   body: 'Lawn games, a string trio, and far too many photographs.',                       icon: <><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/></> },
  { time: '4:30',  period: 'pm', title: 'Wedding Breakfast',  body: 'A long table, a long lunch, and a few longer speeches.',                         icon: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></> },
  { time: '7:30',  period: 'pm', title: 'Evening Reception',  body: 'Cake, first dance, and the band until late.',                                    icon: <><path d="M9 18V5l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="15" r="3"/></> },
  { time: '12:00', period: 'am', title: 'Carriages',          body: 'Last orders at 11:30. Taxis depart from the main gate.',                         icon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/> },
]

/* ─────────────────────────────────────────
   TRAVEL
───────────────────────────────────────── */
const TRAVEL = [
  { title: 'By Car',       icon: <><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>, body: ['From the M6: exit at junction 31, follow the A59 towards Clitheroe.', 'Postcode for sat-nav: BB7 1AX', 'Free on-site parking for all guests.', 'Cars may be left overnight — collect by noon Sunday.'] },
  { title: 'By Train',     icon: <><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6V4M16 6V4M2 10h20"/></>,                            body: ['Clitheroe station is 15 minutes\' drive away.', 'Regular services from Manchester Victoria (approx. 1hr).', 'Taxis available from the station — we recommend pre-booking.'] },
  { title: 'Staying Over', icon: <><path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"/></>,                                           body: ['On-site glamping — a handful of bell tents. Email us to reserve.', 'The Swan, Clitheroe — 10 min drive. Mention the wedding when booking.', 'Ribble Valley Inn — 15 min drive. Lovely rooms, great breakfast.'] },
  { title: 'End of Evening', icon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/>,                                                body: ['Taxis from the main gate at 11:30 pm.', 'Leaving your car overnight is absolutely fine.', 'Please don\'t drink and drive. The hills will still be here in the morning.'] },
]

/* ─────────────────────────────────────────
   REGISTRY
───────────────────────────────────────── */
const GIFTS = [
  { title: 'The Honeymoon Fund',     body: 'Three weeks island-hopping in Greece. Help us toward a sunset or two.',                  meta: 'Contribution', progress: 64 },
  { title: 'A Tree for the Garden',  body: 'We\'re planting an orchard at the new house — claim a tree in your name.',               meta: '£45 each',     progress: null },
  { title: 'Dinner at The Inn',      body: 'Toward our first anniversary meal back where it all happened.',                           meta: 'Contribution', progress: 38 },
  { title: 'Something for the Home', body: 'A small list of bits and pieces we\'d love, from our favourite shops.',                  meta: 'View list',    progress: null },
]

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
const FAQS = [
  { q: 'Can I bring a plus-one?',                    a: 'Your invitation will name everyone we\'ve saved a seat for. If it says "& Guest", we\'d love to meet them!' },
  { q: 'Are children welcome?',                      a: 'We adore your little ones, but we\'ve chosen to keep the day mostly grown-up so everyone can relax. Children of the immediate family are of course invited.' },
  { q: 'What should I wear?',                        a: 'Garden formal. Summer suits, floaty dresses, and a layer for the evening — the valley cools down after dark. The ceremony is on grass, so heels may sink.' },
  { q: 'Is there parking?',                          a: 'Yes, plenty on site. You\'re welcome to leave your car overnight and collect it by noon the next day.' },
  { q: 'Will the ceremony be indoors or outdoors?',  a: 'Outdoors under the oak if the weather is kind, with a covered barn on standby. We\'ll make the call on the morning.' },
  { q: 'When should I RSVP by?',                     a: 'Kindly by 1 April 2027, so we can give the venue our final numbers. The sooner the merrier!' },
]

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="max-w-[720px] mx-auto">
      {FAQS.map((f, i) => (
        <div key={i} className="border-b border-sage-200">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer py-5 px-1 text-left"
          >
            <span className="font-[var(--font-display)] font-semibold text-[21px] text-fg1">{f.q}</span>
            <span className="shrink-0 w-6 h-6 relative text-gold-700">
              <span className="absolute top-1/2 left-1/2 w-3.5 h-px bg-current -translate-x-1/2 -translate-y-1/2" />
              <span
                className="absolute top-1/2 left-1/2 w-px h-3.5 bg-current -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                style={{ transform: `translate(-50%,-50%) scaleY(${open === i ? 0 : 1})` }}
              />
            </span>
          </button>
          <div className="overflow-hidden transition-all duration-[640ms]" style={{ maxHeight: open === i ? 220 : 0 }}>
            <p className="font-[var(--font-body)] text-[17px] leading-[1.7] text-fg2 mx-1 mb-6">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   SECTION BANNER (sage band)
───────────────────────────────────────── */
function SageBanner({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="relative bg-sage-500 overflow-hidden py-16 px-8 text-center">
      <div className="paper-wash" />
      <FloralCorners size={180} />
      <div className="relative max-w-[640px] mx-auto">
        {eyebrow && <p className="font-[var(--font-ui)] text-[12px] tracking-[0.34em] uppercase text-gold-300 mb-3">{eyebrow}</p>}
        <h2 className="font-[var(--font-display)] font-medium text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.06] text-[var(--on-sage-1)] m-0">
          {title}
        </h2>
        {intro && <p className="font-[var(--font-body)] text-[17px] leading-[1.65] text-[var(--on-sage-2)] mt-4 max-w-[520px] mx-auto">{intro}</p>}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   FULL PAGE
───────────────────────────────────────── */
export default function HomePage() {
  return (
    <div>

      {/* ── HERO ── */}
      <section className="relative bg-sage-500 overflow-hidden py-16 px-8 pb-20">
        <div className="paper-wash" />
        <FloralCorners size={320} />
        <div className="relative max-w-[1100px] mx-auto text-center">
          <div className="invitation-frame">
            <p className="font-[var(--font-ui)] text-[13px] tracking-[0.34em] uppercase text-gold-300 mb-4">Together with their families</p>
            <p className="font-[var(--font-script)] text-[30px] leading-[1.4] text-gold-300 mb-2">the wedding of</p>
            <h1
              className="font-[var(--font-display)] font-medium leading-[1.02] text-[var(--on-sage-1)] tracking-[0.01em] m-0"
              style={{ fontSize: 'clamp(3.2rem, 8vw, 5.6rem)' }}
            >
              Ellie <span className="font-[var(--font-script)] text-gold-300" style={{ fontSize: '0.78em' }}>&amp;</span> Chris
            </h1>
            <div className="my-6">
              <GoldDivider label="Saturday the 10th July, 2027" width={70} />
            </div>
            <p className="font-[var(--font-ui)] text-[13px] tracking-[0.28em] uppercase text-[var(--on-sage-2)]">
              Hobbit Hill &middot; Clitheroe
            </p>
            <p className="font-[var(--font-script)] text-[32px] leading-none text-[var(--on-sage-1)] mt-7">
              An unexpected journey begins
            </p>
          </div>
        </div>
      </section>

      {/* ── WELCOME + COUNTDOWN ── */}
      <section className="bg-cream py-24 px-8">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="font-[var(--font-ui)] text-[13px] tracking-[0.34em] uppercase text-gold-700 mb-4">We&apos;re getting married</p>
          <h2
            className="font-[var(--font-display)] font-medium text-fg1 mb-6"
            style={{ fontSize: 'clamp(2rem,4vw,2.9rem)', lineHeight: 1.15 }}
          >
            After eight summers together, we&apos;re making it official in the hills we love.
          </h2>
          <p className="font-[var(--font-body)] text-[19px] leading-[1.7] text-fg2">
            We can&apos;t wait to celebrate with you at Hobbit Hill — a day of good food, long toasts, and dancing under the Ribble Valley sky. Everything you need to know is below.
          </p>
          <div className="my-14">
            <GoldDivider width={120} color="var(--color-gold-500)" />
          </div>
          <Countdown />
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <SageBanner eyebrow="How we got here" title="Our Story" intro="Eight years, two homes, one cat, and a beautiful daughter later — here's the short version." />
      <section className="bg-cream px-8 py-20">
        <div className="max-w-[960px] mx-auto grid gap-14" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
          <ol className="list-none m-0 p-0 relative">
            <span className="absolute left-[7px] top-2 bottom-2 w-px bg-sage-300" />
            {STORY.map((s, i) => (
              <li key={s.year} className="relative pl-10" style={{ paddingBottom: i < STORY.length - 1 ? 44 : 0 }}>
                <span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-cream border-2 border-gold-500" />
                <p className="font-[var(--font-ui)] text-[12px] tracking-[0.24em] uppercase text-gold-700 mb-1.5">{s.year}</p>
                <h3 className="font-[var(--font-display)] font-semibold text-[24px] text-fg1 m-0 mb-2">{s.title}</h3>
                <p className="font-[var(--font-body)] text-[17px] leading-[1.65] text-fg2 m-0">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="sticky top-10 self-start">
            <div className="p-2.5 border border-sage-200 bg-cream-bright">
              <div className="w-full h-[460px] bg-sage-100 flex items-center justify-center text-fg3 font-[var(--font-body)] italic text-[15px]">
                A favourite photo of you two
              </div>
            </div>
            <p className="font-[var(--font-body)] italic text-[15px] text-fg3 text-center mt-3.5">
              Pendle Hill, the morning it all began.
            </p>
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <SageBanner eyebrow="Saturday, 10 July 2027" title="The Day" intro="Here's how the day unfolds at Hobbit Hill. Come as you are, stay as long as you like." />
      <section className="bg-cream px-8 py-20">
        <div className="max-w-[760px] mx-auto flex flex-col gap-4">
          {EVENTS.map(e => (
            <div key={e.title} className="flex items-stretch overflow-hidden bg-cream-bright border border-sage-200 rounded-[8px] shadow-md">
              <div className="flex flex-col items-center justify-center w-[116px] bg-sage-100 border-r border-sage-200 py-5 px-2.5 shrink-0">
                <span className="font-[var(--font-display)] font-medium text-[30px] text-sage-700 leading-none">{e.time}</span>
                <span className="font-[var(--font-ui)] text-[11px] tracking-[0.2em] uppercase text-fg3 mt-1">{e.period}</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-5">
                <svg className="shrink-0 text-gold-700" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{e.icon}</svg>
                <div>
                  <h3 className="font-[var(--font-display)] font-semibold text-[22px] text-fg1 m-0 mb-1">{e.title}</h3>
                  <p className="font-[var(--font-body)] text-[16px] leading-[1.55] text-fg2 m-0">{e.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="max-w-[760px] mx-auto mt-10 text-center font-[var(--font-body)] italic text-[16px] text-fg3">
          Dress code: garden formal — think summer suits and floaty frocks. The lawn is grass, so maybe pack a flat shoe.
        </p>
      </section>

      {/* ── TRAVEL ── */}
      <SageBanner eyebrow="Getting here" title="Travel & Stay" intro="Hobbit Hill is tucked in the Ribble Valley, just outside Clitheroe." />
      <section className="bg-cream px-8 py-20">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 gap-5">
          {TRAVEL.map(c => (
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

      {/* ── REGISTRY ── */}
      <SageBanner eyebrow="Your presence is the present" title="Registry" intro="Honestly, having you there is more than enough. But for those who've asked — a few ways to spoil us." />
      <section className="bg-cream px-8 py-20">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 gap-5">
          {GIFTS.map(g => (
            <Card key={g.title} className="flex flex-col">
              <p className="font-[var(--font-ui)] text-[11px] tracking-[0.2em] uppercase text-gold-700 mb-2.5">{g.meta}</p>
              <h3 className="font-[var(--font-display)] font-semibold text-[23px] text-fg1 m-0 mb-2">{g.title}</h3>
              <p className="font-[var(--font-body)] text-[16px] leading-[1.6] text-fg2 mb-5 flex-1">{g.body}</p>
              {g.progress != null && (
                <div className="mb-4">
                  <div className="h-1.5 rounded-full bg-sage-100 overflow-hidden mb-2">
                    <div className="h-full bg-gold-500 rounded-full" style={{ width: `${g.progress}%` }} />
                  </div>
                  <p className="font-[var(--font-ui)] text-[11px] tracking-[0.14em] uppercase text-fg3">{g.progress}% toward our goal</p>
                </div>
              )}
              <Button variant={g.progress != null ? 'gold' : 'outline'} full>
                {g.progress != null ? 'Contribute' : 'View'}
              </Button>
            </Card>
          ))}
        </div>
        <p className="max-w-[560px] mx-auto mt-10 text-center font-[var(--font-body)] italic text-[16px] text-fg3">
          If you&apos;d rather give in another way, a card on the day is always welcome — and always treasured.
        </p>
      </section>

      {/* ── GALLERY ── */}
      <SageBanner eyebrow="A few of our favourites" title="Gallery" intro="Moments from the last eight years — and soon, from the big day." />
      <section className="bg-cream px-8 py-20">
        <div className="max-w-[1040px] mx-auto" style={{ columnCount: 3, columnGap: 16 }}>
          {[{ ar: '3/4' },{ ar: '1/1' },{ ar: '3/4' },{ ar: '1/1' },{ ar: '3/4' },{ ar: '4/5' },{ ar: '4/5' },{ ar: '3/4' },{ ar: '1/1' }].map((t, i) => (
            <div key={i} className="break-inside-avoid mb-4 p-2 bg-cream-bright border border-sage-200 shadow-sm">
              <div className="w-full bg-sage-100 flex items-center justify-center text-fg3 font-[var(--font-body)] italic text-[14px]" style={{ aspectRatio: t.ar }}>
                Add a photo
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="font-[var(--font-body)] italic text-[16px] text-fg3 mb-4">
            After the wedding, we&apos;ll add a shared album here for everyone&apos;s snaps.
          </p>
          <Button variant="outline">Upload your photos</Button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <SageBanner eyebrow="Good to know" title="Questions" intro="A few things guests often ask. Can't find your answer? Drop us a line." />
      <section className="bg-cream px-8 py-20">
        <FaqAccordion />
        <div className="text-center mt-10">
          <p className="font-[var(--font-body)] italic text-[16px] text-fg3 mb-4">Still curious about something?</p>
          <Button variant="gold">Email Ellie &amp; Chris</Button>
        </div>
      </section>

      {/* ── UPDATE RSVP ── */}
      <SageBanner eyebrow="Need to make a change?" title="Update your reply" intro="If your party size or dietary needs change, just update below." />
      <section className="bg-cream px-8 py-16 pb-24">
        <RSVPForm />
      </section>

    </div>
  )
}
