import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import { buildPostUrl } from '@/lib/task-data'
import { ContentImage } from '@/components/shared/content-image'
import { SITE_CONFIG } from '@/lib/site-config'
import { Button } from '@/components/ui/button'

type PostWithTask = { post: SitePost; task: 'pdf' }

function getPostImage(post: SitePost) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : null
  const contentImage = content && Array.isArray(content.images)
    ? (content.images as unknown[]).find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = content && typeof content.logo === 'string' ? content.logo : null
  return (typeof mediaUrl === 'string' && mediaUrl) ||
    (typeof contentImage === 'string' && contentImage) ||
    (typeof logo === 'string' && logo) ||
    '/placeholder.svg?height=900&width=1400'
}

function formatDate(value?: string | null) {
  if (!value) return 'Recently added'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Recently added'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StarRow({ rating = 4.8 }: { rating?: number }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`Rating ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < full ? 'fill-current' : 'fill-none'}`} />
      ))}
      <span className="ml-1.5 text-xs font-medium text-teal-100/90">{rating}</span>
    </div>
  )
}

export function PdfProfileLanding({ featured, latest }: { featured: PostWithTask[]; latest: PostWithTask[] }) {
  const resourceTypes = [
    { label: 'Medical & health PDFs', icon: FileText, hint: 'Clinical summaries, consent packs' },
    { label: 'Compliance PDFs', icon: FileText, hint: 'Policies, audit-ready exports' },
    { label: 'Educational guides', icon: FileText, hint: 'Workbooks and syllabi' },
    { label: 'Research papers', icon: FileText, hint: 'Preprints and whitepapers' },
    { label: 'Templates & forms', icon: FileText, hint: 'Ready-to-use documents' },
    { label: 'Industry briefings', icon: FileText, hint: 'Curated weekly summaries' },
  ]

  const categories = [
    { title: 'Featured PDF packs', count: '200+ resources', href: '/pdf', gradient: 'from-teal-700 via-teal-600 to-cyan-500', icon: FolderOpen },
    { title: 'Templates & forms', count: 'Ready to download', href: '/pdf', gradient: 'from-teal-900 to-slate-900', icon: ClipboardList },
    { title: 'Industry briefings', count: 'Curated weekly', href: '/pdf', gradient: 'from-cyan-800 to-teal-800', icon: Newspaper },
    { title: 'Research papers', count: 'Academic & whitepapers', href: '/pdf', gradient: 'from-emerald-900 to-teal-800', icon: BookOpen },
    { title: 'Compliance packs', count: 'Audit-ready exports', href: '/pdf', gradient: 'from-slate-800 to-teal-900', icon: ShieldCheck },
  ]

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-teal-50 pb-16 pt-6 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.25),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-100">
              <Sparkles className="h-3.5 w-3.5" />
              PDF library
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Find essential PDFs in one place
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-teal-100/90 sm:text-lg">
              Search curated documents, preview what matters, and download what you need—without wading through unrelated listings or feeds.
            </p>
          </div>

          <form
            action="/search"
            method="get"
            className="mx-auto mt-10 flex max-w-4xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-teal-950/20 sm:flex-row sm:items-stretch"
          >
            <label className="sr-only" htmlFor="home-q">Keywords</label>
            <div className="flex min-h-[52px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4">
              <Search className="h-5 w-5 shrink-0 text-teal-600" />
              <input
                id="home-q"
                name="q"
                type="search"
                placeholder="Search for PDFs and topics…"
                className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:w-48">
              <label className="sr-only" htmlFor="home-task">Type</label>
              <select
                id="home-task"
                name="task"
                defaultValue=""
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/30"
              >
                <option value="">All types</option>
                <option value="pdf">PDFs only</option>
              </select>
            </div>
            <Button type="submit" className="h-11 shrink-0 rounded-xl bg-teal-600 px-8 text-sm font-semibold text-white hover:bg-teal-500 sm:h-auto sm:self-stretch">
              Search
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">A simple path from discovery to download.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { step: '1', title: 'Search', body: 'Filter by document type to narrow results fast.', icon: Search },
            { step: '2', title: 'Preview', body: 'Scan summaries, ratings, and metadata before you commit time.', icon: Eye },
            { step: '3', title: 'Download', body: 'Grab the PDF you need and start using it.', icon: Download },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/25">
                <item.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-teal-700">{item.step}. {item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Top PDF categories</h2>
            <p className="mt-2 max-w-xl text-slate-600">Jump into the lanes your team uses most—each card opens the matching library view.</p>
          </div>
          <Link href="/pdf" className="text-sm font-semibold text-teal-700 hover:text-teal-600">
            View all PDFs →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:items-stretch">
          {(() => {
            const CatIcon = categories[0].icon
            return (
              <Link
                href={categories[0].href}
                className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl lg:min-h-[420px]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${categories[0].gradient}`} />
                <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                <div className="relative">
                  <CatIcon className="mb-4 h-10 w-10 text-white/70" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/80">{categories[0].count}</p>
                  <h3 className="mt-2 text-2xl font-bold">{categories[0].title}</h3>
                </div>
              </Link>
            )
          })()}
          <div className="grid grid-cols-2 gap-4">
            {categories.slice(1).map((cat) => {
              const SmallIcon = cat.icon
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group relative flex min-h-[160px] flex-col justify-end overflow-hidden rounded-3xl p-5 text-white shadow-md transition hover:scale-[1.01] hover:shadow-xl sm:min-h-[190px]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                  <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                  <div className="relative">
                    <SmallIcon className="mb-3 h-7 w-7 text-white/70" />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">{cat.count}</p>
                    <h3 className="mt-1 text-base font-bold leading-snug">{cat.title}</h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Resource types</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">Pick a lane to explore—everything here stays focused on documents.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resourceTypes.map((t) => (
              <div
                key={t.label}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <t.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t.label}</p>
                  <p className="mt-1 text-sm text-slate-600">{t.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured PDFs</h2>
            <p className="mt-2 text-slate-600">A live slice from your library—swap in production content anytime.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-600">
              New PDFs will appear here once your catalog syncs. Open the{' '}
              <Link className="font-semibold text-teal-700 underline" href="/pdf">PDF library</Link> to browse now.
            </p>
          ) : null}
          {featured.map(({ post, task }) => (
            <article key={post.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
              <Link href={buildPostUrl(task, post.slug)} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
                <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  PDF
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <StarRow />
                <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900">
                  <Link href={buildPostUrl(task, post.slug)} className="hover:text-teal-700">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {post.summary || 'Downloadable resource'}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-xs text-slate-400">PDF</span>
                  <Button size="sm" variant="outline" className="rounded-full border-teal-200 text-teal-800 hover:bg-teal-50" asChild>
                    <Link href={buildPostUrl(task, post.slug)}>View</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-3">
          <Button asChild variant="outline" className="rounded-full border-slate-200 px-6">
            <Link href="/pdf">View all PDFs</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-teal-800 to-teal-600 p-8 text-white shadow-xl lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:p-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to explore the library?</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-teal-100">
              Jump back into search or open a featured PDF from the library.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-teal-900 shadow-sm hover:bg-teal-50"
              >
                Open search
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>
          </div>
          <div className="relative mt-10 hidden h-48 lg:mt-0 lg:block lg:h-56">
            <div className="absolute right-0 top-0 h-40 w-52 rotate-3 overflow-hidden rounded-2xl border-4 border-white/20 shadow-lg">
              <ContentImage src="/placeholder.svg?height=400&width=520" alt="" fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 right-24 -rotate-6 overflow-hidden rounded-2xl border-4 border-white/30 shadow-lg h-36 w-48">
              <ContentImage src="/og-default.png" alt="" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Latest uploads</h2>
            <Link href="/pdf" className="text-sm font-semibold text-teal-700 hover:text-teal-600">
              See what is new →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.length === 0 ? (
              <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
                No recent uploads yet. Check back soon or explore the full library.
              </p>
            ) : null}
            {latest.map(({ post, task }) => (
              <article key={`${post.id}-latest`} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <Link href={buildPostUrl(task, post.slug)} className="relative block aspect-[16/10] bg-slate-100">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </Link>
                <div className="p-4">
                  <p className="text-xs text-slate-500">{formatDate(post.publishedAt || post.createdAt)}</p>
                  <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">
                    <Link href={buildPostUrl(task, post.slug)} className="hover:text-teal-700">
                      {post.title}
                    </Link>
                  </h3>
                  <Link href={buildPostUrl(task, post.slug)} className="mt-3 inline-flex text-sm font-semibold text-teal-700 hover:underline">
                    Download now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
