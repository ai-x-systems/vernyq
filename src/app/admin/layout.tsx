import Link from "next/link";
import { logoutAction } from "./login/actions";
import { VernyqLogo } from "@/components/ui/logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--brand-frost)]">
      <header className="border-b border-[var(--brand-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <VernyqLogo variant="full" color="dark" className="h-7" />
            <nav className="flex items-center gap-4">
              <Link href="/admin/orders" className="text-body-sm font-medium text-[var(--brand-ink)]">
                Orders
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-body-sm text-[var(--brand-steel)] underline underline-offset-2 hover:text-[var(--brand-ink)]">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
