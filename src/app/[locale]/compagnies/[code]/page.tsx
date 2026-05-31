import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { COMPAGNIES_SEO, getCompagnieSeo } from "@/data/compagnies";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COMPAGNIES_SEO.map((c) => ({ locale, code: c.code.toLowerCase() })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { code } = await params;
  const c = getCompagnieSeo(code);
  if (!c) return {};
  return {
    title: `Indemnisation vol ${c.nom} (EC 261/2004)`,
    description: `Réclamez votre indemnité pour un vol ${c.nom} retardé, annulé ou surbooké. Estimation gratuite, sans gain sans frais.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);
  const c = getCompagnieSeo(code);
  if (!c) notFound();
  const n = await getTranslations("nav");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Indemnisation vol ${c.nom}`,
    provider: { "@type": "Organization", name: "Air Assist" },
    areaServed: "EU",
    description: `Réclamation d'indemnité EC 261/2004 pour les vols ${c.nom}.`,
    url: `${SITE_URL}/${locale}/compagnies/${c.code.toLowerCase()}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Air Assist</Link> · {c.nom}
      </nav>
      <h1 className="mt-2 text-3xl font-bold">
        Vol {c.nom} retardé ou annulé : votre indemnité
      </h1>
      <p className="mt-4 text-slate-600">
        Un vol {c.nom} retardé de plus de 3 heures, annulé ou surbooké peut ouvrir droit à une
        indemnité de 250 € à 600 € au titre du règlement européen EC 261/2004.
      </p>
      <div className="card mt-6">
        <p>Procédure habituelle : <strong>{c.procedure}</strong></p>
        <p className="mt-1">Délai de réponse moyen : ~{c.delaiMoyenJours} jours</p>
      </div>
      <p className="mt-6">
        <Link href="/reclamation" className="btn-primary">{n("startClaim")}</Link>
      </p>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Autres compagnies</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {COMPAGNIES_SEO.filter((x) => x.code !== c.code).map((x) => (
            <li key={x.code}>
              <Link
                href={`/compagnies/${x.code.toLowerCase()}`}
                className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200"
              >
                {x.nom}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
