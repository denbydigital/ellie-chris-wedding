'use client'
import { motion, useScroll, useSpring, useTransform, useReducedMotion, MotionValue } from 'framer-motion'

/* Lily line-art, grouped by stroke weight (transcribed from lily-tl.svg). */
const STROKES_MAIN = [
  // main lily petals
  'M210 260 C195 230 172 210 148 195 C162 220 165 248 210 260Z',
  'M210 260 C225 230 248 210 272 195 C258 220 255 248 210 260Z',
  'M210 260 C180 250 158 235 142 215 C168 228 192 240 210 260Z',
  'M210 260 C240 250 262 235 278 215 C252 228 228 240 210 260Z',
  'M210 260 C195 240 188 215 192 188 C200 210 204 238 210 260Z',
  'M210 260 C225 240 232 215 228 188 C220 210 216 238 210 260Z',
  'M210 262 C208 290 204 320 200 355',
  // upper-left lily
  'M130 175 C110 148 82 132 54 122 C72 148 80 172 130 175Z',
  'M130 175 C148 148 172 132 198 122 C180 148 168 172 130 175Z',
  'M130 175 C102 168 80 152 66 130 C92 146 114 158 130 175Z',
  'M130 175 C158 168 180 152 194 130 C168 146 146 158 130 175Z',
  'M130 175 C118 156 112 132 116 106 C122 130 126 154 130 175Z',
  'M130 175 C142 156 148 132 144 106 C138 130 134 154 130 175Z',
  'M130 177 C148 200 175 228 200 258',
  // top bud
  'M72 95 C66 75 58 58 48 42 C56 60 62 78 72 95Z',
  'M72 95 C82 75 90 58 100 42 C90 60 82 78 72 95Z',
  'M72 95 C60 82 52 66 50 48 C62 66 68 82 72 95Z',
  'M72 95 C84 82 92 66 94 48 C82 66 76 82 72 95Z',
  'M72 98 C80 118 100 142 130 175',
  // tight bud
  'M28 58 C22 42 18 26 16 8 C24 24 28 42 28 58Z',
  'M28 58 C36 42 40 26 42 8 C34 24 30 42 28 58Z',
  'M28 60 C20 52 14 42 12 30 C22 42 26 52 28 60Z',
  'M28 60 C36 52 42 42 44 30 C34 42 30 52 28 60Z',
  'M28 60 C36 115 72 135 72 95',
  // leaves
  'M200 258 C186 248 168 244 148 246 C166 250 184 252 200 258Z',
  'M186 278 C172 264 152 258 130 258 C150 264 170 270 186 278Z',
  'M148 195 C136 178 118 170 96 170 C116 174 136 182 148 195Z',
  'M160 215 C144 202 124 196 102 196 C122 200 144 208 160 215Z',
  'M72 98 C56 88 36 86 14 90 C34 90 56 92 72 98Z',
  'M88 130 C72 118 52 114 30 116 C50 118 72 122 88 130Z',
  'M130 177 C112 164 90 158 66 160 C88 162 112 168 130 177Z',
  // hanging bud + leaf
  'M260 200 C272 180 282 158 286 134 C278 156 268 178 260 200Z',
  'M260 200 C248 180 238 158 234 134 C242 156 252 178 260 200Z',
  'M260 202 C274 190 284 174 288 156 C276 172 266 188 260 202Z',
  'M260 202 C246 190 236 174 232 156 C244 172 254 188 260 202Z',
  'M260 204 C248 240 232 268 210 260',
  'M260 204 C270 192 282 178 288 162 C276 176 266 190 260 204Z',
  'M268 220 C280 210 294 208 308 212 C294 214 280 216 268 220Z',
]

const STROKES_FINE = [
  'M210 258 C200 240 185 225 168 212',
  'M210 258 C220 240 235 225 252 212',
  'M210 258 C200 242 195 228 196 210',
  'M210 258 L196 230', 'M210 258 L218 228', 'M210 258 L208 224',
  'M210 258 L202 232', 'M210 258 L222 232',
  'M130 173 C118 156 100 142 80 132',
  'M130 173 C142 156 160 142 180 132',
  'M130 173 L116 145', 'M130 173 L136 142', 'M130 173 L144 146',
  'M72 97 C68 88 62 80 54 72',
  'M72 97 C76 88 82 80 90 72',
]

const DOTS: [number, number, number][] = [
  [170,195,1.5],[250,185,1.2],[90,110,1.3],[185,240,1],
  [196,228,2.2],[219,226,2.2],[208,222,2.2],[201,230,1.8],[223,230,1.8],
  [115,143,2],[136,140,2],[145,144,2],
]

const COLOR = 'rgba(241,242,235,0.5)'

function Lily({ progress, flip = false, still = false }: { progress: MotionValue<number>; flip?: boolean; still?: boolean }) {
  const dotOpacity = useTransform(progress, [0.55, 0.95], [0, 0.5])
  const lenProp = still ? { pathLength: 1 } : undefined
  const dotProp = still ? { opacity: 0.5 } : undefined
  return (
    <svg
      viewBox="0 0 420 520"
      fill="none"
      className="absolute"
      style={{
        width: 360,
        ...(flip
          ? { bottom: 0, right: 0, transform: 'rotate(180deg)' }
          : { top: 0, left: 0 }),
      }}
      aria-hidden
    >
      <g stroke={COLOR} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {STROKES_MAIN.map((d, i) => (
          <motion.path key={`m${i}`} d={d} strokeWidth={1.4} style={lenProp ?? { pathLength: progress }} />
        ))}
        {STROKES_FINE.map((d, i) => (
          <motion.path key={`f${i}`} d={d} strokeWidth={0.8} style={lenProp ?? { pathLength: progress }} />
        ))}
      </g>
      {DOTS.map(([cx, cy, r], i) => (
        <motion.circle key={`d${i}`} cx={cx} cy={cy} r={r} fill={COLOR} style={dotProp ?? { opacity: dotOpacity }} />
      ))}
    </svg>
  )
}

export default function FloralBackdrop() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // Smooth the scroll value so the strokes draw fluidly, not jerkily.
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 })

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 0 }}>
      <div className="paper-wash" />
      <Lily progress={progress} still={!!reduce} />
      <Lily progress={progress} flip still={!!reduce} />
    </div>
  )
}
