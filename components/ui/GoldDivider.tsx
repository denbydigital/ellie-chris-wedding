interface Props { label?: string; width?: number; color?: string }

export default function GoldDivider({ label, width = 64, color = 'var(--color-gold-300)' }: Props) {
  return (
    <div className="flex items-center justify-center gap-3.5" style={{ color }}>
      <span className="h-px opacity-65" style={{ width, background: 'currentColor', maxWidth: '22vw' }} />
      {label
        ? <span className="font-[var(--font-body)] italic text-[16px] whitespace-nowrap" style={{ color: 'currentColor' }}>{label}</span>
        : <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" /></svg>
      }
      <span className="h-px opacity-65" style={{ width, background: 'currentColor', maxWidth: '22vw' }} />
    </div>
  )
}
