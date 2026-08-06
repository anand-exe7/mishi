"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Do not render footer on admin, login, or invoice pages
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/invoice")
  ) {
    return null;
  }

  return (
    <footer className="bg-[#121611] pt-12 sm:pt-16 pb-6 px-4 sm:px-6 lg:px-8 text-white/80 border-t border-white/10 print:hidden w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12 border-b border-white/10 pb-8 sm:pb-12">
        
        <div className="sm:col-span-2">
          <div className="bg-white/95 p-3 rounded-2xl inline-block border border-white/20 shadow-md mb-4 sm:mb-6">
            <img
              src="/logo.webp"
              alt="Mishi Pooja Products"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm font-light">
            Bringing you the divine essence of pure, hand-crafted Siddha herbs and natural resins. Create a peaceful sanctuary in your everyday life.
          </p>
        </div>

        <div>
          <h4 className="text-white font-extrabold mb-4 text-xs sm:text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-emerald-400 transition-colors">Shop Products</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-emerald-400 transition-colors">Cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-extrabold mb-4 text-xs sm:text-sm uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-white/70 font-light">
            <li className="font-bold text-white">+91 80561 01114</li>
            <li>mishipoojaproducts@gmail.com</li>
            <li className="leading-snug">Padasallai street, Lake Road, near to spicot, Chembarambakkam, Tamil Nadu 600123</li>
          </ul>
        </div>

      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest pt-2">
        
        <div className="text-center md:text-left">
          © 2026 MISHI POOJA PRODUCTS. ALL RIGHTS RESERVED.
        </div>

        <div className="text-center">
          POWERED BY{" "}
          <a
            href="https://www.cenexasystems.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-black hover:text-emerald-400 transition-colors underline underline-offset-4"
          >
            CENEXA SYSTEMS
          </a>{" "}
          © 2026
        </div>

        <div className="text-center md:text-right text-emerald-400 font-extrabold">
          ORGANIC • PURE • NATURAL
        </div>

      </div>
    </footer>
  );
}

