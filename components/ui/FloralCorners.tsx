interface Props { size?: number }

export default function FloralCorners({ size = 340 }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <img src="/assets/lily-tl.svg" alt="" className="absolute top-0 left-0" style={{ width: size }} />
      <img src="/assets/lily-tl.svg" alt="" className="absolute bottom-0 right-0 rotate-180" style={{ width: size }} />
    </div>
  )
}
