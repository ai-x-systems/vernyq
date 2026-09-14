/**
 * Adapted from the design reference's "Recovery That Fits Your Life"
 * section — same 3-step structure, but deliberately stripped of the
 * specific numbers it presented as fact ("typically 3°C–10°C", "2–5
 * minutes"). Those read as usage/health guidance we haven't sourced or
 * verified, which is exactly the kind of claim this project doesn't
 * publish. The process itself (set temperature, step in, recover) is
 * true of the category regardless of specific numbers.
 */
const steps = [
  {
    step: "01",
    title: "Set your temperature",
    desc: "Choose the temperature that works for you.",
  },
  {
    step: "02",
    title: "Step in",
    desc: "Enter the plunge and control your breathing.",
  },
  {
    step: "03",
    title: "Recover",
    desc: "Step out when you're ready, warm up, feel the difference.",
  },
];

export function RecoveryRoutineSection() {
  return (
    <section className="border-b border-[var(--brand-line)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex aspect-[4/3] items-center justify-center rounded-[0.75rem] bg-[var(--brand-frost-dim)]">
            <span className="text-caption px-8 text-center text-[var(--brand-steel)]">
              Lifestyle photography coming soon
            </span>
          </div>

          <div>
            <p className="text-overline mb-3 text-[var(--brand-accent)]">Your routine</p>
            <h2 className="text-h2 text-[var(--brand-ink)]">Recovery that fits your life</h2>
            <p className="text-body-lg mt-4 leading-relaxed text-[var(--brand-steel)]">
              A cold plunge at home means your recovery tool is always ready. No driving
              to a facility, no waiting for availability — just step outside and start.
            </p>

            <div className="mt-8 space-y-5">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="text-overline mt-0.5 shrink-0 text-[var(--brand-accent)]">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-body font-medium text-[var(--brand-ink)]">{item.title}</p>
                    <p className="text-body-sm mt-0.5 text-[var(--brand-steel)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
