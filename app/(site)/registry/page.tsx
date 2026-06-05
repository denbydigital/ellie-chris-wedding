import SectionHeader from '@/components/site/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const GIFTS = [
  { title: 'The Honeymoon Fund', body: 'Three weeks island-hopping in Greece. Help us toward a sunset or two.', meta: 'Contribution', progress: 64 },
  { title: 'A Tree for the Garden', body: 'We\'re planting an orchard at the new house — claim a tree in your name.', meta: '£45 each', progress: null },
  { title: 'Dinner at The Inn', body: 'Toward our first anniversary meal back where it all happened.', meta: 'Contribution', progress: 38 },
  { title: 'Something for the Home', body: 'A small list of bits and pieces we\'d love, from our favourite shops.', meta: 'View list', progress: null },
]

export default function RegistryPage() {
  return (
    <div>
      <SectionHeader eyebrow="Your presence is the present" title="Registry" intro="Honestly, having you there is more than enough. But for those who've asked — here are a few ways to spoil us." />
      <section className="bg-cream px-8 py-20 pb-24">
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
    </div>
  )
}
