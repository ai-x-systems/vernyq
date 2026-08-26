import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  overline?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  overline,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {overline && <p className="text-overline mb-3 text-[var(--brand-accent)]">{overline}</p>}
      <h2 className="text-h2 text-[var(--brand-ink)]">{title}</h2>
      {description && (
        <p className="text-body-lg mt-4 leading-relaxed text-[var(--brand-steel)]">
          {description}
        </p>
      )}
    </div>
  );
}
