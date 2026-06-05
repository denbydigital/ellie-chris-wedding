'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import GoldDivider from '@/components/ui/GoldDivider'
import Button from '@/components/ui/Button'
import RSVPForm from '@/components/site/RSVPForm'
import { fadeUp, riseUp, scaleIn, slideLeft, stagger, VIEWPORT, EASE_OUT_EXPO } from '@/lib/animation'

/* ─── Reveal wrapper ─── */
function Reveal({ children, className = '', variants = fadeUp, delay = 0 }: {
  children: React.ReactNode; className?: string; variants?: typeof fadeUp; delay?: number
}) {
  return (
    <motion.div className={className} variants={variants} initial="hidden"
      whileInView="visible" viewport={VIEWPORT} transition={{ delay } as object}>
      {children}
    </motion.div>
  )
}

/* ─── Countdown ─── */
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
    <motion.div className="flex gap-10 justify-center flex-wrap"
      variants={stagger(0.1, 0.12)} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
      {parts.map(([n, l]) => (
        <motion.div key={l} variants={fadeUp} className="flex flex-col items-center min-w-[64px]">
          <AnimatePresence mode="popLayout">
            <motion.span key={`${l}-${n}`}
              className="font-[var(--font-display)] font-medium text-[52px] leading-none text-sage-700 tabular-nums"
              initial={{ opacity: 0.4, y: -5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}>
              {String(n).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
          <span className="font-[var(--font-ui)] text-[11px] tracking-[0.26em] uppercase text-fg3 mt-2">{l}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─── FAQ ─── */
const FAQS = [
  { q: 'Can I bring a plus-one?', a: 'Your invitation will name everyone we\'ve saved a seat for. If it says "& Guest", we\'d love to meet them!' },
  { q: 'Are children welcome?', a: 'We adore your little ones, but we\'ve chosen to keep the day mostly grown-up so everyone can relax. Children of the immediate family are of course invited.' },
  { q: 'What should I wear?', a: 'Garden formal. Summer suits, floaty dresses, and a layer for the evening — the valley cools down after dark. The ceremony is on grass, so heels may sink.' },
  { q: 'Is there parking?', a: 'Yes, plenty on site. You\'re welcome to leave your car overnight and collect it by noon the next day.' },
  { q: 'Will the ceremony be indoors or outdoors?', a: 'Outdoors under the oak if the weather is kind, with a covered barn on standby. We\'ll make the call on the morning.' },
  { q: 'When should I RSVP by?', a: 'Kindly by 1 April 2027, so we can give the venue our final numbers. The sooner the merrier!' },
]
function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="max-w-[720px] mx-auto">
      {FAQS.map((f, i) => (
        <motion.div key={i} className="border-b border-sage-200" variants={fadeUp}
          initial="hidden" whileInView="visible" viewport={VIEWPORT}
          transition={{ delay: i * 0.07 } as object}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer py-5 px-1 text-left">
            <span className="font-[var(--font-display)] font-semibold text-[21px] text-fg1">{f.q}</span>
            <motion.span className="shrink-0 w-6 h-6 relative text-gold-700"
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}>
              <span className="absolute top-1/2 left-1/2 w-3.5 h-px bg-current -translate-x-1/2 -translate-y-1/2" />
              <span className="absolute top-1/2 left-1/2 w-px h-3.5 bg-current -translate-x-1/2 -translate-y-1/2" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                style={{ overflow: 'hidden' }}>
                <p className="font-[var(--font-body)] text-[17px] leading-[1.7] text-fg2 mx-1 mb-6">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Section label (replaces sage banner — lighter touch) ─── */
function SectionLabel({ eyebrow, title, light = false }: { eyebrow?: string; title: string; light?: boolean }) {
  const ink = light ? 'text-[var(--on-sage-1)]' : 'text-fg1'
  const sub = light ? 'text-gold-300' : 'text-gold-700'
  return (
    <div className="text-center mb-12">
      {eyebrow && <Reveal><p className={`font-[var(--font-ui)] text-[12px] tracking-[0.34em] uppercase mb-3 ${sub}`}>{eyebrow}</p></Reveal>}
      <Reveal variants={riseUp} delay={eyebrow ? 0.06 : 0}>
        <h2 className={`font-[var(--font-display)] font-medium m-0 ${ink}`}
          style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.06 }}>
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <div className="mt-6">
          <GoldDivider width={60} color={light ? 'var(--color-gold-300)' : 'var(--color-gold-500)'} />
        </div>
      </Reveal>
    </div>
  )
}

/* ─── Full-bleed photo break ─── */
function PhotoBreak({ src, alt, height = 560, overlay = 0.25 }: {
  src: string; alt: string; height?: number; overlay?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])
  return (
    <div ref={ref} className="relative overflow-hidden w-full" style={{ height }}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </motion.div>
      {overlay > 0 && (
        <div className="absolute inset-0" style={{ background: `rgba(40,50,40,${overlay})` }} />
      )}
    </div>
  )
}

import React from 'react'

/* ═══════════════════════════════════════════════════════
   GALLERY DATA
═══════════════════════════════════════════════════════ */
const GALLERY = [
  { src: '/assets/venue/scenic-accommodation-5.jpg', alt: 'Hobbit Hill cabins lit up at night',          ar: '4/3'  },
  { src: '/assets/venue/scenic-accommodation-3.jpg', alt: 'The Shire dining kitchen',                    ar: '4/3'  },
  { src: '/assets/venue/interior.jpg',               alt: 'Wedding breakfast room with valley views',    ar: '4/3'  },
  { src: '/assets/venue/scenic-accommodation-1.jpg', alt: 'The bridal suite at Hobbit Hill',             ar: '4/3'  },
  { src: '/assets/venue/scenic-accommodation-2.jpg', alt: 'Hobbit Hill hallway',                         ar: '3/4'  },
  { src: '/assets/venue/scenic-lodge-1.jpg',         alt: 'The luxury lodge at Hobbit Hill',             ar: '4/3'  },
  { src: '/assets/venue/scenic-lodge-2.jpg',         alt: 'Lodge bedroom at Hobbit Hill',                ar: '4/3'  },
  { src: '/assets/venue/scenic-watercolour.jpg',     alt: 'Watercolour of the ceremony arch',            ar: '3/4'  },
]

/* ─── Schedule data ─── */
const EVENTS = [
  { time: '1:00',  period: 'pm', title: 'Guests Arrive',     body: 'Welcome drinks on the lawn. Hats encouraged, comfortable shoes essential.',   icon: <path d="M8 22h8M12 15v7M5 3h14l-1.5 7a5.5 5.5 0 0 1-11 0L5 3Z"/> },
  { time: '1:30',  period: 'pm', title: 'The Ceremony',      body: 'Under the oak at the top of the hill. Please be seated by 1:20.',             icon: <><circle cx="9" cy="14" r="6"/><circle cx="15" cy="14" r="6"/><path d="M9 8l1.5-4h3L15 8"/></> },
  { time: '2:30',  period: 'pm', title: 'Drinks & Canapés',  body: 'Lawn games, a string trio, and far too many photographs.',                    icon: <><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/></> },
  { time: '4:30',  period: 'pm', title: 'Wedding Breakfast', body: 'A long table, a long lunch, and a few longer speeches.',                       icon: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></> },
  { time: '7:30',  period: 'pm', title: 'Evening Reception', body: 'Cake, first dance, and the band until late.',                                  icon: <><path d="M9 18V5l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="15" r="3"/></> },
  { time: '12:00', period: 'am', title: 'Carriages',         body: 'Last orders at 11:30. Taxis depart from the main gate.',                       icon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/> },
]

/* ─── Travel data ─── */
const TRAVEL = [
  { title: 'By Car', icon: <><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>, body: ['From the M6: exit at junction 31, follow the A59 towards Clitheroe.', 'Sat-nav postcode: BB7 1AX', 'Free on-site parking. Cars may stay overnight — collect by noon Sunday.'] },
  { title: 'By Train', icon: <><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6V4M16 6V4M2 10h20"/></>, body: ['Clitheroe station is 15 minutes\' drive away.', 'Regular services from Manchester Victoria (approx. 1hr).', 'Taxis from the station — we recommend pre-booking.'] },
  { title: 'Staying Over', icon: <><path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"/></>, body: ['On-site glamping — bell tents available. Email us to reserve.', 'The Swan, Clitheroe — 10 min drive. Mention the wedding.', 'Ribble Valley Inn — 15 min drive. Lovely rooms, great breakfast.'] },
  { title: 'End of Evening', icon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/>, body: ['Taxis leave from the main gate at 11:30 pm.', 'Leaving your car overnight is absolutely fine.', 'Please don\'t drink and drive. The hills will still be here in the morning.'] },
]

/* ─── Registry data ─── */
const GIFTS = [
  { title: 'The Honeymoon Fund', body: 'Three weeks island-hopping in Greece. Help us toward a sunset or two.', meta: 'Contribution', progress: 64 },
  { title: 'A Tree for the Garden', body: 'We\'re planting an orchard at the new house — claim a tree in your name.', meta: '£45 each', progress: null },
  { title: 'Dinner at The Inn', body: 'Toward our first anniversary meal back where it all happened.', meta: 'Contribution', progress: 38 },
  { title: 'Something for the Home', body: 'A small list of bits and pieces we\'d love, from our favourite shops.', meta: 'View list', progress: null },
]

/* ─── Story data ─── */
const STORY = [
  { year: '2019', title: 'A rainy queue in Manchester', body: 'We met sheltering under the same café awning on Oxford Road. Chris offered half his umbrella; Ellie offered half her chips. The rest is history.' },
  { year: '2021', title: 'The first of many hills', body: 'A misjudged "gentle stroll" up Pendle Hill turned into a five-hour adventure. We\'ve been climbing things together ever since.' },
  { year: '2023', title: 'Moving in', body: 'One small flat, two strong opinions about bookshelves, and a houseplant we somehow kept alive. It felt like home immediately.' },
  { year: '2026', title: 'The proposal', body: 'At the top of Hobbit Hill, at golden hour, with the whole valley below — Chris asked, Ellie cried, and the dog ate the ring box.' },
]


/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="bg-cream">

      {/* ══ HERO — full-bleed photo with invitation overlay ══ */}
      <section className="relative w-full overflow-hidden" style={{ height: '100svh', minHeight: 640 }}>
        {/* Photo */}
        <Image
          src="/assets/venue/scenic-accommodation-5.jpg"
          alt="Hobbit Hill at night"
          fill priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Layered overlays: dark base + sage tint */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(40,50,40,0.52) 0%, rgba(40,50,40,0.38) 50%, rgba(40,50,40,0.65) 100%)'
        }} />

        {/* Invitation card */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.div
            className="w-full max-w-[640px] text-center"
            variants={scaleIn} initial="hidden" animate="visible"
          >
            <div className="relative border border-white/35 px-8 py-12 md:px-14 md:py-16"
              style={{ boxShadow: '0 0 0 1px rgba(220,196,137,0.3) inset, 0 32px 80px rgba(0,0,0,0.3)' }}>
              {/* inner hairline */}
              <div className="absolute inset-3 border border-gold-300/30 pointer-events-none" />

              <motion.div variants={stagger(0.35, 0.14)} initial="hidden" animate="visible">
                <motion.p variants={fadeUp} className="font-[var(--font-ui)] text-[12px] tracking-[0.36em] uppercase text-gold-300 mb-4">
                  Together with their families
                </motion.p>
                <motion.p variants={fadeUp} className="font-[var(--font-script)] text-[26px] leading-none text-gold-300 mb-3">
                  the wedding of
                </motion.p>
                <motion.h1 variants={riseUp}
                  className="font-[var(--font-display)] font-medium leading-[1.0] text-white m-0"
                  style={{ fontSize: 'clamp(3rem, 9vw, 6rem)', textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}>
                  Ellie <span className="font-[var(--font-script)] text-gold-300" style={{ fontSize: '0.8em' }}>&amp;</span> Chris
                </motion.h1>
                <motion.div variants={fadeUp} className="my-6">
                  <GoldDivider label="Saturday the 10th July, 2027" width={56} animate={false} />
                </motion.div>
                <motion.p variants={fadeUp} className="font-[var(--font-ui)] text-[12px] tracking-[0.3em] uppercase text-white/80">
                  Hobbit Hill &middot; Clitheroe
                </motion.p>
                <motion.p variants={fadeUp} className="font-[var(--font-script)] text-[28px] leading-none text-white/90 mt-6">
                  An unexpected journey begins
                </motion.p>
              </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
              className="mt-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
              <span className="font-[var(--font-ui)] text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
              <motion.div className="w-px h-8 bg-white/30"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ WELCOME + COUNTDOWN ══ */}
      <section className="bg-cream py-24 px-8">
        <div className="max-w-[680px] mx-auto text-center">
          <Reveal variants={riseUp}>
            <h2 className="font-[var(--font-display)] font-medium text-fg1 mb-6"
              style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', lineHeight: 1.15 }}>
              After eight summers together, we&apos;re making it official in the hills we love.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-[var(--font-body)] text-[19px] leading-[1.7] text-fg2">
              We can&apos;t wait to celebrate with you at Hobbit Hill — a day of good food, long toasts, and dancing under the Ribble Valley sky.
            </p>
          </Reveal>
          <div className="my-14">
            <GoldDivider width={100} color="var(--color-gold-500)" />
          </div>
          <Countdown />
        </div>
      </section>

      {/* ══ FULL-BLEED PHOTO — sage kitchen with flowers ══ */}
      <PhotoBreak src="/assets/venue/scenic-accommodation-3.jpg" alt="Hobbit Hill venue" height={520} overlay={0.05} />

      {/* ══ OUR STORY ══ */}
      <section className="bg-cream px-8 py-24">
        <div className="max-w-[1000px] mx-auto">
          <SectionLabel eyebrow="How we got here" title="Our Story" />
          <div className="grid gap-14 items-start" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Photo */}
            <motion.div
              className="relative flex items-center justify-center bg-cream-bright border border-sage-200 rounded-[4px] p-8"
              style={{ aspectRatio: '3/4' }}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <Image src="/assets/venue/scenic-watercolour.jpg"
                alt="Watercolour of the ceremony arch at Hobbit Hill"
                fill className="object-contain p-6" sizes="50vw" />
            </motion.div>
            {/* Timeline */}
            <div className="py-4">
              <ol className="list-none m-0 p-0 relative">
                <motion.span className="absolute left-[7px] top-2 bottom-2 w-px bg-sage-300 origin-top"
                  initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={VIEWPORT}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }} />
                {STORY.map((s, i) => (
                  <motion.li key={s.year} className="relative pl-10"
                    style={{ paddingBottom: i < STORY.length - 1 ? 44 : 0 }}
                    variants={slideLeft} initial="hidden" whileInView="visible" viewport={VIEWPORT}
                    transition={{ delay: i * 0.12 } as object}>
                    <motion.span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-cream border-2 border-gold-500"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT}
                      transition={{ delay: i * 0.12 + 0.1, duration: 0.4, ease: EASE_OUT_EXPO } as object} />
                    <p className="font-[var(--font-ui)] text-[12px] tracking-[0.24em] uppercase text-gold-700 mb-1.5">{s.year}</p>
                    <h3 className="font-[var(--font-display)] font-semibold text-[24px] text-fg1 m-0 mb-2">{s.title}</h3>
                    <p className="font-[var(--font-body)] text-[17px] leading-[1.65] text-fg2 m-0">{s.body}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FULL-BLEED PHOTO — dining room with valley view ══ */}
      <PhotoBreak src="/assets/venue/interior.jpg" alt="The wedding breakfast room at Hobbit Hill" height={500} overlay={0.05} />

      {/* ══ THE DAY ══ */}
      <section className="bg-cream px-8 py-24">
        <div className="max-w-[760px] mx-auto">
          <SectionLabel eyebrow="Saturday, 10 July 2027" title="The Day" />
          <motion.div className="flex flex-col gap-3"
            variants={stagger(0, 0.09)} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {EVENTS.map((e, i) => (
              <motion.div key={e.title} variants={fadeUp} transition={{ delay: i * 0.07 } as object}
                className="flex items-stretch overflow-hidden bg-cream-bright border border-sage-200 rounded-[6px] shadow-sm">
                <div className="flex flex-col items-center justify-center w-[104px] bg-sage-100 border-r border-sage-200 py-5 px-2 shrink-0">
                  <span className="font-[var(--font-display)] font-medium text-[28px] text-sage-700 leading-none">{e.time}</span>
                  <span className="font-[var(--font-ui)] text-[10px] tracking-[0.2em] uppercase text-fg3 mt-1">{e.period}</span>
                </div>
                <div className="flex items-center gap-4 px-5 py-4">
                  <svg className="shrink-0 text-gold-700" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{e.icon}</svg>
                  <div>
                    <h3 className="font-[var(--font-display)] font-semibold text-[20px] text-fg1 m-0 mb-0.5">{e.title}</h3>
                    <p className="font-[var(--font-body)] text-[15px] leading-[1.55] text-fg2 m-0">{e.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <Reveal delay={0.3}>
            <p className="mt-8 text-center font-[var(--font-body)] italic text-[15px] text-fg3">
              Dress code: garden formal — summer suits and floaty frocks. The lawn is grass, so maybe pack a flat shoe.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ FULL-BLEED PHOTO — hallway with flowers ══ */}
      <PhotoBreak src="/assets/venue/scenic-accommodation-2.jpg" alt="Hobbit Hill accommodation" height={480} overlay={0.05} />

      {/* ══ TRAVEL ══ */}
      <section className="bg-cream px-8 py-24">
        <div className="max-w-[900px] mx-auto">
          <SectionLabel eyebrow="Getting here" title="Travel & Stay" />
          <motion.div className="grid grid-cols-2 gap-5"
            variants={stagger(0, 0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {TRAVEL.map((c, i) => (
              <motion.div key={c.title} variants={fadeUp} transition={{ delay: i * 0.08 } as object}
                className="bg-cream-bright border border-sage-200 rounded-[6px] p-7 shadow-sm">
                <h3 className="font-[var(--font-display)] font-semibold text-[21px] text-fg1 flex items-center gap-3 mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)"
                    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
                  {c.title}
                </h3>
                <ul className="pl-4 flex flex-col gap-1.5">
                  {c.body.map((b, j) => <li key={j} className="font-[var(--font-body)] text-[16px] leading-[1.65] text-fg2">{b}</li>)}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ REGISTRY ══ */}
      <section className="bg-sage-100 px-8 py-24">
        <div className="max-w-[900px] mx-auto">
          <SectionLabel eyebrow="Your presence is the present" title="Registry" />
          <motion.div className="grid grid-cols-2 gap-5"
            variants={stagger(0, 0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {GIFTS.map((g, i) => (
              <motion.div key={g.title} variants={fadeUp} transition={{ delay: i * 0.08 } as object}
                className="bg-cream-bright border border-sage-200 rounded-[6px] p-7 shadow-sm flex flex-col">
                <p className="font-[var(--font-ui)] text-[11px] tracking-[0.2em] uppercase text-gold-700 mb-2">{g.meta}</p>
                <h3 className="font-[var(--font-display)] font-semibold text-[22px] text-fg1 m-0 mb-2">{g.title}</h3>
                <p className="font-[var(--font-body)] text-[16px] leading-[1.6] text-fg2 mb-5 flex-1">{g.body}</p>
                {g.progress != null && (
                  <div className="mb-4">
                    <div className="h-1.5 rounded-full bg-sage-200 overflow-hidden mb-1.5">
                      <motion.div className="h-full bg-gold-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${g.progress}%` }}
                        viewport={VIEWPORT}
                        transition={{ duration: 1.0, ease: EASE_OUT_EXPO, delay: i * 0.08 + 0.3 } as object} />
                    </div>
                    <p className="font-[var(--font-ui)] text-[11px] tracking-[0.14em] uppercase text-fg3">{g.progress}% toward our goal</p>
                  </div>
                )}
                <Button variant={g.progress != null ? 'gold' : 'outline'} full>
                  {g.progress != null ? 'Contribute' : 'View'}
                </Button>
              </motion.div>
            ))}
          </motion.div>
          <Reveal delay={0.2}>
            <p className="max-w-[520px] mx-auto mt-10 text-center font-[var(--font-body)] italic text-[16px] text-fg3">
              A card on the day is always welcome — and always treasured.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ GALLERY — real venue photos ══ */}
      <section className="bg-cream px-8 py-24">
        <div className="max-w-[1100px] mx-auto">
          <SectionLabel eyebrow="Hobbit Hill" title="The Venue" />
          <motion.div
            className="columns-2 md:columns-3 gap-4"
            variants={stagger(0, 0.05)} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {GALLERY.map((img, i) => (
              <motion.div key={i}
                className="break-inside-avoid mb-4 overflow-hidden rounded-[4px] group cursor-zoom-in"
                variants={{ hidden: { opacity: 0, scale: 0.97 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: i * 0.04 } } }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: img.ar }}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                </div>
              </motion.div>
            ))}
          </motion.div>
          <Reveal delay={0.2}>
            <p className="text-center mt-8 font-[var(--font-body)] italic text-[16px] text-fg3">
              After the wedding, we&apos;ll add your own photos here too.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ FULL-BLEED PHOTO — cabins at night ══ */}
      <PhotoBreak src="/assets/venue/scenic-accommodation-5.jpg" alt="Hobbit Hill at night" height={500} overlay={0.1} />

      {/* ══ FAQ ══ */}
      <section className="bg-cream px-8 py-24">
        <div className="max-w-[760px] mx-auto">
          <SectionLabel eyebrow="Good to know" title="Questions" />
          <FaqAccordion />
          <Reveal delay={0.3}>
            <div className="text-center mt-10">
              <p className="font-[var(--font-body)] italic text-[16px] text-fg3 mb-4">Still curious about something?</p>
              <Button variant="gold">Email Ellie &amp; Chris</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ UPDATE RSVP ══ */}
      <section className="bg-sage-100 px-8 py-20 pb-28">
        <div className="max-w-[680px] mx-auto text-center mb-10">
          <SectionLabel eyebrow="Need to make a change?" title="Update your reply" />
          <p className="font-[var(--font-body)] text-[17px] leading-[1.65] text-fg2 -mt-4">
            If your party size or dietary needs change, update below.
          </p>
        </div>
        <RSVPForm />
      </section>

    </div>
  )
}
