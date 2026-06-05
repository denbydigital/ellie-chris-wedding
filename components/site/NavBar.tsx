'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/home', label: 'Home' },
  { href: '/story', label: 'Our Story' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/travel', label: 'Travel' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/registry', label: 'Registry' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
]

export default function NavBar() {
  const path = usePathname()
  const onHome = path === '/home'

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b transition-colors',
        'backdrop-blur-[10px]',
        onHome
          ? 'bg-sage-500/82 border-[var(--line-on-sage)]'
          : 'bg-cream/86 border-sage-200',
      ].join(' ')}
    >
      <nav className="max-w-[1180px] mx-auto h-[70px] px-8 flex items-center justify-between">
        <Link
          href="/home"
          className="font-[var(--font-script)] text-[26px] leading-none no-underline transition-colors"
          style={{ color: onHome ? 'var(--on-sage-1)' : 'var(--color-sage-700)' }}
        >
          E &amp; C
        </Link>

        <ul className="flex gap-6 items-center list-none m-0 p-0">
          {links.map(({ href, label }) => {
            const active = path === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    'font-[var(--font-ui)] text-[12px] tracking-[0.18em] uppercase no-underline',
                    'py-1.5 border-b transition-colors whitespace-nowrap',
                    active
                      ? onHome
                        ? 'text-gold-300 border-gold-300'
                        : 'text-gold-700 border-gold-700'
                      : onHome
                        ? 'text-[var(--on-sage-2)] border-transparent hover:text-[var(--on-sage-1)]'
                        : 'text-fg2 border-transparent hover:text-fg1',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
