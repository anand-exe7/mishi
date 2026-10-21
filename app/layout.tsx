import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://mishipoojaproducts.com";
const SITE_NAME = "Mishi Pooja Products";
const SITE_DESC =
  "Mishi Pooja Products — Chennai-based manufacturer and exporter of authentic Siddha herbal remedies, pooja items, sambrani resins and traditional incense.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Authentic Siddha Herbal & Pooja Store`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "Mishi Pooja Products",
    "Siddha herbal",
    "sambrani",
    "pooja items",
    "incense",
    "herbal powder",
    "deepam oil",
    "Chennai pooja store",
    "authentic Siddha remedies",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  // Icons are picked up automatically from app/icon.webp and app/apple-icon.webp
  // (Next.js file-based convention). No manual icons block needed.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Authentic Siddha Herbal & Pooja Store`,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/org_logo.jpeg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Authentic Siddha Herbal & Pooja Store`,
    description: SITE_DESC,
    images: ["/org_logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import GlobalNav from "../components/GlobalNav";
import ScrollToTop from "../components/ScrollToTop";
import Footer from "../components/Footer";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/org_logo.jpeg`,
  description: SITE_DESC,
  sameAs: ["https://www.instagram.com/mishi_sambrani/"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "TN",
    addressCountry: "IN",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between">
        <link rel="preload" as="image" href="/org_logo.jpeg" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ScrollToTop />
        <GlobalNav />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
