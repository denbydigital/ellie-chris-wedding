import FloralCorners from '@/components/ui/FloralCorners'

interface Props {
  eyebrow?: string
  title: string
  intro?: string
}

export default function SectionHeader({ eyebrow, title, intro }: Props) {
  return (
    <section className="relative bg-sage-500 overflow-hidden py-[76px] px-8 text-center">
      <div className="paper-wash" />
      <FloralCorners size={210} />
      <div className="relative max-w-[680px] mx-auto">
        {eyebrow && (
          <p className="font-[var(--font-ui)] text-[13px] tracking-[0.34em] uppercase text-gold-300 mb-3.5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-[var(--font-display)] font-medium text-[clamp(2.6rem,5.5vw,4rem)] leading-[1.04] text-[var(--on-sage-1)] m-0">
          {title}
        </h1>
        {intro && (
          <p className="font-[var(--font-body)] text-[18px] leading-[1.65] text-[var(--on-sage-2)] max-w-[560px] mx-auto mt-5">
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
