import Link from "next/link";
import { brandConfig } from "@/config/brand.config";

const footerLinks = [
  { label: "Shop", href: "/cold-plunge-tubs" },
  { label: "Science", href: "/science" },
  { label: "About", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Warranty", href: "/warranty" },
  { label: "Returns", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--brand-line)] bg-[var(--brand-frost)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <p className="font-mono text-[15px] font-medium text-[var(--brand-ink)]">
              {brandConfig.name}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--brand-steel)]">
              {brandConfig.tagline}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--brand-line)] pt-6 text-[12px] text-[var(--brand-steel)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brandConfig.legal.entityName}. All rights reserved.
          </p>
          <p>{brandConfig.market.country} · Prices in {brandConfig.market.currency}</p>
        </div>
      </div>
    </footer>
  );
}
