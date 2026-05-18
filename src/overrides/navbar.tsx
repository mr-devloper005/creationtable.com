'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Menu, Search, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  loading: () => null,
})

export const NAVBAR_OVERRIDE_ENABLED = true

const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'PDF library', href: '/pdf' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
]

export function NavbarOverride() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-teal-800/30 bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 text-white shadow-md shadow-teal-950/20 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-1 sm:h-11 sm:w-11">
            <img src="/favicon.png?v=20260421" alt="" width={44} height={44} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-lg font-semibold sm:text-xl">{SITE_CONFIG.name}</span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-semibold transition-colors',
                  active ? 'bg-white/15 text-white' : 'text-teal-100 hover:bg-white/10 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden max-w-xs flex-1 px-4 md:block lg:max-w-md">
          <form action="/search" method="get" className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-teal-100" />
            <input name="q" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-teal-200/70" placeholder="Search PDFs…" />
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full text-white hover:bg-white/10 md:hidden">
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" asChild className="rounded-full text-white hover:bg-white/10 sm:hidden">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </Button>
              <div className="hidden items-center gap-1 sm:flex">
                <NavbarAuthControls />
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" asChild className="rounded-full text-teal-50 hover:bg-white/10 hover:text-white">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full border-0 bg-white px-4 font-semibold text-teal-900 shadow-sm hover:bg-teal-50">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-teal-950/98 px-4 py-4 lg:hidden">
          <form action="/search" method="get" className="mb-3 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-teal-100" />
            <input name="q" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-teal-200/70" placeholder="Search…" />
            <Button type="submit" size="sm" className="rounded-full bg-white text-teal-900 hover:bg-teal-50">
              Go
            </Button>
          </form>
          <div className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-teal-50 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-teal-50 hover:bg-white/10">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
