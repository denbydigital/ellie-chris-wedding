'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import type { GuestPerson, RSVPFormData } from '@/lib/types'

const MEALS = ['Chicken', 'Beef', 'Vegetarian', 'Vegan', 'Child'] as const

interface Prefill {
  name: string
  email: string
  maxGuests?: number
  existingGuests?: GuestPerson[]
  existingSong?: string
  existingNotes?: string
  existingStatus?: 'pending' | 'attending' | 'declined'
}

export default function RSVPForm({ prefill }: { prefill?: Prefill }) {
  const router = useRouter()

  const defaultAttending = prefill?.existingStatus === 'declined' ? 'no' : 'yes'
  const defaultGuests = prefill?.existingGuests?.length
    ? prefill.existingGuests
    : [{ name: prefill?.name ?? '', meal: 'Chicken' as const }]

  const [attending, setAttending] = useState<'yes' | 'no'>(defaultAttending)
  const [name, setName] = useState(prefill?.name ?? '')
  const [email, setEmail] = useState(prefill?.email ?? '')
  const [guests, setGuests] = useState<GuestPerson[]>(defaultGuests)
  const [song, setSong] = useState(prefill?.existingSong ?? '')
  const [notes, setNotes] = useState(prefill?.existingNotes ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const maxGuests = prefill?.maxGuests ?? 8

  function updateGuest(i: number, field: keyof GuestPerson, val: string) {
    setGuests(g => g.map((x, idx) => idx === i ? { ...x, [field]: val } : x))
  }
  function addGuest() {
    if (guests.length < maxGuests) setGuests(g => [...g, { name: '', meal: 'Chicken' }])
  }
  function removeGuest(i: number) {
    if (guests.length > 1) setGuests(g => g.filter((_, idx) => idx !== i))
  }

  async function submit() {
    if (!name.trim() || !email.trim()) { setError('Please fill in your name and email.'); return }
    setLoading(true); setError('')
    const body: RSVPFormData = {
      attending, name, email,
      guests: attending === 'yes' ? guests : [],
      song, notes,
    }
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      if (attending === 'yes') router.push('/home')
      else router.push('/gate?declined=1')
    } else {
      const d = await res.json().catch(() => ({}))
      if (res.status === 409 || d.error === 'alreadyResponded') {
        // RSVP is final — send them where their existing reply belongs.
        if (d.status === 'attending') router.push('/home')
        else router.push('/gate?declined=1')
        return
      }
      setError(d.error || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-md p-8 max-w-[600px] mx-auto mt-6 text-left">

      {/* Attending toggle */}
      <div className="flex border border-sage-200 rounded-[4px] overflow-hidden mb-6">
        {(['yes', 'no'] as const).map((v, i) => (
          <button
            key={v}
            onClick={() => setAttending(v)}
            className={[
              'flex-1 py-3.5 px-3 font-[var(--font-ui)] text-[12px] tracking-[0.16em] uppercase transition-all duration-300 border-none cursor-pointer',
              attending === v ? 'bg-sage-500 text-[var(--on-sage-1)]' : 'bg-transparent text-fg2 hover:bg-sage-100',
            ].join(' ')}
          >
            {i === 0 ? 'Joyfully accepts' : 'Regretfully declines'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Lead guest / contact"
          placeholder="As it appears on your invitation"
          value={name}
          onChange={e => setName(e.target.value)}
          readOnly={!!prefill?.name}
          className={prefill?.name ? 'opacity-70 cursor-default' : ''}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          readOnly={!!prefill?.email}
          className={prefill?.email ? 'opacity-70 cursor-default' : ''}
        />

        {attending === 'yes' && (
          <>
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-[var(--font-ui)] text-[12px] tracking-[0.16em] uppercase text-fg3">
                  Who&apos;s coming?
                </span>
                <span className="font-[var(--font-body)] italic text-[14px] text-fg3">
                  {guests.length} {guests.length === 1 ? 'guest' : 'guests'}
                  {maxGuests < 8 && ` (max ${maxGuests})`}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {guests.map((g, i) => (
                  <div key={i} className="grid gap-2.5 items-center" style={{ gridTemplateColumns: '1fr 150px 34px' }}>
                    <input
                      placeholder={i === 0 ? 'Guest name' : `Guest ${i + 1} name`}
                      value={g.name}
                      onChange={e => updateGuest(i, 'name', e.target.value)}
                      className="w-full font-[var(--font-body)] text-[15px] text-fg1 bg-cream-bright border border-sage-200 rounded-[4px] px-3 py-2.5 outline-none focus:border-gold-500 transition-colors"
                    />
                    <select
                      value={g.meal}
                      onChange={e => updateGuest(i, 'meal', e.target.value)}
                      className="w-full font-[var(--font-body)] text-[15px] text-fg1 bg-cream-bright border border-sage-200 rounded-[4px] px-3 py-2.5 outline-none focus:border-gold-500 transition-colors"
                    >
                      {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <button
                      onClick={() => removeGuest(i)}
                      disabled={guests.length <= 1}
                      className="w-[34px] h-[34px] rounded-[4px] border border-sage-200 bg-transparent text-fg3 text-[18px] flex items-center justify-center cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed hover:border-sage-400"
                    >&times;</button>
                  </div>
                ))}
              </div>
              {guests.length < maxGuests && (
                <button
                  onClick={addGuest}
                  className="mt-3 bg-none border-none cursor-pointer font-[var(--font-ui)] text-[12px] tracking-[0.16em] uppercase text-gold-700 flex items-center gap-1.5 hover:text-gold-500 transition-colors"
                >
                  <span className="text-[16px]">+</span> Add a guest
                </button>
              )}
            </div>

            <Input
              label="A song to get you dancing"
              placeholder="Artist — Title"
              value={song}
              onChange={e => setSong(e.target.value)}
            />
          </>
        )}

        <Textarea
          label={attending === 'yes' ? 'Dietary needs or a note for us' : 'Leave us a note'}
          rows={3}
          placeholder="Allergies, access needs, or just a hello…"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        {error && <p className="font-[var(--font-ui)] text-[12px] text-red-600">{error}</p>}

        <Button variant="gold" full onClick={submit} disabled={loading}>
          {loading ? 'Sending…' : attending === 'yes' ? 'Accept with joy' : 'Send our regrets'}
        </Button>
      </div>
    </div>
  )
}
