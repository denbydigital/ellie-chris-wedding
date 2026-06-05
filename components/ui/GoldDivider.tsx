'use client'
import { motion } from 'framer-motion'
import { lineGrow, popIn, VIEWPORT, EASE_OUT_EXPO } from '@/lib/animation'

interface Props { label?: string; width?: number; color?: string; animate?: boolean }

export default function GoldDivider({ label, width = 64, color = 'var(--color-gold-300)', animate = true }: Props) {
  const lineStyle = { height: 1, background: 'currentColor', opacity: 0.65, maxWidth: '22vw' }

  if (!animate) {
    return (
      <div className="flex items-center justify-center gap-3.5" style={{ color }}>
        <span style={{ ...lineStyle, width }} />
        {label
          ? <span className="font-[var(--font-body)] italic text-[16px] whitespace-nowrap">{label}</span>
          : <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" /></svg>
        }
        <span style={{ ...lineStyle, width }} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-3.5" style={{ color }}>
      <motion.span
        style={{ ...lineStyle, width, display: 'block', transformOrigin: 'right' }}
        variants={lineGrow}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      />
      <motion.span
        variants={popIn}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {label
          ? <span className="font-[var(--font-body)] italic text-[16px] whitespace-nowrap">{label}</span>
          : <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" /></svg>
        }
      </motion.span>
      <motion.span
        style={{ ...lineStyle, width, display: 'block', transformOrigin: 'left' }}
        variants={lineGrow}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      />
    </div>
  )
}
