import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist on Mishi Pooja Products.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-[#F9F8F5]">
      <div className="max-w-md text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7DAA8F] mb-3">
          Error 404
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-[#2C392A] tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-[#5F6D59] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-[#2C392A] hover:bg-[#1e271d] text-white text-xs font-black uppercase tracking-widest shadow-md transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-full bg-white border border-[#2C392A]/20 hover:border-[#2C392A] text-[#2C392A] text-xs font-black uppercase tracking-widest transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}
