'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Props { size?: number }

export default function FloralCorners({ size = 340 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // Subtle parallax: top-left drifts up, bottom-right drifts down
  const yTL = useTransform(scrollYProgress, [0, 1], [0, -40])
  const yBR = useTransform(scrollYProgress, [0, 1], [0, 40])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.img
        src="/assets/lily-tl.svg"
        alt=""
        className="absolute top-0 left-0"
        style={{ width: size, y: yTL }}
      />
      <motion.img
        src="/assets/lily-tl.svg"
        alt=""
        className="absolute bottom-0 right-0 rotate-180"
        style={{ width: size, y: yBR }}
      />
    </div>
  )
}
