"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, ShoppingCart, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function GlobalNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar on admin or login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full px-4 md:px-5 py-2 flex items-center justify-between transition-all duration-500 bg-white/95 backdrop-blur-xl shadow-lg border border-white/50"
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <Link href="/">
            <img src="/logo.webp" alt="Mishi" className="h-6 md:h-8 w-auto object-contain" />
          </Link>
        </div>
        
        <div className={`hidden md:flex gap-8 text-xs uppercase tracking-widest font-semibold text-neutral-800`}>
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <Link href="/#about" className="hover:text-emerald-600 transition-colors">About</Link>
          <Link href="/#products" className="hover:text-emerald-600 transition-colors">Categories</Link>
          <Link href="/products" className="hover:text-emerald-600 transition-colors">Shop</Link>
        </div>

        <div className={`flex gap-4 items-center text-neutral-800`}>
          <div className="hidden md:flex gap-4">
            <Link href="/profile" className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors"><User size={18} /></Link>
            <Link href="/cart" className="flex items-center gap-2 p-2 hover:bg-emerald-500/10 rounded-full transition-colors relative">
              <span className="text-xs uppercase tracking-widest font-semibold">CART</span>
              <div className="relative">
                <ShoppingCart size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-600 rounded-full"></span>
              </div>
            </Link>
          </div>
          
          <button 
            className="md:hidden p-2 hover:bg-emerald-500/10 rounded-full transition-colors text-emerald-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[95%] z-40 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl border border-neutral-100 p-6 md:hidden flex flex-col gap-6 items-center"
          >
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest font-semibold text-neutral-800 hover:text-emerald-600">Home</Link>
            <Link href="/#about" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest font-semibold text-neutral-800 hover:text-emerald-600">About</Link>
            <Link href="/#products" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest font-semibold text-neutral-800 hover:text-emerald-600">Categories</Link>
            <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-widest font-semibold text-neutral-800 hover:text-emerald-600">Shop</Link>
            <div className="w-full h-[1px] bg-neutral-200"></div>
            <div className="flex gap-8">
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-neutral-800 hover:text-emerald-600">
                <User size={18} /> Profile
              </Link>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-neutral-800 hover:text-emerald-600">
                <ShoppingCart size={18} /> CART
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
