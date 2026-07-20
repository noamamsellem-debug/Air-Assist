/** Titre de section homogène : eyebrow + H2 + intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-prose text-center" : "max-w-prose"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-display-md">{title}</h2>
      {intro && <p className="mt-4 text-prose text-ink-600">{intro}</p>}
    </div>
  );
}
