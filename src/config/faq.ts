export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
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
