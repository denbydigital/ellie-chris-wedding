'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import FloralCorners from '@/components/ui/FloralCorners'
import GoldDivider from '@/components/ui/GoldDivider'

function Countdown() {
  const target = new Date('2027-07-10T13:00:00')
  const [diff, setDiff] = useState(Math.max(0, target.getTime() - Date.now()))
  useEffect(() => { const t = setInterval(() => setDiff(Math.max(0, target.getTime() - Date.now())), 1000); return () => clearInterval(t) }, [])
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return (
    <div className="flex gap-12 justify-center flex-wrap">
      {[[d,'Days'],[h,'Hours'],[m,'Minutes'],[s,'Seconds']].map(([n,l]) => (
        <div key={l as string} className="flex flex-col items-center min-w-[72px]">
          <span className="font-[var(--font-display)] font-medium text-[56px] leading-none text-sage-700">{String(n).padStart(2,'0')}</span>
          <span className="font-[var(--font-ui)] text-[11px] tracking-[0.26em] uppercase text-fg3 mt-2.5">{l as string}</span>
        </div>
      ))}
    </div>
  )
}

const quickLinks = [
  { href: '/schedule', label: 'Schedule', sub: 'How the day unfolds', icon: <path d="M8 22h8M12 15v7M5 3h14l-1.5 7a5.5 5.5 0 0 1-11 0L5 3Z"/> },
  { href: '/travel', label: 'Travel', sub: 'Getting here & staying', icon: <><circle cx="12" cy="10" r="3"/><path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7Z"/></> },
  { href: '/registry', label: 'Registry', sub: 'For those who\'ve asked', icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/> },
  { href: '/faq', label: 'FAQ', sub: 'Good to know', icon: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></> },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-sage-500 overflow-hidden py-[60px] px-8 pb-[84px]">
        <div className="paper-wash" />
        <FloralCorners size={300} />
        <div className="relative max-w-[1100px] mx-auto text-center">
          <div className="invitation-frame">
            <p className="font-[var(--font-ui)] text-[13px] tracking-[0.34em] uppercase text-gold-300 mb-4">Together with their families</p>
            <p className="font-[var(--font-script)] text-[30px] leading-[1.4] text-gold-300 mb-2.5">the wedding of</p>
            <h1 className="font-[var(--font-display)] font-medium leading-[1.02] text-[var(--on-sage-1)] tracking-[0.01em] m-0"
                style={{ fontSize: 'clamp(3.2rem, 8vw, 5.6rem)' }}>
              Ellie <span className="font-[var(--font-script)] text-gold-300" style={{ fontSize: '0.78em' }}>&amp;</span> Chris
            </h1>
            <div className="my-6">
              <GoldDivider label="Saturday the 10th July, 2027" width={70} />
            </div>
            <p className="font-[var(--font-ui)] text-[13px] tracking-[0.28em] uppercase text-[var(--on-sage-2)]">Hobbit Hill &middot; Clitheroe</p>
            <p className="font-[var(--font-script)] text-[32px] leading-none text-[var(--on-sage-1)] mt-7">An unexpected journey begins</p>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="bg-cream py-24 px-8">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="font-[var(--font-ui)] text-[13px] tracking-[0.34em] uppercase text-gold-700 mb-4">We&apos;re getting married</p>
          <h2 className="font-[var(--font-display)] font-medium text-fg1 mb-6" style={{ fontSize: 'clamp(2rem,4vw,2.9rem)', lineHeight: 1.15 }}>
            After eight summers together, we&apos;re making it official in the hills we love.
          </h2>
          <p className="font-[var(--font-body)] text-[19px] leading-[1.7] text-fg2">
            We can&apos;t wait to celebrate with you at Hobbit Hill — a day of good food, long toasts, and dancing under the Ribble Valley sky.
          </p>
          <div className="my-14"><GoldDivider width={120} color="var(--color-gold-500)" /></div>
          <Countdown />
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-sage-100 py-16 px-8">
        <div className="max-w-[900px] mx-auto grid grid-cols-4 gap-4">
          {quickLinks.map(({ href, label, sub, icon }) => (
            <Link key={href} href={href} className="block bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm p-7 text-center no-underline hover:shadow-md transition-shadow">
              <svg className="mx-auto mb-2.5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              <div className="font-[var(--font-display)] font-semibold text-[18px] text-fg1 mb-1">{label}</div>
              <div className="font-[var(--font-body)] text-[14px] text-fg3">{sub}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
