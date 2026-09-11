import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Frequently Asked Questions";
const PAGE_DESCRIPTION = "Answers to common questions about ordering, payment, and support at Vernyq.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/faq` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/faq`,
    siteName: brandConfig.name,
    type: "website",
  },
};

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What payment methods do you accept?",
    answer:
      "Bank/wire transfer, or a manual payment request sent to your email. We don't collect card details on this site, and your order isn't marked paid until we've personally verified your payment.",
  },
  {
    question: "Is it safe to send a bank transfer for an order this size?",
    answer:
      "Your order is created as \u201cAwaiting Payment\u201d and only moves forward after we verify the transfer ourselves \u2014 nothing about payment status is ever decided automatically by your browser. If anything about your payment feels unclear, contact us before sending funds.",
  },
  {
    question: "Do you ship within the US?",
    answer:
      "Yes, our current focus is US customers. For specifics on lead times and delivery, see our Shipping page \u2014 we're finalizing exact timelines with our manufacturing partner and would rather confirm them accurately than guess.",
  },
  {
    question: "How do I track my order?",
    answer: "Use the Track Order page with your order reference and the email you used at checkout.",
  },
  {
    question: "What if I have questions before I buy?",
    answer:
      "Reach out any time \u2014 for a purchase this size, we'd much rather answer a question up front than have you find out something after it arrives.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Frequently Asked Questions</h1>

      <div className="mt-8 divide-y divide-[var(--brand-line)] border-t border-[var(--brand-line)]">
        {FAQS.map((faq) => (
          <div key={faq.question} className="py-6">
            <h2 className="text-h3 text-[var(--brand-ink)]">{faq.question}</h2>
            <p className="text-body mt-2 leading-relaxed text-[var(--brand-steel)]">{faq.answer}</p>
          </div>
        ))}
      </div>

      <p className="text-body-sm mt-8 text-[var(--brand-steel)]">
        Don&apos;t see your question?{" "}
        <a href="/contact" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
          Contact us
        </a>
        .
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
