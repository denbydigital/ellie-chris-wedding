'use client'
import { ButtonHTMLAttributes } from 'react'

type Variant = 'gold' | 'solid' | 'outline' | 'outline-sage' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  full?: boolean
}

const styles: Record<Variant, string> = {
  gold:         'bg-gold-500 text-forest-800 border-gold-500 hover:bg-gold-700 hover:border-gold-700',
  solid:        'bg-forest-800 text-cream border-forest-800 hover:bg-forest-900',
  outline:      'bg-transparent text-fg1 border-sage-300 hover:bg-sage-100 hover:border-sage-500',
  'outline-sage': 'bg-transparent text-[var(--on-sage-1)] border-[var(--line-on-sage)] hover:bg-white/10 hover:border-[var(--on-sage-1)]',
  ghost:        'bg-transparent border-transparent text-fg1 hover:opacity-70',
}

export default function Button({ variant = 'solid', full, className = '', children, ...props }: Props) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center gap-2.5 whitespace-nowrap',
        'font-[var(--font-ui)] text-[13px] tracking-[0.22em] uppercase',
        'px-8 py-[15px] border rounded-[4px] cursor-pointer',
        'transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        styles[variant],
        full ? 'w-full justify-center' : '',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
