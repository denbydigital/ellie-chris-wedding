export default function Footer() {
  return (
    <footer className="bg-forest-800 text-[var(--on-sage-2)] py-16 px-8 text-center">
      <div className="max-w-[1180px] mx-auto flex flex-col items-center">
        <div className="font-[var(--font-script)] text-[44px] leading-none text-gold-300">E &amp; C</div>
        <div className="font-[var(--font-display)] text-[26px] text-cream mt-4 mb-1">Ellie &amp; Chris</div>
        <div className="font-[var(--font-ui)] text-[12px] tracking-[0.24em] uppercase text-[var(--on-sage-3)] mb-6">
          10 July 2027 &middot; Hobbit Hill, Clitheroe
        </div>
        <div className="font-[var(--font-body)] italic text-[15px] text-[var(--on-sage-3)]">
          We can&apos;t wait to celebrate with you.
        </div>
      </div>
    </footer>
  )
}
