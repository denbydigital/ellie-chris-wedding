import { Variants } from 'framer-motion'

/* ── Easing ── */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/* ── Shared viewport config ── */
export const VIEWPORT = { once: true, margin: '-80px 0px' }

/* ── Variants ── */

/** Simple fade + subtle rise — for body text, labels, captions */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

/** Deeper rise — for headings and hero elements */
export const riseUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
}

/** Gentle scale-in — for the invitation frame */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 1.0, ease: EASE_OUT_EXPO },
  },
}

/** Slide from left — for story timeline items */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
}

/** Stagger container */
export function stagger(delayChildren = 0.08, staggerChildren = 0.1): Variants {
  return {
    hidden: {},
    visible: {
      transition: { delayChildren, staggerChildren },
    },
  }
}

/** Line draw — for the gold divider lines */
export const lineGrow: Variants = {
  hidden: { scaleX: 0, originX: 0.5 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
}

/** Diamond/label pop in after lines */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.5 },
  },
}
