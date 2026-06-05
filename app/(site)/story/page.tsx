import SectionHeader from '@/components/site/SectionHeader'

const STORY = [
  { year: '2019', title: 'A rainy queue in Manchester', body: 'We met sheltering under the same café awning on Oxford Road. Chris offered half his umbrella; Ellie offered half her chips. The rest is history.' },
  { year: '2021', title: 'The first of many hills', body: 'A misjudged "gentle stroll" up Pendle Hill turned into a five-hour adventure. We\'ve been climbing things together ever since.' },
  { year: '2023', title: 'Moving in', body: 'One small flat, two strong opinions about bookshelves, and a houseplant we somehow kept alive. It felt like home immediately.' },
  { year: '2026', title: 'The proposal', body: 'At the top of Hobbit Hill, at golden hour, with the whole valley below — Chris asked, Ellie cried, and the dog ate the ring box.' },
]

export default function StoryPage() {
  return (
    <div>
      <SectionHeader eyebrow="How we got here" title="Our Story" intro="Eight years, two homes, one cat, and a beautiful daughter later — here's the short version." />
      <section className="bg-cream py-0 px-8 pb-24 pt-20">
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
          <div className="sticky top-24 self-start">
            <div className="p-2.5 border border-sage-200 bg-cream-bright">
              <div className="w-full h-[460px] bg-sage-100 flex items-center justify-center text-fg3 font-[var(--font-body)] italic text-[15px]">
                A favourite photo of you two
              </div>
            </div>
            <p className="font-[var(--font-body)] italic text-[15px] text-fg3 text-center mt-3.5">Pendle Hill, the morning it all began.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
