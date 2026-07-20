import type { ReactNode } from "react";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieBanner } from "@/components/CookieBanner";

/**
 * Polices auto-hébergées par next/font (aucune requête vers Google, pas de
 * FOUT) et exposées en variables CSS consommées par tailwind.config.ts.
 * `display: "swap"` + sous-ensemble latin : coût réseau minimal.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // NB : le canonical et les hreflang sont définis PAR PAGE (src/lib/seo.ts),
  // pas ici, sinon toutes les pages pointeraient vers l'accueil.
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: "Air Assist — Indemnités de vol EC 261/2004", template: "%s · Air Assist" },
    description:
      "Réclamez vos indemnités de vol retardé, annulé ou surbooké (EC 261/2004). Estimation gratuite, sans gain sans frais.",
    applicationName: "Air Assist",
    formatDetection: { telephone: false },
    robots: { index: true, follow: true },
    openGraph: { siteName: "Air Assist", type: "website", locale },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Air Assist",
      url: `${SITE_URL}/${locale}`,
      logo: `${SITE_URL}/airassist-logo.png`,
      description:
        "Réclamation d'indemnités pour vols retardés, annulés ou surbookés (EC 261/2004).",
      areaServed: "EU",
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@airassist.eu",
        contactType: "customer support",
        availableLanguage: ["fr", "en", "es", "de", "it"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Air Assist",
      url: `${SITE_URL}/${locale}`,
      inLanguage: locale,
    },
  ];

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
