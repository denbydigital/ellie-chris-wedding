import SectionHeader from '@/components/site/SectionHeader'

const EVENTS = [
  { time: '1:00', period: 'pm', title: 'Guests Arrive', body: 'Welcome drinks on the lawn. Hats encouraged, comfortable shoes essential.', icon: <path d="M8 22h8M12 15v7M5 3h14l-1.5 7a5.5 5.5 0 0 1-11 0L5 3Z"/> },
  { time: '1:30', period: 'pm', title: 'The Ceremony', body: 'Under the oak at the top of the hill. Please be seated by 1:20.', icon: <><circle cx="9" cy="14" r="6"/><circle cx="15" cy="14" r="6"/><path d="M9 8l1.5-4h3L15 8"/></> },
  { time: '2:30', period: 'pm', title: 'Drinks & Canapés', body: 'Lawn games, a string trio, and far too many photographs.', icon: <><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/></> },
  { time: '4:30', period: 'pm', title: 'Wedding Breakfast', body: 'A long table, a long lunch, and a few longer speeches.', icon: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></> },
  { time: '7:30', period: 'pm', title: 'Evening Reception', body: 'Cake, first dance, and the band until late.', icon: <><path d="M9 18V5l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="15" r="3"/></> },
  { time: '12:00', period: 'am', title: 'Carriages', body: 'Last orders at 11:30. Taxis depart from the main gate.', icon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/> },
]

export default function SchedulePage() {
  return (
    <div>
      <SectionHeader eyebrow="Saturday, 10 July 2027" title="The Day" intro="Here's how the day unfolds at Hobbit Hill. Come as you are, stay as long as you like." />
      <section className="bg-cream px-8 py-20 pb-24">
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
    </div>
  )
}
