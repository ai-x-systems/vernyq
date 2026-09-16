"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-h2 text-[var(--brand-ink)]">Admin Login</h1>
      <p className="text-body-sm mt-2 text-[var(--brand-steel)]">Vernyq admin access.</p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label htmlFor="password" className="text-body-sm mb-1.5 block font-medium text-[var(--brand-ink)]">
            Password
          </label>
          <input id="password" name="password" type="password" required autoFocus className="h-11 w-full rounded-[0.375rem] border border-[var(--brand-line)] bg-white px-3 text-body-sm text-[var(--brand-ink)] outline-none transition-colors focus:border-[var(--brand-ink)]" />
        </div>

        {state?.error && (
          <p className="text-caption rounded-[0.375rem] bg-red-50 px-3 py-2 text-red-600">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={isPending} className="text-body-sm flex h-11 w-full items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60">
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
