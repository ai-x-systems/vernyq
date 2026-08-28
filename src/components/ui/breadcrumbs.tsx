import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-body-sm text-[var(--brand-steel)]">
        <li>
          <Link href="/" className="transition-colors hover:text-[var(--brand-ink)]">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-[var(--brand-line)]" />
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-[var(--brand-ink)]">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[var(--brand-ink)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
