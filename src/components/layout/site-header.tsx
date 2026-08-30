"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { VernyqLogo } from "@/components/ui/logo";
import { useCart } from "@/contexts/cart-context";

// Nav destinations match the site map already planned in the Phase 1
// architecture doc. Several of these routes don't have content yet
// (built in later phases) — the links are wired now so the header's
// structure doesn't need to change again when those pages land.
const navItems = [
  { label: "Shop", href: "/cold-plunge-tubs" },
  { label: "Science", href: "/science" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-[var(--brand-line)] bg-[var(--brand-frost)]/95 backdrop-blur-md"
            : "bg-[var(--brand-frost)]/80 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-18">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="-ml-2 p-2 text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-steel)] lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-body-sm font-medium transition-colors hover:text-[var(--brand-ink)]",
                    pathname === item.href ? "text-[var(--brand-ink)]" : "text-[var(--brand-steel)]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <VernyqLogo variant="full" color="dark" className="h-9 lg:h-10" />
            </Link>

            <div className="flex items-center gap-3 lg:gap-6">
              <button
                type="button"
                aria-label="Search"
                className="hidden p-2 text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)] lg:block"
              >
                <Search className="size-5" />
              </button>

              {/* Cart is now wired to real, persisted cart state. */}
              <Link
                href="/cart"
                aria-label={`Cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
                className="relative p-2 text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)]"
              >
                <ShoppingBag className="size-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-accent)] px-1 text-[10px] font-medium text-white">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cold-plunge-tubs"
                className="hidden h-9 items-center justify-center rounded-[0.5rem] bg-[var(--brand-accent)] px-5 text-body-sm font-medium text-white shadow-sm transition-colors hover:opacity-90 lg:inline-flex"
              >
                Shop Cold Plunges
              </Link>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 right-0 top-16 z-50 border-b border-[var(--brand-line)] bg-[var(--brand-frost)] shadow-lg">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-6 py-3 text-body font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[var(--brand-frost-dim)] text-[var(--brand-ink)]"
                      : "text-[var(--brand-steel)] hover:bg-[var(--brand-frost-dim)]/50",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-[var(--brand-line)] px-6 pt-2">
                <Link
                  href="/cold-plunge-tubs"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-full items-center justify-center rounded-[0.5rem] bg-[var(--brand-accent)] text-body-sm font-medium text-white"
                >
                  Shop Plunges
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
