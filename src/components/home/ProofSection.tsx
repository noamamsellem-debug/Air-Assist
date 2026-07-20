import { getTranslations } from "next-intl/server";
import { statistiquesPubliques, identiteSociete } from "@/lib/preuve-sociale";

/**
 * Bloc de confiance — décisif sur ce marché.
 *
 * Trois briques indépendantes, chacune capable de disparaître proprement :
 *   • « sans gain, sans frais » — toujours affiché, traité comme un argument
 *     fort et non comme une note de bas de page ;
 *   • les compteurs — rendus uniquement si la base contient assez de dossiers
 *     RÉELS (cf. lib/preuve-sociale.ts) ;
 *   • l'identité société — rendue uniquement si les variables d'environnement
 *     sont renseignées. On ne publie pas un SIRET d'exemple.
 *
 * L'emplacement Trustpilot a un état vide assumé : on annonce que les avis
 * arrivent plutôt que d'afficher cinq étoiles sans avis derrière.
 */

function Etoiles({ note }: { note: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i <= note ? "fill-vol-500" : "fill-ink-200"}`}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

export async function ProofSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "proof" });
  const stats = await statistiquesPubliques();
  const societe = identiteSociete();

  const montantFormate = stats
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(stats.montantRecupereEur)
    : null;

  return (
    <section className="bg-ink-50">
      <div className="section">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* ── « Sans gain, sans frais » : l'argument, pas une astérisque ── */}
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 text-display-md">{t("noWinTitle")}</h2>
            <p className="mt-4 max-w-prose text-prose text-ink-600">{t("noWinText")}</p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { k: "upfront", v: t("upfrontValue") },
                { k: "commission", v: t("commissionValue") },
                { k: "iban", v: t("ibanValue") },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="font-display text-display-sm text-ink-900">{item.v}</dt>
                  <dd className="mt-1 text-sm text-ink-600">{t(`${item.k}Label`)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Avis + compteurs + identité ─────────────────────────────── */}
          <div className="space-y-5">
            {/* Avis Trustpilot — état vide élégant tant qu'il n'y en a pas. */}
            <div className="card">
              <div className="flex items-center justify-between gap-4">
                <span className="board-label text-ink-500">{t("reviewsTitle")}</span>
                <Etoiles note={0} />
              </div>
              <p className="mt-3 text-sm text-ink-600">{t("reviewsEmpty")}</p>
            </div>

            {/* Compteurs — présents seulement si des dossiers réels existent. */}
            {stats && montantFormate && (
              <div className="card grid grid-cols-2 gap-4">
                <div>
                  <p className="font-display text-display-sm text-vol-600">{montantFormate}</p>
                  <p className="mt-1 text-sm text-ink-600">{t("recoveredLabel")}</p>
                </div>
                <div>
                  <p className="font-display text-display-sm text-ink-900">
                    {stats.dossiersReverses}
                  </p>
                  <p className="mt-1 text-sm text-ink-600">{t("casesLabel")}</p>
                </div>
              </div>
            )}

            {/* Identité société — présente seulement si renseignée. */}
            {societe && (
              <div className="card">
                <span className="board-label text-ink-500">{t("companyTitle")}</span>
                <p className="mt-3 font-semibold text-ink-900">
                  {societe.raisonSociale} · {societe.formeJuridique}
                </p>
                <dl className="mt-2 space-y-1 font-mono text-xs text-ink-600">
                  <div className="flex gap-2">
                    <dt className="text-ink-400">SIRET</dt>
                    <dd>{societe.siret}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-400">{t("addressLabel")}</dt>
                    <dd>{societe.adresse}</dd>
                  </div>
                </dl>
                <a
                  href={`mailto:${societe.email}`}
                  className="mt-3 inline-block text-sm font-medium text-vol-700 underline underline-offset-2"
                >
                  {societe.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
