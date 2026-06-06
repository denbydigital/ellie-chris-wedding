'use client'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Botanical line-art down the left & right edges (extracted from the
 * couple's reference). As you scroll the page, a clip-path wipe reveals
 * them top-to-bottom — like they're being drawn on. Fixed behind content,
 * hidden on small screens so they never crowd the text.
 */
export default function FloralBackdrop() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 })

  // Reveal from the top downward as the page scrolls.
  const clip = useTransform(p, [0, 0.8], ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'])
  const clipStyle = reduce ? 'inset(0 0 0% 0)' : clip

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
      <div className="paper-wash" />
      <motion.img
        src="/assets/floral-left.png"
        alt=""
        className="hidden md:block absolute top-0 left-0 h-full w-auto"
        style={{ clipPath: clipStyle, opacity: 0.9 }}
      />
      <motion.img
        src="/assets/floral-right.png"
        alt=""
        className="hidden md:block absolute top-0 right-0 h-full w-auto"
        style={{ clipPath: clipStyle, opacity: 0.9 }}
      />
    </div>
  )
}
