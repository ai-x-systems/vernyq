import Link from "next/link";
import { brandConfig } from "@/config/brand.config";
import { VernyqLogo } from "@/components/ui/logo";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Shop: [{ label: "Cold Plunge Tubs", href: "/cold-plunge-tubs" }],
  Learn: [
    { label: "Science", href: "/science" },
    { label: "Journal", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
  Support: [
    { label: "Shipping", href: "/shipping" },
    { label: "Warranty", href: "/warranty" },
    { label: "Returns", href: "/returns" },
    { label: "Contact", href: "/contact" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    // Matches the locked /track-order/[orderNumber] architecture spec,
    // not the reference's /tracking.
    { label: "Order Tracking", href: "/track-order" },
  ],
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--brand-ink)] text-white/80">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4 lg:gap-12 lg:py-20">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-overline mb-4 text-white/50">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 py-10 lg:py-12">
          <div className="max-w-md">
            <VernyqLogo variant="full" color="light" className="h-9" />
            <p className="mt-3 text-body-sm leading-relaxed text-white/50">
              {brandConfig.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-caption text-white/40">
            © {year} {brandConfig.legal.entityName}. All rights reserved.
          </p>
          <p className="text-caption text-white/40">
            {brandConfig.market.country} · Prices in {brandConfig.market.currency}
          </p>
        </div>
      </div>
    </footer>
  );
}
