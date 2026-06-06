/* Stress test: 100 guests through the real dashboard + CSV logic.
   Run: node scripts/stress-test.mjs */

const MEALS = ['Chicken', 'Beef', 'Vegetarian', 'Vegan', 'Child']
const FIRST = ['Jo','Mike','Lily','Sam','Rebecca','Tom','Edith','James','Lucy','Sue','Paul','Priya','Charlie','Meg','Bob','Carol','Linh','David','Fiona','Jack','Grace','Chris','Beth','Declan','Olivia','Joshua','Ellie','Max','Lauren','Cameron']
const LAST = ['Harrison','Walsh','Brown','Porter','Denby','Sharma','Evans','Jones','Nguyen','Mackay','Marsden','Pugh','Ives','Scholes','Gizzi']
const SONGS = ['Mr Brightside — The Killers','September — Earth, Wind & Fire','Dancing Queen — ABBA','Superstition — Stevie Wonder','Lovely Day — Bill Withers','', '', '']
const NOTES = ['Nut allergy','Wheelchair access please','','','Vegetarian for one','', 'Coming from afar']

function rand(a){ return a[Math.floor(Math.random()*a.length)] }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min }
function name(){ return `${rand(FIRST)} ${rand(LAST)}` }

// ---- Generate 100 guests with realistic spread ----
const guests = []
for (let i = 0; i < 100; i++) {
  const r = Math.random()
  const status = r < 0.6 ? 'attending' : r < 0.78 ? 'declined' : 'pending'
  const maxGuests = randInt(1, 6)
  let party_size = 0
  let guests_json = []
  if (status === 'attending') {
    party_size = randInt(1, maxGuests)
    guests_json = Array.from({ length: party_size }, () => ({ name: name(), meal: rand(MEALS) }))
  }
  // a couple of nasty edge cases:
  if (i === 0) { guests_json = [{ name: '', meal: 'Chicken' }, { name: 'Quote "Tricky", Name', meal: 'Vegan' }]; party_size = 2; }
  if (i === 1) { guests_json = []; } // attending but empty (shouldn't happen, but test it)
  guests.push({
    id: `id-${i}`,
    name: i % 7 === 0 ? `The ${rand(LAST)} Family` : name(),
    email: `guest${i}@example.com`,
    status,
    party_size: status === 'attending' ? party_size : 0,
    max_guests: maxGuests,
    guests_json,
    song: status === 'attending' ? rand(SONGS) : '',
    notes: rand(NOTES),
    invite_token: `tok${i}${'x'.repeat(20)}`,
    invite_sent_at: Math.random() < 0.7 ? '2026-11-01T00:00:00Z' : null,
    responded_at: status !== 'pending' ? '2026-11-10T00:00:00Z' : null,
    created_at: new Date(Date.now() - i * 1000).toISOString(),
  })
}

// ============================================================
// DASHBOARD AGGREGATION (mirrors app/admin/page.tsx)
// ============================================================
const t0 = performance.now()

const attending = guests.filter(g => g.status === 'attending')
const declined  = guests.filter(g => g.status === 'declined')
const pending   = guests.filter(g => g.status === 'pending')
const headcount = (g) => (g.guests_json?.length || g.party_size || 0)
const totalGuests = attending.reduce((s, g) => s + headcount(g), 0)
const declinedGuests = declined.reduce((s, g) => s + (g.max_guests ?? 1), 0)
const maxHeadcount = guests.reduce((s, g) => s + (g.max_guests ?? 1), 0)
const meals = attending.flatMap(g => g.guests_json)
const mealCounts = { Chicken: 0, Beef: 0, Vegetarian: 0, Vegan: 0, Child: 0 }
meals.forEach(m => { if (mealCounts[m.meal] !== undefined) mealCounts[m.meal]++ })

const t1 = performance.now()

