'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Guest } from '@/lib/types'

type Tab = 'dashboard' | 'guests' | 'invite' | 'songs' | 'export'

/* ── shared helpers ── */
function badge(status: string) {
  const map: Record<string, string> = {
    attending: 'bg-green-100 text-green-800',
    declined:  'bg-red-100 text-red-700',
    pending:   'bg-amber-100 text-amber-800',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-[var(--font-ui)] text-[11px] tracking-[0.1em] uppercase ${map[status] || ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'attending' ? 'bg-green-600' : status === 'declined' ? 'bg-red-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  )
}

const NAV: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'guests',    label: 'Guest List' },
  { id: 'invite',    label: 'Send Invites' },
  { id: 'songs',     label: 'Playlist' },
  { id: 'export',    label: 'Export' },
]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchGuests = useCallback(async () => {
    if (!authed) return
    setLoading(true)
    const r = await fetch('/api/admin/guests', { headers: { 'x-admin-password': pw } })
    if (r.ok) setGuests(await r.json())
    setLoading(false)
  }, [authed, pw])

  useEffect(() => { if (authed) fetchGuests() }, [authed, fetchGuests])

  async function download(type: string) {
    const r = await fetch(`/api/admin/export?type=${type}`, { headers: { 'x-admin-password': pw } })
    const blob = await r.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `ellie-chris-${type}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    showToast(`Downloaded ${type}.csv`)
  }

  // ── Login ──
  if (!authed) return (
    <div className="min-h-screen bg-sage-100 flex items-center justify-center px-6">
      <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-md p-10 w-full max-w-sm text-center">
        <div className="font-[var(--font-script)] text-[40px] text-gold-500 mb-1">E &amp; C</div>
        <h1 className="font-[var(--font-display)] font-medium text-[24px] text-fg1 mb-6">Host Dashboard</h1>
        <input
          type="password" placeholder="Admin password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setAuthed(true)}
          className="w-full font-[var(--font-ui)] text-[14px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-3 outline-none focus:border-gold-500 text-center mb-4"
        />
        <button onClick={() => setAuthed(true)}
          className="w-full bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[12px] tracking-[0.22em] uppercase py-3.5 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors">
          Enter
        </button>
      </div>
    </div>
  )

  const attending = guests.filter(g => g.status === 'attending')
  const declined  = guests.filter(g => g.status === 'declined')
  const pending   = guests.filter(g => g.status === 'pending')
  const totalGuests = attending.reduce((s, g) => s + g.party_size, 0)
  const meals = attending.flatMap(g => g.guests_json)
  const mealCounts = { Chicken: 0, Beef: 0, Vegetarian: 0, Vegan: 0, Child: 0 } as Record<string, number>
  meals.forEach(m => { if (mealCounts[m.meal] !== undefined) mealCounts[m.meal]++ })

  return (
    <div className="flex min-h-screen bg-sage-100">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-forest-800 flex flex-col sticky top-0 h-screen">
        <div className="px-6 py-7 border-b border-white/10">
          <div className="font-[var(--font-script)] text-[28px] text-gold-300">E &amp; C</div>
          <div className="font-[var(--font-ui)] text-[11px] tracking-[0.2em] uppercase text-[var(--on-sage-3)] mt-1">Host Dashboard</div>
        </div>
        <nav className="py-4 flex-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className={[
                'w-full flex items-center px-6 py-2.5 text-left font-[var(--font-ui)] text-[13px] border-l-2 transition-all cursor-pointer bg-transparent border-t-0 border-r-0 border-b-0',
                tab === n.id ? 'text-gold-300 border-gold-500 bg-gold-500/10' : 'text-[var(--on-sage-2)] border-transparent hover:text-[var(--on-sage-1)] hover:bg-white/5',
              ].join(' ')}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <a href="/" className="font-[var(--font-ui)] text-[12px] text-[var(--on-sage-3)] no-underline hover:text-[var(--on-sage-1)] transition-colors">
            ← View wedding site
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="bg-cream-bright border-b border-sage-200 h-16 px-9 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-[var(--font-display)] font-medium text-[24px] text-fg1 capitalize">{tab === 'dashboard' ? 'Dashboard' : tab === 'invite' ? 'Send Invites' : tab === 'songs' ? 'Playlist Requests' : tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
          <button onClick={() => download('guests')}
            className="flex items-center gap-2 bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors">
            Export CSV
          </button>
        </div>

        <div className="p-9">
          {loading && <p className="text-fg3 font-[var(--font-ui)] text-[13px]">Loading…</p>}

          {/* ─── DASHBOARD ─── */}
          {tab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Accepting', num: attending.length, sub: `${totalGuests} guests`, hi: true },
                  { label: 'Declined',  num: declined.length,  sub: 'invitations' },
                  { label: 'Pending',   num: pending.length,   sub: 'awaiting reply' },
                  { label: 'Total',     num: guests.length,    sub: 'invitations' },
                ].map(s => (
                  <div key={s.label} className={`bg-cream-bright border rounded-[8px] shadow-sm p-6 ${s.hi ? 'border-gold-300' : 'border-sage-200'}`}>
                    <p className="font-[var(--font-ui)] text-[11px] tracking-[0.2em] uppercase text-fg3 mb-2">{s.label}</p>
                    <p className={`font-[var(--font-display)] font-medium text-[44px] leading-none mb-1 ${s.hi ? 'text-gold-700' : 'text-fg1'}`}>{s.num}</p>
                    <p className="font-[var(--font-ui)] text-[12px] text-fg3">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm p-7 mb-6">
                <h2 className="font-[var(--font-display)] font-medium text-[20px] text-fg1 mb-5">Meal choices</h2>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(mealCounts).map(([m, n]) => (
                    <div key={m} className="border border-sage-200 rounded-[8px] p-4 text-center">
                      <div className="font-[var(--font-display)] font-medium text-[36px] text-fg1 leading-none mb-1">{n}</div>
                      <div className="font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-fg3">{m}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm overflow-hidden">
                <div className="px-7 py-5 border-b border-sage-200">
                  <h2 className="font-[var(--font-display)] font-medium text-[20px] text-fg1">Recent responses</h2>
                </div>
                <table className="w-full font-[var(--font-ui)] text-[13px] border-collapse">
                  <thead><tr className="bg-sage-100">{['Name','Status','Party','Responded'].map(h => <th key={h} className="text-left px-5 py-3 font-[var(--font-ui)] text-[11px] tracking-[0.18em] uppercase text-fg3 border-b border-sage-200">{h}</th>)}</tr></thead>
                  <tbody>
                    {guests.filter(g => g.responded_at).slice(0, 8).map(g => (
                      <tr key={g.id} className="border-b border-sage-200 hover:bg-sage-100 transition-colors">
                        <td className="px-5 py-3 font-medium text-fg1">{g.name}</td>
                        <td className="px-5 py-3">{badge(g.status)}</td>
                        <td className="px-5 py-3 text-fg3">{g.party_size > 0 ? g.party_size : '—'}</td>
                        <td className="px-5 py-3 text-fg3">{g.responded_at?.slice(0, 10) || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── GUESTS ─── */}
          {tab === 'guests' && (
            <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm overflow-hidden">
              <table className="w-full font-[var(--font-ui)] text-[13px] border-collapse">
                <thead><tr className="bg-sage-100">{['Name','Email','Status','Party','Song','Notes','Responded'].map(h => <th key={h} className="text-left px-5 py-3 font-[var(--font-ui)] text-[11px] tracking-[0.18em] uppercase text-fg3 border-b border-sage-200 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {guests.map(g => (
                    <tr key={g.id} className="border-b border-sage-200 hover:bg-sage-100 transition-colors">
                      <td className="px-5 py-3 font-medium text-fg1 whitespace-nowrap">{g.name}</td>
                      <td className="px-5 py-3 text-fg3">{g.email}</td>
                      <td className="px-5 py-3">{badge(g.status)}</td>
                      <td className="px-5 py-3 text-fg3">{g.party_size || '—'}</td>
                      <td className="px-5 py-3 text-fg3 max-w-[160px] truncate">{g.song || '—'}</td>
                      <td className="px-5 py-3 text-fg3 max-w-[180px] truncate">{g.notes || '—'}</td>
                      <td className="px-5 py-3 text-fg3 whitespace-nowrap">{g.responded_at?.slice(0,10) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── INVITE ─── */}
          {tab === 'invite' && <InviteTab pw={pw} guests={guests} onSent={showToast} />}

          {/* ─── SONGS ─── */}
          {tab === 'songs' && (
            <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm p-7">
              <h2 className="font-[var(--font-display)] font-medium text-[20px] text-fg1 mb-5">Song requests</h2>
              {guests.filter(g => g.song).length === 0
                ? <p className="font-[var(--font-body)] italic text-fg3 text-[16px]">No requests yet.</p>
                : <ul className="list-none flex flex-col gap-2">
                    {guests.filter(g => g.song).map(g => (
                      <li key={g.id} className="flex justify-between items-baseline bg-sage-100 px-4 py-2.5 rounded-[4px]">
                        <span className="font-[var(--font-body)] text-[16px] text-fg1">{g.song}</span>
                        <span className="font-[var(--font-ui)] text-[11px] text-fg3">from {g.name}</span>
                      </li>
                    ))}
                  </ul>
              }
            </div>
          )}

          {/* ─── EXPORT ─── */}
          {tab === 'export' && (
            <div className="max-w-[580px]">
              <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm p-8 flex flex-col gap-4">
                {[
                  { type: 'guests',  label: 'Full guest list',  sub: 'Name, email, status, party, meals, notes' },
                  { type: 'meals',   label: 'Meal breakdown',   sub: 'Totals per menu choice for the caterer' },
                  { type: 'songs',   label: 'Playlist requests',sub: 'All song requests with guest name' },
                  { type: 'pending', label: 'Pending guests',   sub: 'Everyone who hasn\'t replied yet' },
                ].map(e => (
                  <div key={e.type} className="flex items-center justify-between py-4 px-5 bg-sage-100 rounded-[8px]">
                    <div>
                      <div className="font-[var(--font-ui)] text-[13px] font-medium text-fg1 mb-0.5">{e.label}</div>
                      <div className="font-[var(--font-ui)] text-[12px] text-fg3">{e.sub}</div>
                    </div>
                    <button onClick={() => download(e.type)}
                      className="bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[11px] tracking-[0.18em] uppercase px-4 py-2 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors whitespace-nowrap">
                      Download CSV
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-7 right-7 bg-forest-800 text-[var(--on-sage-1)] px-5 py-3.5 rounded-[8px] font-[var(--font-ui)] text-[13px] shadow-lg animate-fade-in z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

/* ─── Invite tab sub-component ─── */
function InviteTab({ pw, guests, onSent }: { pw: string; guests: Guest[]; onSent: (m: string) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)

  async function send() {
    if (!name || !email) return
    setSending(true)
    const r = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify({ name, email, personalNote: note }),
    })
    setSending(false)
    if (r.ok) { onSent(`Invite sent to ${name}`); setName(''); setEmail(''); setNote('') }
    else onSent('Failed to send — check Resend API key.')
  }

  const pending = guests.filter(g => g.status === 'pending')

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm p-7 flex flex-col gap-4">
        <h2 className="font-[var(--font-display)] font-medium text-[20px] text-fg1 m-0">Compose invite</h2>
        {[
          { label: 'To (name)', val: name, set: setName, type: 'text', ph: 'e.g. The Smith Family' },
          { label: 'Email address', val: email, set: setEmail, type: 'email', ph: 'guest@example.com' },
        ].map(f => (
          <label key={f.label} className="block">
            <span className="block font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-fg3 mb-1.5">{f.label}</span>
            <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
              className="w-full font-[var(--font-ui)] text-[14px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-2.5 outline-none focus:border-gold-500 transition-colors" />
          </label>
        ))}
        <label className="block">
          <span className="block font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-fg3 mb-1.5">Personal note (optional)</span>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Can't wait to see you!"
            className="w-full font-[var(--font-ui)] text-[14px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-2.5 outline-none focus:border-gold-500 transition-colors resize-y" />
        </label>
        <button onClick={send} disabled={sending || !name || !email}
          className="bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase px-6 py-3 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {sending ? 'Sending…' : 'Send invite'}
        </button>
      </div>

      <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm p-7">
        <h2 className="font-[var(--font-display)] font-medium text-[20px] text-fg1 mb-4">Pending ({pending.length})</h2>
        {pending.length === 0
          ? <p className="font-[var(--font-body)] italic text-fg3 text-[15px]">Everyone has replied!</p>
          : <ul className="list-none flex flex-col gap-2">
              {pending.map(g => (
                <li key={g.id} className="flex justify-between items-center bg-sage-100 px-4 py-2.5 rounded-[4px]">
                  <div>
                    <div className="font-[var(--font-ui)] text-[13px] font-medium text-fg1">{g.name}</div>
                    <div className="font-[var(--font-ui)] text-[12px] text-fg3">{g.email}</div>
                  </div>
                  <button
                    onClick={() => { setName(g.name); setEmail(g.email) }}
                    className="font-[var(--font-ui)] text-[11px] tracking-[0.14em] uppercase text-gold-700 bg-none border-none cursor-pointer hover:text-gold-500 transition-colors">
                    Use
                  </button>
                </li>
              ))}
            </ul>
        }
      </div>
    </div>
  )
}
