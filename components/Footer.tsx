"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Do not render footer on admin, login, or invoice pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/invoice")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#2C392A] text-white/80 border-t border-emerald-900/40 print:hidden">
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-12 text-[10px] md:text-xs font-bold uppercase tracking-wider flex flex-col md:flex-row justify-between items-center gap-3 text-center">
        <div>© 2026 Mishi Pooja Products. All Rights Reserved</div>
        <div>
          Powered by{" "}
          <a
            href="https://www.cenexasystems.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 hover:text-white transition-colors underline decoration-emerald-500/50 underline-offset-4"
          >
            Cenexa Systems
          </a>{" "}
          © 2026
        </div>
        <div className="text-emerald-400">PURE • ORGANIC • PROVEN</div>
      </div>
    </footer>
  );
}
