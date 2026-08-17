/**
 * Ripple motif — the page's signature element. Three concentric rings
 * expanding outward and fading, like the surface of water after entry.
 * Purely decorative (aria-hidden), no client JS — the animation is CSS
 * keyframes defined in globals.css (.animate-brand-ripple), gated behind
 * `motion-safe:` so it's inert for anyone with reduced-motion set.
 */
export function RippleMotif() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="motion-safe:animate-brand-ripple absolute h-[280px] w-[280px] rounded-full border border-[var(--brand-accent)]/25 sm:h-[420px] sm:w-[420px]"
          style={{ animationDelay: `${i * 1.5}s` }}
        />
      ))}
    </div>
  );
}
