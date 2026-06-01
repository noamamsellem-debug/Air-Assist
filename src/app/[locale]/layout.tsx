import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieBanner } from "@/components/CookieBanner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
      description:
        "Réclamation d'indemnités pour vols retardés, annulés ou surbookés (EC 261/2004).",
      areaServed: "EU",
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
    <html lang={locale}>
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
