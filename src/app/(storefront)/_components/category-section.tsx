/**
 * Category-level positioning copy — describes what "all-in-one" means as
 * a product category, NOT the specific unverified specs sitting on the
 * DRAFT development product in the database. Nothing here is a claim
 * about a purchasable unit, a price, or independently verified
 * performance — it's a definition of the category we're building in.
 * The comparison framing (traditional setup vs. Vernyq system) is
 * honest because it's about the CATEGORY, not fabricated specs —
 * unlike the design reference's version, this doesn't claim "single
 * manufacturer warranty" or other specifics that aren't confirmed yet.
 */
const traditionalSetup = [
  "Buy tub separately",
  "Buy chiller separately",
  "Buy filters separately",
  "Figure out how to connect everything",
];

const vernyqSystem = [
  "Complete tub + chiller",
  "Integrated filtration",
  "Delivered as one system",
];

export function CategorySection() {
  return (
    <section id="the-system" className="border-b border-[var(--brand-line)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="text-overline text-[var(--brand-accent)]">The category</p>
            <h2 className="text-h2 mt-3 text-[var(--brand-ink)]">
              What &ldquo;all-in-one&rdquo; actually means
            </h2>
            <p className="text-body-lg mt-4 leading-relaxed text-[var(--brand-steel)]">
              Most cold plunge setups require buying a tub, a separate chiller, and
              filters, then figuring out how to connect everything. We&apos;re bringing a
              single all-in-one system to market instead — full specifications for the
              launch unit will be published once verified.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-5">
                <p className="text-body-sm mb-3 font-medium text-[var(--brand-steel)]">
                  Traditional setup
                </p>
                <ul className="space-y-2">
                  {traditionalSetup.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-body-sm text-[var(--brand-ink)]">
                      <div className="size-1.5 rounded-full bg-[var(--brand-line)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[0.5rem] border border-[var(--brand-accent)]/30 bg-[var(--brand-accent-soft)] p-5">
                <p className="text-body-sm mb-3 font-medium text-[var(--brand-accent)]">
                  This category
                </p>
                <ul className="space-y-2">
                  {vernyqSystem.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-body-sm text-[var(--brand-ink)]">
                      <div className="size-1.5 rounded-full bg-[var(--brand-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex aspect-[4/3] items-center justify-center rounded-[0.75rem] bg-[var(--brand-frost-dim)]">
              <span className="text-caption px-8 text-center text-[var(--brand-steel)]">
                Product photography coming once the launch unit is confirmed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
