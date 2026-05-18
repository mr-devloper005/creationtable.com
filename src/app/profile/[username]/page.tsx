import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { ShareButton } from "@/components/shared/share-button";
import { FollowButton } from "@/components/shared/follow-button";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { ExternalLink } from "lucide-react";

export const revalidate = 3;

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }
  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const about = content.about as string | undefined;
  const aboutHtml = formatRichHtml(
    about || description,
    "No about information available.",
  );
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
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
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* Main Profile Content */}
          <section className="rounded-3xl border border-border/60 bg-white/90 p-8 shadow-sm md:p-12">
            <div className="grid gap-8 md:grid-cols-[200px_1fr] md:items-start">
              <div className="flex justify-center md:justify-start">
                <div className="relative h-36 w-36 overflow-hidden rounded-full border border-border/70 bg-muted">
                  {logoUrl ? (
                    <ContentImage src={logoUrl} alt={post.title} fill className="object-cover" sizes="144px" intrinsicWidth={144} intrinsicHeight={144} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-muted-foreground">
                      {post.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{brandName}</h1>
                  {domain ? (
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{domain}</p>
                  ) : null}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <ShareButton />
                  <FollowButton />
                </div>
                
                {/* Website Link */}
                {website ? (
                  <div className="flex items-center gap-2">
                    <Link 
                      href={website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
          
          {/* Sidebar Uploads */}
          <aside className="space-y-6">
            {/* About Section */}
            <div className="rounded-3xl border border-border/60 bg-white/90 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">About</h2>
              <RichContent html={aboutHtml} className="text-sm text-muted-foreground prose-p:my-2" />
            </div>
            <div className="rounded-3xl border border-border/60 bg-white/90 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Uploads</h2>
              <div className="space-y-3">
                <div className="text-center py-8">
                  <div className="text-2xl font-bold text-muted-foreground mb-2">0</div>
                  <p className="text-sm text-muted-foreground">uploads</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {suggestedArticles.length ? (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Suggested articles</h2>
              <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestedArticles.slice(0, 3).map((article) => (
                <TaskPostCard
                  key={article.id}
                  post={article}
                  href={buildPostUrl("article", article.slug)}
                  compact
                />
              ))}
            </div>
            <nav className="mt-6 rounded-2xl border border-border bg-card/60 p-4">
              <p className="text-sm font-semibold text-foreground">Related links</p>
              <ul className="mt-2 space-y-2 text-sm">
                {suggestedArticles.slice(0, 3).map((article) => (
                  <li key={`related-${article.id}`}>
                    <Link
                      href={buildPostUrl("article", article.slug)}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/profile" className="text-primary underline-offset-4 hover:underline">
                    Browse all profiles
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
