'use client'
import { useState } from 'react'
import SectionHeader from '@/components/site/SectionHeader'
import Button from '@/components/ui/Button'

const FAQS = [
  { q: 'Can I bring a plus-one?', a: 'Your invitation will name everyone we\'ve saved a seat for. If it says "& Guest", we\'d love to meet them! If you\'re unsure, just ask us.' },
  { q: 'Are children welcome?', a: 'We adore your little ones, but we\'ve chosen to keep the day mostly grown-up so everyone can relax. Children of the immediate family are of course invited.' },
  { q: 'What should I wear?', a: 'Garden formal. Summer suits, floaty dresses, and a layer for the evening — the valley cools down after dark. The ceremony and drinks are on grass, so heels may sink.' },
  { q: 'Is there parking?', a: 'Yes, plenty on site. You\'re welcome to leave your car overnight and collect it by noon the next day.' },
  { q: 'Will the ceremony be indoors or outdoors?', a: 'Outdoors under the oak if the weather is kind, with a covered barn on standby. We\'ll make the call on the morning — either way, you\'ll be looked after.' },
  { q: 'When should I RSVP by?', a: 'Kindly by 1 April 2027, so we can give the venue our final numbers. The sooner the merrier!' },
]

export default function FaqPage() {
  const [open, setOpen] = useState(0)
  return (
    <div>
      <SectionHeader eyebrow="Good to know" title="Questions" intro="A few things guests often ask. Can't find your answer? Drop us a line." />
      <section className="bg-cream px-8 py-20 pb-24">
        <div className="max-w-[720px] mx-auto">
          {FAQS.map((f, i) => (
            <div key={i} className="border-b border-sage-200">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 bg-none border-none cursor-pointer py-5 px-1 text-left"
              >
                <span className="font-[var(--font-display)] font-semibold text-[21px] text-fg1">{f.q}</span>
                <span className="shrink-0 w-6 h-6 relative text-gold-700">
                  <span className="absolute top-1/2 left-1/2 w-3.5 h-px bg-current -translate-x-1/2 -translate-y-1/2" />
                  <span className="absolute top-1/2 left-1/2 w-px h-3.5 bg-current -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                        style={{ transform: `translate(-50%,-50%) scaleY(${open === i ? 0 : 1})` }} />
                </span>
              </button>
              <div className="overflow-hidden transition-all duration-[640ms]" style={{ maxHeight: open === i ? 220 : 0 }}>
                <p className="font-[var(--font-body)] text-[17px] leading-[1.7] text-fg2 mx-1 mb-6">{f.a}</p>
              </div>
            </div>
          ))}
          <div className="text-center mt-10">
            <p className="font-[var(--font-body)] italic text-[16px] text-fg3 mb-4">Still curious about something?</p>
            <Button variant="gold">Email Ellie &amp; Chris</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
