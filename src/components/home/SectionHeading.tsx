/** Titre de section homogène : eyebrow coloré + H2 + intro. */
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
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow">✈ {eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-lg text-slate-600">{intro}</p>}
    </div>
  );
}
