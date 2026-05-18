import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Shield, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'

const values = [
  {
    title: 'Documents you can trust',
    description: 'Every PDF surface is built for clear titles, summaries, and file context so teams know what they are opening before they commit.',
  },
  {
    title: 'Search-first discovery',
    description: 'Titles, topics, and tags are optimized for fast search—so the right document surfaces without endless scrolling.',
  },
  {
    title: 'One calm workspace',
    description: 'Teal gradients, rounded cards, and clean flows make browsing PDFs lightweight and readable at any scale.',
  },
]

export default function AboutPage() {
  return (
    <PageShell
      variant="teal"
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a focused library for downloadable PDFs—built for discovery without unrelated feeds or clutter.`}
      actions={
        <>
          <Button variant="secondary" className="rounded-full border-0 bg-white/15 text-white hover:bg-white/25" asChild>
            <Link href="/pdf">Browse PDFs</Link>
          </Button>
          <Button className="rounded-full border-0 bg-white font-semibold text-teal-900 hover:bg-teal-50" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm">
          <CardContent className="space-y-6 p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-800">
              <Sparkles className="h-3.5 w-3.5" />
              Our story
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              A single place for essential files.
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              We built {SITE_CONFIG.name} because document libraries too often get buried inside generic social feeds or bloated platforms. Here, PDFs are the focus—organized for preview and download with consistent metadata, clear search, and a calm visual experience that keeps discovery fast.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="grid gap-4">
            <Card className="rounded-3xl border border-teal-100 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">PDF library</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Guides, policies, templates, and research packs—organized for preview and download with consistent metadata.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="rounded-3xl border border-teal-900/10 bg-gradient-to-br from-teal-900 to-teal-700 text-white shadow-lg">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-6 w-6 shrink-0 text-teal-100" />
                <div>
                  <p className="font-semibold">Quality & safety</p>
                  <p className="mt-1 text-sm text-teal-100/90">
                    We prioritize clear sourcing, structured metadata, and tooling that keeps discovery readable at scale.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="shrink-0 rounded-full border-0 bg-white text-teal-900 hover:bg-teal-50" asChild>
                <Link href="/help">Read policies</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title} className="rounded-3xl border border-slate-100 bg-slate-50/60">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
