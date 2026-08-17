/**
 * Every line here is a fact about how Vernyq itself operates or is
 * being built — decisions we control and can substantiate — not a
 * product performance claim, review, sales figure, or supplier spec.
 * No "X customers", no ratings, no scarcity language.
 */
const trustPoints = [
  {
    label: "Direct to you",
    detail: "Sold directly, without a third-party retail markup in between.",
  },
  {
    label: "Guest checkout",
    detail: "One secure checkout, no account required to buy.",
  },
  {
    label: "U.S. focused",
    detail: "Launching for the U.S. market first, fulfilled from U.S.-based inventory where available.",
  },
];

export function TrustSection() {
  return (
    <section className="border-b border-[var(--brand-line)] bg-[var(--brand-accent-soft)]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid divide-y divide-[var(--brand-line)]/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {trustPoints.map((point) => (
            <div key={point.label} className="px-0 py-8 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0">
              <p className="font-mono text-[13px] font-medium text-[var(--brand-ink)]">
                {point.label}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--brand-steel)]">
                {point.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
