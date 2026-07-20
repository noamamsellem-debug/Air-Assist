import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalShell } from "@/components/LegalShell";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({
    locale,
    path: "/mentions-legales",
    title: t("mentionsTitle"),
    description: t("mentionsTitle"),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contenu />;
}

function Contenu() {
  const t = useTranslations("legal");
  return (
    <LegalShell title={t("mentionsTitle")}>
      <h2 className="text-xl font-semibold">Éditeur du site</h2>
      <p>
        Le site airassist.eu est édité par <strong>AirAssist</strong>, [forme juridique — À COMPLÉTER],
        au capital de [À COMPLÉTER] €, immatriculée au RCS de [ville — À COMPLÉTER] sous le numéro
        [À COMPLÉTER], dont le siège social est situé [adresse du siège — À COMPLÉTER].
        Numéro de TVA intracommunautaire : [À COMPLÉTER].
      </p>
      <h2 className="text-xl font-semibold">Directeur de la publication</h2>
      <p>[Nom du directeur de la publication — À COMPLÉTER].</p>
      <h2 className="text-xl font-semibold">Contact</h2>
      <p>E-mail : <a className="text-vol-700 hover:underline" href="mailto:info@airassist.eu">info@airassist.eu</a></p>
      <h2 className="text-xl font-semibold">Hébergeur</h2>
      <p>Le site est hébergé par [À COMPLÉTER — ex. Vercel Inc., adresse de l'hébergeur].</p>
      <h2 className="text-xl font-semibold">Activité</h2>
      <p>
        AirAssist agit en qualité d'intermédiaire mandaté par le passager pour la réclamation
        d'indemnités au titre du règlement (CE) n° 261/2004 et de toute réglementation applicable.
        AirAssist n'est ni une compagnie aérienne, ni un cabinet d'avocats.
      </p>
      <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus du site (textes, logo, marque « AirAssist », éléments graphiques,
        structure) est protégé par le droit de la propriété intellectuelle et demeure la propriété
        exclusive de l'éditeur. Toute reproduction ou représentation, totale ou partielle, sans
        autorisation préalable, est interdite.
      </p>
      <h2 className="text-xl font-semibold">Médiation de la consommation</h2>
      <p>
        Conformément aux articles L.612-1 et suivants du Code de la consommation, le consommateur
        peut recourir gratuitement à un médiateur de la consommation. Médiateur compétent :
        [À COMPLÉTER — nom et coordonnées du médiateur].
      </p>
    </LegalShell>
  );
}
