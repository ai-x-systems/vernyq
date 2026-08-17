"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { brandConfig } from "@/config/brand.config";
import { cn } from "@/lib/utils";

// Nav destinations match the site map already planned in the Phase 1
// architecture doc. Several of these routes don't have content yet
// (built in later phases) — the links are wired now so the header's
// structure doesn't need to change again when those pages land.
const navItems = [
  { label: "Shop", href: "/cold-plunge-tubs" },
  { label: "Science", href: "/science" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[var(--brand-frost)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-[15px] font-medium tracking-tight text-[var(--brand-ink)]"
        >
          {brandConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center text-[var(--brand-ink)] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--brand-line)] transition-[max-height] duration-300 ease-out md:hidden",
          open ? "max-h-64" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 text-[15px] font-medium text-[var(--brand-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
