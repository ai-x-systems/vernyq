import { cn } from "@/lib/utils";

/**
 * The official Vernyq logo — Variant 2 (Icon + Wordmark), Frost Navy
 * colorway, confirmed brand identity. Ported from the vernyq-recovery-hub
 * reference (design/UX reference only — that project runs on a different
 * stack and isn't integrated directly).
 *
 * Colors are read from the --brand-ink / --brand-accent tokens (see
 * globals.css) rather than hardcoded, so this stays correct if brand
 * tokens ever move to a DB-editable Brand.themeConfig row.
 */

type LogoProps = {
  className?: string;
  variant?: "full" | "icon" | "wordmark";
  /** "dark" = navy ink on a light background (default, most contexts).
   *  "light" = white ink, for use on a dark/navy background. */
  color?: "dark" | "light";
};

export function VernyqLogo({ className, variant = "full", color = "dark" }: LogoProps) {
  const ink = color === "dark" ? "var(--brand-ink)" : "#ffffff";
  const accent = "var(--brand-accent)";

  const icon = (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-8 w-8 lg:h-10 lg:w-10"
    >
      <path d="M8 10L24 40L40 10H33L24 30L15 10H8Z" fill={ink} />
      <path
        d="M24 8C24 8 21 13 21 15C21 16.6569 22.3431 18 24 18C25.6569 18 27 16.6569 27 15C27 13 24 8 24 8Z"
        fill={accent}
      />
    </svg>
  );

  if (variant === "icon") {
    return <span className={cn("inline-flex", className)}>{icon}</span>;
  }

  if (variant === "wordmark") {
    return (
      <span
        className={cn("text-xl font-semibold tracking-[0.18em] lg:text-2xl", className)}
        style={{ color: ink }}
      >
        VERNYQ
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col items-center gap-1", className)}>
      <span className="flex items-center gap-3">
        {icon}
        <span
          className="text-xl font-semibold tracking-[0.18em] lg:text-2xl"
          style={{ color: ink }}
        >
          VERNYQ
        </span>
      </span>
      <span
        className="text-[0.5rem] font-medium uppercase tracking-[0.25em] lg:text-[0.6rem]"
        style={{ color: ink, opacity: 0.6 }}
      >
        Clear. Powerful.
      </span>
    </span>
  );
}
