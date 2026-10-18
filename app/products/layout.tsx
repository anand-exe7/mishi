import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse the complete range of Mishi Pooja Products — authentic Siddha herbal powders, pooja items, sambrani cups, incense sticks, deepam oils and more. Freshly packed and shipped from Chennai.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "All Products · Mishi Pooja Products",
    description:
      "Browse the complete range of authentic Siddha herbal and pooja products — sambrani, incense, herbal powders, deepam oils and more.",
    url: "/products",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products · Mishi Pooja Products",
    description:
      "Browse the complete range of authentic Siddha herbal and pooja products.",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
