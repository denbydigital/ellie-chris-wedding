'use client'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Botanical line-art down the left & right edges (from the couple's
 * reference). Fixed behind the content and fully visible — they gently
 * fade in over the first stretch of scroll, then stay. Hidden on small
 * screens so they never crowd the text.
 */
export default function FloralBackdrop() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const fade = useTransform(scrollYProgress, [0, 0.08], [0, 1])
  const opacity = reduce ? 1 : fade

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
      <div className="paper-wash" />
      <motion.img
        src="/assets/floral-left.png"
        alt=""
        className="hidden md:block absolute top-0 left-0 h-full w-auto object-cover object-left"
        style={{ opacity }}
      />
      <motion.img
        src="/assets/floral-right.png"
        alt=""
        className="hidden md:block absolute top-0 right-0 h-full w-auto object-cover object-right"
        style={{ opacity }}
      />
    </div>
  )
}
