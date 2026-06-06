/**
 * Fixed, gently-drifting sage + lily backdrop that sits behind the whole
 * page. Content scrolls over it; opaque photo breaks and cards punctuate it.
 * Honours prefers-reduced-motion via the global reduce rule.
 */
export default function FloralBackdrop({ size = 360 }: { size?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 0 }}>
      <div className="paper-wash" />
      <img
        src="/assets/lily-tl.svg"
        alt=""
        className="floral-drift-tl absolute top-0 left-0"
        style={{ width: size }}
      />
      <img
        src="/assets/lily-tl.svg"
        alt=""
        className="floral-drift-br absolute bottom-0 right-0"
        style={{ width: size }}
      />
    </div>
  )
}
