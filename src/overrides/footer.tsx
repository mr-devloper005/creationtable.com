import Link from 'next/link'
import { FileText } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'

export const FOOTER_OVERRIDE_ENABLED = true

export function FooterOverride() {
  return (
    <footer className="bg-gradient-to-b from-teal-950 to-teal-900 text-teal-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.35fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-teal-900/80 p-1">
                <img src="/favicon.png?v=20260421" alt="" width={44} height={44} className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{SITE_CONFIG.name}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-teal-100/85">{SITE_CONFIG.description}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300/90">Explore</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/pdf" className="inline-flex items-center gap-2 hover:text-white">
                    <FileText className="h-4 w-4" />
                    PDF library
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white">
                    Search
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300/90">Company</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300/90">Support & legal</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/help" className="hover:text-white">Help center</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-teal-800/60 pt-8 text-sm text-teal-200/80 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
