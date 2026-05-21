import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, FileText, Eye, ExternalLink, ArrowRight } from "lucide-react";

import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { ShareButton } from "@/components/shared/share-button";
import { FollowButton } from "@/components/shared/follow-button";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 3;

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("pdf", 50);
  if (!posts.length) {
    return [{ slug: "placeholder" }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("pdf", resolvedParams.slug);
    return post ? await buildPostMetadata("pdf", post) : await buildTaskMetadata("pdf");
  } catch (error) {
    console.warn("PDF metadata lookup failed", error);
    return await buildTaskMetadata("pdf");
  }
}

export default async function PdfDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post = null;
  try {
    post = await fetchTaskPostBySlug("pdf", resolvedParams.slug);
  } catch (error) {
    console.warn("PDF detail lookup failed", error);
  }
  if (!post) {
    notFound();
  }

  const content = post.content && typeof post.content === "object" ? post.content : {};
  const contentAny = content as Record<string, unknown>;
  const fileUrl =
    (typeof contentAny.fileUrl === "string" && contentAny.fileUrl) ||
    (typeof contentAny.pdfUrl === "string" && contentAny.pdfUrl) ||
    "";
  const description = typeof contentAny.description === "string" ? contentAny.description : post.summary || "";

  if (!fileUrl || !/^https?:\/\//i.test(fileUrl)) {
    notFound();
  }

  const viewerUrl = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const category =
    typeof contentAny.category === "string" ? contentAny.category : "";
  const related = (await fetchTaskPosts("pdf", 6))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      if (!category) return true;
      const itemContent = item.content && typeof item.content === "object" ? item.content : {};
      const itemCategory =
        typeof (itemContent as Record<string, unknown>).category === "string"
          ? (itemContent as Record<string, unknown>).category
          : "";
      return itemCategory === category;
    })
    .slice(0, 3);
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PDF Library",
        item: `${baseUrl}/pdf`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/pdf/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-slate-50">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pdf"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-600 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to PDF Library
          </Link>
          
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Badge className="bg-teal-600 text-white hover:bg-teal-700">
                  <FileText className="h-3 w-3 mr-1" />
                  PDF Document
                </Badge>
                {category && (
                  <Badge variant="outline" className="border-teal-200 text-teal-700">
                    {category}
                  </Badge>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">{post.title}</h1>
              {description && (
                <p className="mt-3 max-w-2xl text-lg text-slate-600 leading-relaxed">{description}</p>
              )}
              
              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/30 hover:bg-teal-500 transition-all hover:shadow-xl hover:shadow-teal-600/40"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
                <ShareButton />
                <FollowButton />
              </div>
            </div>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-teal-100 bg-white shadow-2xl shadow-teal-900/10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
          <iframe
            src={viewerUrl}
            title={post.title}
            className="relative h-[85vh] w-full"
          />
        </div>
        {/* Related PDFs */}
        {related.length ? (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">More like this</h2>
                <p className="mt-1 text-slate-600">Similar PDFs you might find useful</p>
              </div>
              <Link
                href="/pdf"
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-600 transition-colors"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TaskPostCard
                  key={item.id}
                  post={item}
                  href={buildPostUrl("pdf", item.slug)}
                />
              ))}
            </div>
            
            {/* Related Links */}
            <nav className="mt-8 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-lg shadow-teal-900/5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Related Links</h3>
              <ul className="space-y-3">
                {related.map((item) => (
                  <li key={`related-${item.id}`}>
                    <Link
                      href={buildPostUrl("pdf", item.slug)}
                      className="group flex items-center gap-3 rounded-xl p-3 text-slate-700 hover:bg-white hover:shadow-md transition-all"
                    >
                      <FileText className="h-5 w-5 text-teal-600" />
                      <span className="flex-1 font-medium group-hover:text-teal-700 transition-colors">{item.title}</span>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/pdf"
                    className="group flex items-center gap-3 rounded-xl p-3 text-slate-700 hover:bg-white hover:shadow-md transition-all"
                  >
                    <Eye className="h-5 w-5 text-teal-600" />
                    <span className="flex-1 font-medium group-hover:text-teal-700 transition-colors">Browse all PDFs</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </Link>
                </li>
              </ul>
            </nav>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
