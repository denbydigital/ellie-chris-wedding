'use client'
import { useState, useCallback } from 'react'
import type { Guest, GuestPerson } from '@/lib/types'

function inviteUrl(token: string) {
  // Always use the current origin (the live Vercel URL or custom domain),
  // so links never point at a stale hardcoded host.
  const base = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || '')
  return `${base}/gate?invite=${token}`
}

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
  { id: 'invite',    label: 'Invite Links' },
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
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [guestSearch, setGuestSearch] = useState('')
  const [guestFilter, setGuestFilter] = useState<'all'|'attending'|'pending'|'declined'>('all')
  const [showAddGuest, setShowAddGuest] = useState(false)
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [addForm, setAddForm] = useState({ name: '', email: '', maxGuests: '2' })
  const [csvText, setCsvText] = useState('')
  const [csvPreview, setCsvPreview] = useState<{name:string;email:string;maxGuests:number}[]>([])

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), msg.startsWith('Error') ? 8000 : 3000) }

  const fetchGuests = useCallback(async () => {
    setLoading(true)
    const r = await fetch('/api/admin/guests', { headers: { 'x-admin-password': pw } })
    if (r.ok) setGuests(await r.json())
    setLoading(false)
  }, [pw])

  async function tryLogin() {
    if (!pw) { setLoginError('Please enter the password.'); return }
    setLoggingIn(true); setLoginError('')
    try {
      const r = await fetch('/api/admin/guests', { headers: { 'x-admin-password': pw } })
      if (r.ok) {
        setGuests(await r.json()) // reuse the verification response, no second fetch
        setAuthed(true)
      } else if (r.status === 401) {
        setLoginError('Incorrect password.')
      } else {
        setLoginError('Server error — is ADMIN_PASSWORD set in Vercel?')
      }
    } catch {
      setLoginError('Could not reach the server. Please try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  async function addGuest() {
    if (!addForm.name.trim() || !addForm.email.trim()) { showToast('Name and email required.'); return }
    const r = await fetch('/api/admin/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify({ name: addForm.name.trim(), email: addForm.email.trim().toLowerCase(), max_guests: parseInt(addForm.maxGuests) || 2, status: 'pending' }),
    })
    if (r.ok) {
      showToast(`${addForm.name} added!`)
      setAddForm({ name: '', email: '', maxGuests: '2' })
      setShowAddGuest(false)
      fetchGuests()
    } else {
      const d = await r.json().catch(() => ({}))
      showToast(d.error ? `Error: ${d.error}` : 'Error adding guest.')
    }
  }

  function parseCsv(text: string) {
    const lines = text.trim().split('\n').filter(Boolean)
    // Skip header row if it looks like one
    const start = lines[0]?.toLowerCase().includes('name') ? 1 : 0
    const rows = lines.slice(start).map(l => {
      const cols = l.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''))
      return { name: cols[0] || '', email: cols[1] || '', maxGuests: parseInt(cols[2]) || 2 }
    }).filter(r => r.name && r.email)
    setCsvPreview(rows)
  }

  async function importCsv() {
    let ok = 0, fail = 0
    for (const row of csvPreview) {
      const r = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({ name: row.name, email: row.email.toLowerCase(), max_guests: row.maxGuests, status: 'pending' }),
      })
      if (r.ok) ok++; else fail++
    }
    showToast(`Imported ${ok} guests${fail ? ` (${fail} failed — duplicate emails?)` : ''}.`)
    setCsvText(''); setCsvPreview([]); setShowCsvImport(false)
    fetchGuests()
  }

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
          onChange={e => { setPw(e.target.value); setLoginError('') }}
          onKeyDown={e => e.key === 'Enter' && tryLogin()}
          autoFocus
          className="w-full font-[var(--font-ui)] text-[14px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-3 outline-none focus:border-gold-500 text-center mb-3"
        />
        {loginError && (
          <p className="font-[var(--font-ui)] text-[12px] text-red-600 mb-3">{loginError}</p>
        )}
        <button onClick={tryLogin} disabled={loggingIn}
          className="w-full bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[12px] tracking-[0.22em] uppercase py-3.5 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors disabled:opacity-50">
          {loggingIn ? 'Checking…' : 'Enter'}
        </button>
      </div>
    </div>
  )

  const attending = guests.filter(g => g.status === 'attending')
  const declined  = guests.filter(g => g.status === 'declined')
  const pending   = guests.filter(g => g.status === 'pending')
  // Headcount derives from the named guests (same source as meals) so the
  // two figures can never disagree; fall back to party_size if ever empty.
  const headcount = (g: Guest) => (g.guests_json?.length || g.party_size || 0)
  const totalGuests = attending.reduce((s, g) => s + headcount(g), 0)
  const declinedGuests = declined.reduce((s, g) => s + (g.max_guests ?? 1), 0)
  const maxHeadcount = guests.reduce((s, g) => s + (g.max_guests ?? 1), 0)
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
          <a href="/" target="_blank" rel="noopener noreferrer" className="font-[var(--font-ui)] text-[12px] text-[var(--on-sage-3)] no-underline hover:text-[var(--on-sage-1)] transition-colors">
            ↗ View wedding site
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="bg-cream-bright border-b border-sage-200 h-16 px-9 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-[var(--font-display)] font-medium text-[24px] text-fg1 capitalize">{tab === 'dashboard' ? 'Dashboard' : tab === 'invite' ? 'Invite Links' : tab === 'songs' ? 'Playlist Requests' : tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
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
                  { label: 'Guests attending', num: totalGuests, sub: `${attending.length} of ${guests.length} ${guests.length === 1 ? 'invite' : 'invites'} accepted`, hi: true },
                  { label: 'Declined',  num: declined.length,  sub: `${declinedGuests} ${declinedGuests === 1 ? 'guest' : 'guests'}` },
                  { label: 'Awaiting reply', num: pending.length, sub: 'no reply yet' },
                  { label: 'Total invited', num: guests.length, sub: `${maxHeadcount} guests max` },
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
            <div>
              {/* Toolbar */}
              <div className="flex gap-3 mb-4 flex-wrap items-center">
                <input
                  className="flex-1 min-w-[200px] font-[var(--font-ui)] text-[13px] text-fg1 bg-cream-bright border border-sage-200 rounded-[4px] px-4 py-2.5 outline-none focus:border-gold-500 transition-colors"
                  placeholder="Search by name or email…"
                  value={guestSearch}
                  onChange={e => setGuestSearch(e.target.value)}
                />
                <div className="flex gap-2">
                  {(['all','attending','pending','declined'] as const).map(s => (
                    <button key={s} onClick={() => setGuestFilter(s)}
                      className={[
                        'font-[var(--font-ui)] text-[11px] tracking-[0.14em] uppercase px-3 py-2 rounded-[4px] border transition-colors cursor-pointer',
                        guestFilter === s
                          ? 'bg-forest-800 text-cream border-forest-800'
                          : 'bg-transparent text-fg2 border-sage-200 hover:bg-sage-100',
                      ].join(' ')}>
                      {s}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAddGuest(true)}
                  className="bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[12px] tracking-[0.16em] uppercase px-5 py-2.5 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors whitespace-nowrap flex items-center gap-2">
                  <span className="text-[16px] leading-none">+</span> Add guest
                </button>
                <button onClick={() => setShowCsvImport(true)}
                  className="bg-transparent text-fg1 font-[var(--font-ui)] text-[12px] tracking-[0.16em] uppercase px-5 py-2.5 rounded-[4px] border border-sage-300 cursor-pointer hover:bg-sage-100 transition-colors whitespace-nowrap flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Import CSV
                </button>
              </div>

              {/* Table */}
              <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm overflow-hidden">
                <table className="w-full font-[var(--font-ui)] text-[13px] border-collapse">
                  <thead><tr className="bg-sage-100">{['Name','Email','Status','Coming','Responded','Invite link',''].map(h => <th key={h} className="text-left px-5 py-3 font-[var(--font-ui)] text-[11px] tracking-[0.18em] uppercase text-fg3 border-b border-sage-200 whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody>
                    {guests
                      .filter(g => guestFilter === 'all' || g.status === guestFilter)
                      .filter(g => {
                        if (!guestSearch) return true
                        const q = guestSearch.toLowerCase()
                        return g.name.toLowerCase().includes(q)
                          || g.email.toLowerCase().includes(q)
                          || (g.guests_json ?? []).some(p => p.name?.toLowerCase().includes(q))
                      })
                      .map(g => (
                      <tr key={g.id} className="border-b border-sage-200 hover:bg-sage-100 transition-colors align-top">
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="font-medium text-fg1">{g.name}</div>
                          {g.status === 'attending' && g.guests_json?.length > 0 && (
                            <ul className="mt-1.5 flex flex-col gap-0.5">
                              {g.guests_json.map((p, i) => (
                                <li key={i} className="font-[var(--font-ui)] text-[12px] text-fg3 flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
                                  {p.name?.trim() || `Guest ${i + 1}`}
                                  {p.meal && <span className="text-sage-500">· {p.meal}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="px-5 py-3 text-fg3">{g.email}</td>
                        <td className="px-5 py-3">{badge(g.status)}</td>
                        <td className="px-5 py-3 text-fg2 text-center">{g.status === 'attending' ? (g.guests_json?.length || g.party_size) : '—'}</td>
                        <td className="px-5 py-3 text-fg3 whitespace-nowrap">{g.responded_at?.slice(0,10) || '—'}</td>
                        <td className="px-5 py-3">
                          {g.invite_token ? (
                            <button
                              onClick={() => {
                                const token = g.invite_token!
                                navigator.clipboard.writeText(inviteUrl(token))
                                showToast(`Link copied for ${g.name}`)
                              }}
                              className="flex items-center gap-1.5 font-[var(--font-ui)] text-[11px] tracking-[0.12em] uppercase text-gold-700 hover:text-gold-500 transition-colors bg-none border-none cursor-pointer"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                              Copy link
                            </button>
                          ) : <span className="text-fg3">—</span>}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setEditing(g)}
                            className="font-[var(--font-ui)] text-[11px] tracking-[0.12em] uppercase text-sage-700 hover:text-fg1 transition-colors bg-none border-none cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {guests.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-10 text-center font-[var(--font-body)] italic text-fg3">No guests yet. Add one above or import a CSV.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── INVITE ─── */}
          {tab === 'invite' && <InviteTab guests={guests} onSent={showToast} />}

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

      {/* ── ADD GUEST MODAL ── */}
      {showAddGuest && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setShowAddGuest(false)}>
          <div className="bg-cream-bright rounded-[8px] p-8 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-[var(--font-display)] font-medium text-[24px] text-fg1 mb-6">Add a guest</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Name', key: 'name', ph: 'e.g. The Harrison Family' },
                { label: 'Email', key: 'email', ph: 'guest@example.com' },
              ].map(f => (
                <label key={f.key} className="block">
                  <span className="block font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-fg3 mb-1.5">{f.label}</span>
                  <input
                    type={f.key === 'email' ? 'email' : 'text'}
                    placeholder={f.ph}
                    value={addForm[f.key as keyof typeof addForm]}
                    onChange={e => setAddForm(a => ({ ...a, [f.key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addGuest()}
                    className="w-full font-[var(--font-ui)] text-[14px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-2.5 outline-none focus:border-gold-500 transition-colors"
                  />
                </label>
              ))}
              <label className="block">
                <span className="block font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-fg3 mb-1.5">
                  Max guests in party
                </span>
                <select
                  value={addForm.maxGuests}
                  onChange={e => setAddForm(a => ({ ...a, maxGuests: e.target.value }))}
                  className="w-full font-[var(--font-ui)] text-[14px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-2.5 outline-none focus:border-gold-500 transition-colors"
                >
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <div className="flex gap-3 mt-2">
                <button onClick={addGuest}
                  className="flex-1 bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase py-3 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors">
                  Add guest
                </button>
                <button onClick={() => setShowAddGuest(false)}
                  className="flex-1 bg-transparent text-fg2 font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase py-3 rounded-[4px] border border-sage-200 cursor-pointer hover:bg-sage-100 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CSV IMPORT MODAL ── */}
      {showCsvImport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setShowCsvImport(false)}>
          <div className="bg-cream-bright rounded-[8px] p-8 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-[var(--font-display)] font-medium text-[24px] text-fg1 mb-2">Import from CSV</h2>
            <p className="font-[var(--font-body)] text-[15px] text-fg3 mb-5 italic">
              Paste your spreadsheet data below. Three columns: Name, Email, Max guests (optional).
            </p>
            <div className="bg-sage-100 rounded-[4px] px-4 py-3 mb-4 font-mono text-[12px] text-fg3">
              The Harrison Family, harrisonf@email.com, 4<br/>
              Rebecca &amp; Tom Walsh, becca@email.com, 2<br/>
              Grandma Edith, edith@email.com, 1
            </div>
            <textarea
              rows={6}
              placeholder="Paste your guest list here…"
              value={csvText}
              onChange={e => { setCsvText(e.target.value); parseCsv(e.target.value) }}
              className="w-full font-mono text-[13px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-3 outline-none focus:border-gold-500 transition-colors resize-none mb-4"
            />
            {csvPreview.length > 0 && (
              <div className="mb-4">
                <p className="font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-fg3 mb-2">
                  Preview — {csvPreview.length} guest{csvPreview.length !== 1 ? 's' : ''} ready to import
                </p>
                <div className="max-h-40 overflow-y-auto border border-sage-200 rounded-[4px]">
                  {csvPreview.map((r, i) => (
                    <div key={i} className="flex justify-between px-4 py-2 border-b border-sage-200 last:border-0 text-[13px]">
                      <span className="font-medium text-fg1">{r.name}</span>
                      <span className="text-fg3">{r.email}</span>
                      <span className="text-fg3">{r.maxGuests} guest{r.maxGuests !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={importCsv} disabled={csvPreview.length === 0}
                className="flex-1 bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase py-3 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Import {csvPreview.length > 0 ? `${csvPreview.length} guests` : ''}
              </button>
              <button onClick={() => { setShowCsvImport(false); setCsvText(''); setCsvPreview([]) }}
                className="flex-1 bg-transparent text-fg2 font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase py-3 rounded-[4px] border border-sage-200 cursor-pointer hover:bg-sage-100 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT GUEST MODAL ── */}
      {editing && (
        <EditGuestModal
          guest={editing}
          pw={pw}
          onClose={() => setEditing(null)}
          onSaved={(msg) => { setEditing(null); fetchGuests(); showToast(msg) }}
        />
      )}

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
function InviteTab({ guests, onSent }: { guests: Guest[]; onSent: (m: string) => void }) {
  const [search, setSearch] = useState('')

  const withLinks = guests.filter(g => g.invite_token)
  const filtered = withLinks.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.email.toLowerCase().includes(search.toLowerCase())
  )

  function copy(token: string, name: string) {
    navigator.clipboard.writeText(inviteUrl(token))
    onSent(`Link copied for ${name}`)
  }

  return (
    <div>
      <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm p-6 mb-5">
        <h2 className="font-[var(--font-display)] font-medium text-[20px] text-fg1 mb-2">Personalised invite links</h2>
        <p className="font-[var(--font-body)] text-[15px] leading-[1.6] text-fg2">
          Each guest has a unique link that greets them by name and pre-fills their RSVP.
          Copy a guest&apos;s link and send it however you like — WhatsApp, text, or your own email.
          The link is private to that guest, so please don&apos;t post it publicly.
        </p>
      </div>

      <input
        className="w-full max-w-[360px] font-[var(--font-ui)] text-[13px] text-fg1 bg-cream-bright border border-sage-200 rounded-[4px] px-4 py-2.5 outline-none focus:border-gold-500 transition-colors mb-4"
        placeholder="Search by name or email…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="bg-cream-bright border border-sage-200 rounded-[8px] shadow-sm overflow-hidden">
        <table className="w-full font-[var(--font-ui)] text-[13px] border-collapse">
          <thead><tr className="bg-sage-100">{['Name','Email','Status','Sent','Invite link'].map(h => <th key={h} className="text-left px-5 py-3 font-[var(--font-ui)] text-[11px] tracking-[0.18em] uppercase text-fg3 border-b border-sage-200 whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(g => (
              <tr key={g.id} className="border-b border-sage-200 hover:bg-sage-100 transition-colors">
                <td className="px-5 py-3 font-medium text-fg1 whitespace-nowrap">{g.name}</td>
                <td className="px-5 py-3 text-fg3">{g.email}</td>
                <td className="px-5 py-3">{badge(g.status)}</td>
                <td className="px-5 py-3 text-fg3 whitespace-nowrap">{g.invite_sent_at ? g.invite_sent_at.slice(0,10) : '—'}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => copy(g.invite_token!, g.name)}
                    className="flex items-center gap-1.5 font-[var(--font-ui)] text-[11px] tracking-[0.12em] uppercase text-gold-700 hover:text-gold-500 transition-colors bg-none border-none cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy link
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center font-[var(--font-body)] italic text-fg3">
                {withLinks.length === 0 ? 'No guests yet — add some in the Guest List tab.' : 'No matches.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Edit a guest's RSVP (admin override) ── */
const MEAL_OPTIONS = ['Chicken', 'Beef', 'Vegetarian', 'Vegan', 'Child'] as const

function EditGuestModal({ guest, pw, onClose, onSaved }: {
  guest: Guest
  pw: string
  onClose: () => void
  onSaved: (msg: string) => void
}) {
  const [name, setName] = useState(guest.name)
  const [email, setEmail] = useState(guest.email)
  const [status, setStatus] = useState<'pending' | 'attending' | 'declined'>(guest.status)
  const [maxGuests, setMaxGuests] = useState(String(guest.max_guests ?? 2))
  const [people, setPeople] = useState<GuestPerson[]>(
    guest.guests_json?.length ? guest.guests_json : [{ name: guest.name, meal: 'Chicken' }]
  )
  const [song, setSong] = useState(guest.song || '')
  const [notes, setNotes] = useState(guest.notes || '')
  const [saving, setSaving] = useState(false)

  function setPerson(i: number, field: keyof GuestPerson, v: string) {
    setPeople(p => p.map((x, idx) => idx === i ? { ...x, [field]: v } : x))
  }
  function addPerson() { setPeople(p => [...p, { name: '', meal: 'Chicken' }]) }
  function removePerson(i: number) { setPeople(p => p.length > 1 ? p.filter((_, idx) => idx !== i) : p) }

  async function save() {
    if (!name.trim() || !email.trim()) { onSaved('Error: name and email required.'); return }
    setSaving(true)
    const cleanPeople = status === 'attending'
      ? people.filter(p => p.name.trim()).map(p => ({ name: p.name.trim(), meal: p.meal }))
      : []
    const updates = {
      id: guest.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status,
      max_guests: parseInt(maxGuests) || 2,
      party_size: cleanPeople.length,
      guests_json: cleanPeople,
      song: song.trim(),
      notes: notes.trim(),
      // mark as responded if the host moves them off pending
      responded_at: status === 'pending' ? null : (guest.responded_at || new Date().toISOString()),
    }
    const r = await fetch('/api/admin/guests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify(updates),
    })
    setSaving(false)
    if (r.ok) onSaved(`${name.trim()} updated`)
    else {
      const d = await r.json().catch(() => ({}))
      onSaved(`Error: ${d.error || 'could not save.'}`)
    }
  }

  const label = 'block font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-fg3 mb-1.5'
  const input = 'w-full font-[var(--font-ui)] text-[14px] text-fg1 bg-cream border border-sage-200 rounded-[4px] px-4 py-2.5 outline-none focus:border-gold-500 transition-colors'

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-cream-bright rounded-[8px] p-8 w-full max-w-lg shadow-xl my-8" onClick={e => e.stopPropagation()}>
        <h2 className="font-[var(--font-display)] font-medium text-[24px] text-fg1 mb-1">Edit guest</h2>
        <p className="font-[var(--font-body)] text-[14px] italic text-fg3 mb-6">Use this when a guest needs to change their reply after responding.</p>

        <div className="flex flex-col gap-4">
          <label className="block"><span className={label}>Invitation name</span>
            <input className={input} value={name} onChange={e => setName(e.target.value)} /></label>
          <label className="block"><span className={label}>Email</span>
            <input className={input} type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block"><span className={label}>Status</span>
              <select className={input} value={status} onChange={e => setStatus(e.target.value as typeof status)}>
                <option value="pending">Pending</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select></label>
            <label className="block"><span className={label}>Max party size</span>
              <select className={input} value={maxGuests} onChange={e => setMaxGuests(e.target.value)}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
              </select></label>
          </div>

          {status === 'attending' && (
            <div>
              <span className={label}>Guests coming (name &amp; meal)</span>
              <div className="flex flex-col gap-2">
                {people.map((p, i) => (
                  <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: '1fr 130px 32px' }}>
                    <input className={input} placeholder={`Guest ${i + 1}`} value={p.name} onChange={e => setPerson(i, 'name', e.target.value)} />
                    <select className={input} value={p.meal} onChange={e => setPerson(i, 'meal', e.target.value)}>
                      {MEAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <button onClick={() => removePerson(i)} disabled={people.length <= 1}
                      className="w-8 h-8 rounded-[4px] border border-sage-200 bg-transparent text-fg3 text-[16px] flex items-center justify-center cursor-pointer disabled:opacity-35 hover:border-sage-400">&times;</button>
                  </div>
                ))}
              </div>
              <button onClick={addPerson}
                className="mt-2 bg-none border-none cursor-pointer font-[var(--font-ui)] text-[11px] tracking-[0.16em] uppercase text-gold-700 flex items-center gap-1.5 hover:text-gold-500 transition-colors">
                <span className="text-[15px]">+</span> Add guest
              </button>
            </div>
          )}

          <label className="block"><span className={label}>Song request</span>
            <input className={input} value={song} onChange={e => setSong(e.target.value)} placeholder="Artist — Title" /></label>
          <label className="block"><span className={label}>Notes / dietary</span>
            <textarea className={`${input} resize-y`} rows={2} value={notes} onChange={e => setNotes(e.target.value)} /></label>

          <div className="flex gap-3 mt-2">
            <button onClick={save} disabled={saving}
              className="flex-1 bg-gold-500 text-forest-800 font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase py-3 rounded-[4px] border-none cursor-pointer hover:bg-gold-700 transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button onClick={onClose}
              className="flex-1 bg-transparent text-fg2 font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase py-3 rounded-[4px] border border-sage-200 cursor-pointer hover:bg-sage-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
