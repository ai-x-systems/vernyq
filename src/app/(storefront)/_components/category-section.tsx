/**
 * Category-level positioning copy — describes what "all-in-one" means as
 * a product category, NOT the specific unverified specs sitting on the
 * DRAFT development product in the database. Nothing here is a claim
 * about a purchasable unit, a price, or independently verified
 * performance — it's a definition of the category we're building in.
 * Replace/expand with real, reviewed product copy in Phase 2E once a
 * product is moved out of DRAFT.
 */
const categoryPoints = [
  {
    label: "Heating & cooling",
    detail: "One system handles both directions — no separate chiller to plumb in.",
  },
  {
    label: "Digital control",
    detail: "Set and hold a temperature from a panel or companion app, not a bag of ice.",
  },
  {
    label: "Built-in filtration",
    detail: "Integrated filtration is standard on this category of unit, not an add-on.",
  },
  {
    label: "Delivered, not sourced piecemeal",
    detail: "One order, one system — instead of assembling a tub, chiller, and pump separately.",
  },
];

export function CategorySection() {
  return (
    <section id="the-system" className="border-b border-[var(--brand-line)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-20">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--brand-accent)]">
              The category
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-4xl">
              What &ldquo;all-in-one&rdquo; actually means
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--brand-steel)]">
              We&apos;re bringing a single all-in-one cold plunge system to market — heating
              and cooling combined into one unit. Full specifications for the launch unit
              will be published once verified; here&apos;s what the category itself covers.
            </p>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-line)] sm:grid-cols-2">
            {categoryPoints.map((point) => (
              <div key={point.label} className="bg-white p-7">
                <dt className="font-mono text-[13px] font-medium text-[var(--brand-ink)]">
                  {point.label}
                </dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-[var(--brand-steel)]">
                  {point.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
