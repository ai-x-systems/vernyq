import { ShieldCheck, MessageCircle, ClipboardCheck, Target } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

/**
 * Brand-level differentiators, not product specs and not the operational
 * facts already covered in TrustSection ("direct to you", "guest
 * checkout", "U.S. focused") or the category definition in
 * CategorySection. Every line here is a commitment about how we operate
 * — verifiable by how the rest of the site behaves — not a performance
 * claim about the product itself.
 */
const values = [
  {
    icon: ShieldCheck,
    title: "No fabricated claims",
    description:
      "Every specification, warranty term, and shipping estimate on this site is either confirmed or clearly marked as pending confirmation. We don't publish placeholder numbers to look complete.",
  },
  {
    icon: MessageCircle,
    title: "You reach a real person",
    description:
      "No support ticket queue, no chatbot loop. When you email us, someone who actually knows the product reads it and replies.",
  },
  {
    icon: ClipboardCheck,
    title: "Verified before it's published",
    description:
      "We confirm details with our manufacturing partner before they go on this site — not after a customer finds out the hard way.",
  },
  {
    icon: Target,
    title: "One category, done properly",
    description:
      "We're focused on getting cold plunge systems right before expanding into anything else — not listing dozens of products we can't stand behind.",
  },
];

export function WhyVernyqSection() {
  return (
    <section className="border-b border-[var(--brand-line)] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline="Why Vernyq"
          title="Built on transparency, not marketing copy"
          description="We'd rather you trust what's on this site than be impressed by it."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-[0.5rem] border border-[var(--brand-line)] p-6 lg:p-8"
            >
              <div className="flex size-10 items-center justify-center rounded-[0.5rem] bg-[var(--brand-accent-soft)]">
                <value.icon className="size-5 text-[var(--brand-accent)]" />
              </div>
              <h3 className="text-h3 mt-4 text-[var(--brand-ink)]">{value.title}</h3>
              <p className="text-body-sm mt-2 leading-relaxed text-[var(--brand-steel)]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
