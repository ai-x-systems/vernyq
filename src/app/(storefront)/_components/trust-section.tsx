import { Truck, ShoppingBag, MapPin } from "lucide-react";

/**
 * Every line here is a fact about how Vernyq itself operates or is
 * being built — decisions we control and can substantiate — not a
 * product performance claim, review, sales figure, or supplier spec.
 * No "X customers", no ratings, no scarcity language, and deliberately
 * NOT copying unconfirmed commitments like "Free Freight" or "30-Day
 * Returns" from the design reference — those aren't decided yet.
 */
const trustPoints = [
  {
    icon: Truck,
    label: "Direct to you",
    detail: "Sold directly, without a third-party retail markup in between.",
  },
  {
    icon: ShoppingBag,
    label: "Guest checkout",
    detail: "One secure checkout, no account required to buy.",
  },
  {
    icon: MapPin,
    label: "U.S. focused",
    detail: "Launching for the U.S. market first, fulfilled from U.S.-based inventory where available.",
  },
];

export function TrustSection() {
  return (
    <section className="border-b border-[var(--brand-line)] bg-[var(--brand-accent-soft)]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex items-start gap-3">
              <point.icon className="mt-0.5 size-5 shrink-0 text-[var(--brand-accent)]" />
              <div>
                <p className="text-body-sm font-medium text-[var(--brand-ink)]">{point.label}</p>
                <p className="text-body-sm mt-1 text-[var(--brand-steel)]">{point.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
