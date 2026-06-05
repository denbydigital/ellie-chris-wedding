'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import FloralCorners from '@/components/ui/FloralCorners'
import GoldDivider from '@/components/ui/GoldDivider'
import Button from '@/components/ui/Button'

export default function PasswordGate() {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function attempt() {
    const correct = process.env.NEXT_PUBLIC_SITE_PASSWORD || 'hobbithill2027'
    if (value.trim().toLowerCase().replace(/\s+/g, '') === correct) {
      sessionStorage.setItem('ec-pw', '1')
      router.push('/gate')
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 400)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="relative min-h-screen bg-sage-500 flex items-center justify-center px-6 py-14 overflow-hidden">
      <div className="paper-wash" />
      <FloralCorners size={340} />

      <div className="relative z-10 w-full max-w-md text-center animate-fade-in">
        <div className="invitation-frame">
          <p className="font-[var(--font-ui)] text-[13px] tracking-[0.34em] uppercase text-gold-300 mb-3.5">
            You&apos;re invited
          </p>
          <p className="font-[var(--font-script)] text-[28px] leading-none text-gold-300 mb-3">
            the wedding of
          </p>
          <h1 className="font-[var(--font-display)] font-medium leading-[1.02] text-[var(--on-sage-1)] tracking-[0.01em] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 8vw, 3.6rem)' }}>
            Ellie <span className="font-[var(--font-script)] text-gold-300" style={{ fontSize: '0.78em' }}>&amp;</span> Chris
          </h1>

          <GoldDivider label="Saturday the 10th July, 2027" width={64} />

          <p className="font-[var(--font-body)] text-[16px] leading-[1.6] text-[var(--on-sage-2)] mt-7 mb-6">
            Enter your invitation password to continue.
          </p>

          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Password"
            className={[
              'w-full font-[var(--font-body)] text-[18px] text-fg1 text-center',
              'bg-cream-bright border rounded-[4px] px-4 py-3.5 outline-none',
              'tracking-[0.12em] transition-colors duration-300 mb-3.5',
              error ? 'border-red-400' : 'border-sage-200 focus:border-gold-500',
              shake ? 'animate-shake' : '',
            ].join(' ')}
          />

          {error && (
            <p className="font-[var(--font-ui)] text-[12px] tracking-[0.1em] text-red-300 mb-3 -mt-1">
              Incorrect password. Please try again.
            </p>
          )}

          <Button variant="gold" full onClick={attempt}>Enter</Button>
        </div>
      </div>
    </div>
  )
}
