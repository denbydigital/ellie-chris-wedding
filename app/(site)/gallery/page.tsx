import SectionHeader from '@/components/site/SectionHeader'
import Button from '@/components/ui/Button'

const tiles = [
  { id: 'g1', ar: '3/4' }, { id: 'g2', ar: '1/1' }, { id: 'g3', ar: '3/4' },
  { id: 'g4', ar: '1/1' }, { id: 'g5', ar: '3/4' }, { id: 'g6', ar: '4/5' },
  { id: 'g7', ar: '4/5' }, { id: 'g8', ar: '3/4' }, { id: 'g9', ar: '1/1' },
]

export default function GalleryPage() {
  return (
    <div>
      <SectionHeader eyebrow="A few of our favourites" title="Gallery" intro="Moments from the last eight years — and soon, from the big day." />
      <section className="bg-cream px-8 py-20 pb-24">
        <div className="max-w-[1040px] mx-auto" style={{ columnCount: 3, columnGap: 16 }}>
          {tiles.map(t => (
            <div key={t.id} className="break-inside-avoid mb-4 p-2 bg-cream-bright border border-sage-200 shadow-sm">
              <div className="w-full bg-sage-100 flex items-center justify-center text-fg3 font-[var(--font-body)] italic text-[14px]"
                   style={{ aspectRatio: t.ar }}>
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
    </div>
  )
}
