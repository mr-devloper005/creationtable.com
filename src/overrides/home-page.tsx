import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { PdfProfileLanding } from '@/components/home/pdf-profile-landing'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchTaskPosts } from '@/lib/task-data'
import type { SitePost } from '@/lib/site-connector'

export const HOME_PAGE_OVERRIDE_ENABLED = true

type PostWithTask = { post: SitePost; task: 'pdf' }

export async function HomePageOverride() {
  const pdfPosts = await fetchTaskPosts('pdf', 8, { allowMockFallback: true, fresh: true })

  const featured: PostWithTask[] = pdfPosts.slice(0, 4).map((post) => ({ post, task: 'pdf' }))
  const latest: PostWithTask[] = [...pdfPosts]
    .sort((a, b) => {
      const ta = new Date(a.publishedAt || a.createdAt || 0).getTime()
      const tb = new Date(b.publishedAt || b.createdAt || 0).getTime()
      return tb - ta
    })
    .slice(0, 4)
    .map((post) => ({ post, task: 'pdf' as const }))

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      <PdfProfileLanding featured={featured} latest={latest} />
      <Footer />
    </div>
  )
}
