import type { Metadata } from "next";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

// Reads live blog data — must never be statically prerendered.
export const dynamic = "force-dynamic";

const PAGE_TITLE = "Journal";
const PAGE_DESCRIPTION = "Notes on cold exposure, recovery, and building Vernyq.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/blog` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/blog`,
    siteName: brandConfig.name,
    type: "website",
  },
};

export default async function BlogPage() {
  const brand = await getCurrentBrand();

  const posts = await prisma.blogPost.findMany({
    where: { brandId: brand.id, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Journal" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Journal</h1>
      <p className="text-body-lg mt-4 text-[var(--brand-steel)]">{PAGE_DESCRIPTION}</p>

      {posts.length > 0 ? (
        <>
          <div className="mt-10 divide-y divide-[var(--brand-line)] border-t border-[var(--brand-line)]">
            {posts.map((post) => (
              <article key={post.id} className="py-6">
                {post.category && (
                  <p className="text-overline text-[var(--brand-accent)]">{post.category.name}</p>
                )}
                <h2 className="text-h3 mt-2 text-[var(--brand-ink)]">{post.title}</h2>
                <p className="text-body mt-2 leading-relaxed text-[var(--brand-steel)]">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
          <p className="text-caption mt-6 text-[var(--brand-steel)]">
            Full article pages are coming soon — for now, this page lists what
            we&apos;ve published.
          </p>
        </>
      ) : (
        <div className="mt-10 rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] px-8 py-16 text-center">
          <p className="text-overline text-[var(--brand-steel)]">Nothing published yet</p>
          <p className="text-body mt-3 text-[var(--brand-steel)]">
            We&apos;re focused on getting our first product right before we start writing
            about it. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