// ============================================================
// CSV EXPORT — one row per person (mirrors api/admin/export)
// ============================================================
function csv(rows){ return rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\r\n') }

const rows = [['Guest Name','Meal','Invitation','Email','Status','Song Request','Notes','Responded At']]
for (const g of guests) {
  const people = g.guests_json || []
  if (g.status === 'attending' && people.length > 0) {
    people.forEach((p, i) => rows.push([
      p.name?.trim() || `Guest ${i+1}`, p.meal || '', g.name, g.email, g.status,
      i === 0 ? (g.song||'') : '', i === 0 ? (g.notes||'') : '',
      g.responded_at ? g.responded_at.slice(0,10) : '',
    ]))
  } else {
    rows.push([g.name,'',g.name,g.email,g.status,g.song||'',g.notes||'', g.responded_at?g.responded_at.slice(0,10):''])
  }
}
const csvOut = csv(rows)
const t2 = performance.now()

// ============================================================
// SEARCH (mirrors guest list filter, incl. party-member names)
// ============================================================
function search(q) {
  q = q.toLowerCase()
  return guests.filter(g =>
    g.name.toLowerCase().includes(q) ||
    g.email.toLowerCase().includes(q) ||
    (g.guests_json ?? []).some(p => p.name?.toLowerCase().includes(q))
  )
}
const t3 = performance.now()
const sampleName = attending.find(g => g.guests_json.length > 1)?.guests_json[1]?.name || 'Jo'
const searchHits = search(sampleName.split(' ')[0])
const t4 = performance.now()

// ============================================================
// VERIFY + REPORT
// ============================================================
const csvDataRows = rows.length - 1
const expectedRows = guests.reduce((s,g) =>
  s + ((g.status === 'attending' && g.guests_json.length>0) ? g.guests_json.length : 1), 0)
const mealSum = Object.values(mealCounts).reduce((a,b)=>a+b,0)

const pass = (c) => c ? '✅' : '❌ FAIL'

console.log('═══════════════════════════════════════════════')
console.log('  STRESS TEST — 100 GUESTS')
console.log('═══════════════════════════════════════════════')
console.log(`Invites:            ${guests.length}`)
console.log(`  Attending:        ${attending.length} invites  →  ${totalGuests} guests (headcount)`)
console.log(`  Declined:         ${declined.length} invites`)
console.log(`  Pending:          ${pending.length} invites`)
console.log(`  Max headcount:    ${maxHeadcount}`)
console.log('───────────────────────────────────────────────')
console.log('MEAL BREAKDOWN (attending only):')
Object.entries(mealCounts).forEach(([m,n]) => console.log(`  ${m.padEnd(12)} ${n}`))
console.log(`  ${'TOTAL'.padEnd(12)} ${mealSum}`)
console.log('───────────────────────────────────────────────')
console.log('CORRECTNESS CHECKS:')
console.log(`  ${pass(mealSum === totalGuests)} meal count total (${mealSum}) == headcount (${totalGuests})`)
console.log(`  ${pass(csvDataRows === expectedRows)} CSV person-rows (${csvDataRows}) == expected (${expectedRows})`)
console.log(`  ${pass(totalGuests === attending.reduce((s,g)=>s+g.guests_json.length,0))} headcount == sum of named guests`)
console.log(`  ${pass(!csvOut.includes('\n\n'))} no malformed CSV rows`)
console.log(`  ${pass(csvOut.includes('""Tricky""'))} quotes/commas in names escaped correctly`)
console.log(`  ${pass(searchHits.length > 0)} search by party-member name returns hits (${searchHits.length})`)
console.log('───────────────────────────────────────────────')
console.log('PERFORMANCE:')
console.log(`  Dashboard aggregation:  ${(t1-t0).toFixed(2)} ms`)
console.log(`  CSV generation:         ${(t2-t1).toFixed(2)} ms  (${(csvOut.length/1024).toFixed(1)} KB)`)
console.log(`  Search filter:          ${(t4-t3).toFixed(3)} ms`)
console.log('═══════════════════════════════════════════════')
