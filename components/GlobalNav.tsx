"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  User,
  ShoppingCart,
  Menu,
  X,
  Search,
  ChevronRight,
  Home,
  Package,
  ShoppingBag,
  Globe,
  Sparkles,
  Layers,
  FlaskConical
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLangStore, useCartStore } from "@/store/store";
import { getT } from "@/lib/translations";

export default function GlobalNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLangStore();
  const t = getT(lang);

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    { name: "Pooja Powder", href: "/products?search=Powder" },
    { name: "Deepam Oil", href: "/products?search=Oil" },
    { name: "Incense & Dhoop", href: "/products?search=Incense" },
    { name: "Divine Kits", href: "/products?search=Kit" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on page change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  // Hide navbar on admin or login routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/products", label: t("nav.products"), icon: Package },
    {
      href: "/cart",
      label: t("nav.cart"),
      icon: ShoppingBag,
      badge: cartCount,
    },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-emerald-900/10 py-2.5 sm:py-3.5"
            : "bg-white/90 backdrop-blur-md border-b border-emerald-950/5 py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand Logo - Scaled Prominently */}
          <Link href="/" className="flex items-center shrink group min-w-0">
            <img
              src="/logo.webp"
              alt="Mishi"
              className="h-8 xs:h-10 sm:h-12 md:h-14 max-w-[170px] xs:max-w-[210px] sm:max-w-none w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Search Bar (visible on md+) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-4 relative"
          >
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700/60">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-50/50 border border-emerald-200/80 rounded-full py-2 pl-9 pr-20 text-xs sm:text-sm outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all text-emerald-950 font-medium"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-[#2C392A] text-white px-4 rounded-full font-bold text-xs hover:bg-[#1f281d] transition-colors"
            >
              Search
            </button>
          </form>

          {/* Desktop Nav Links (visible on lg+) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-zinc-700 shrink-0">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 hover:text-emerald-700 relative flex items-center gap-1.5 ${
                    isActive ? "text-emerald-800 font-black" : ""
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls (Language, Cart, Burger Menu Button) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Switcher Button - Always Visible */}
            <button
              onClick={() => setLang(lang === "en" ? "ta" : "en")}
              title="Switch Language"
              className="flex items-center gap-1 sm:gap-1.5 bg-[#2C392A] text-white rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-black hover:bg-[#1e271d] transition-all shadow-sm border border-emerald-500/20"
              aria-label="Language selector"
            >
              <Globe size={13} className="text-emerald-400 shrink-0" />
              <span>{lang === "en" ? "EN" : "தமிழ்"}</span>
            </button>

            {/* Shopping Cart Icon with Live Count Badge */}
            <Link
              href="/cart"
              className="p-1.5 sm:p-2 text-emerald-900 hover:text-emerald-700 transition-colors relative flex items-center justify-center rounded-full hover:bg-emerald-50 shrink-0"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="sm:w-5 sm:h-5 text-[#2C392A]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Main Burger Nav Button - Visible ONLY on Mobile & Tablet */}
            <button
              className="lg:hidden p-1.5 sm:p-2 bg-[#2C392A] hover:bg-[#1e271d] text-white rounded-xl transition-all shadow-md flex items-center gap-1 font-bold text-xs shrink-0 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Menu size={18} className="sm:w-5 sm:h-5" />
              )}
              <span className="hidden xs:inline font-extrabold text-[11px] sm:text-xs">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Burger Nav Drawer / Expanded Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Burger Nav Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[85%] max-w-md z-50 bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="p-4 sm:p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-emerald-100">
                  <img
                    src="/logo.webp"
                    alt="Mishi"
                    className="h-6 sm:h-8 max-w-[140px] xs:max-w-[170px] w-auto object-contain"
                  />
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 sm:p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors shrink-0"
                    aria-label="Close menu"
                  >
                    <X size={20} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative mb-5">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-emerald-50/60 border border-emerald-200/80 rounded-xl py-2.5 pl-9 pr-20 text-xs font-semibold text-emerald-950 outline-none focus:border-emerald-600 focus:bg-white"
                    />
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 bg-[#2C392A] hover:bg-[#1e271d] text-white font-bold text-[11px] sm:text-xs px-3 rounded-lg uppercase tracking-wider transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Navigation Links */}
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-3 px-1">
                    Navigation
                  </h3>
                  <div className="flex flex-col gap-2 font-bold text-zinc-800">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href);

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                            isActive
                              ? "bg-[#2C392A] text-white shadow-md"
                              : "hover:bg-emerald-50/60 text-emerald-950 bg-emerald-50/20 border border-emerald-100/60"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 text-sm font-extrabold">
                            <Icon
                              size={20}
                              className={
                                isActive ? "text-emerald-400" : "text-emerald-700"
                              }
                            />
                            <span>{link.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {link.badge !== undefined && link.badge > 0 && (
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                  isActive
                                    ? "bg-emerald-500 text-white"
                                    : "bg-emerald-700 text-white"
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}
                            <ChevronRight
                              size={18}
                              className={
                                isActive ? "text-white/80" : "text-emerald-400"
                              }
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Categories */}
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-3 px-1">
                    <Layers size={13} className="text-emerald-600" />
                    <span>Popular Categories</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                      >
                        <span className="text-xs font-bold text-emerald-950 block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          Browse <ChevronRight size={10} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-emerald-50/40 border-t border-emerald-100">
                <div className="flex items-center justify-between text-xs text-emerald-900 font-medium mb-3">
                  <span className="font-bold">Select Language</span>
                  <button
                    onClick={() => setLang(lang === "en" ? "ta" : "en")}
                    className="font-extrabold text-emerald-900 bg-emerald-200/60 hover:bg-emerald-200 px-3.5 py-1.5 rounded-full text-xs transition-colors border border-emerald-300"
                  >
                    {lang === "en" ? "தமிழ் (TA)" : "English (EN)"}
                  </button>
                </div>
                <div className="text-[11px] text-emerald-700 text-center font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles size={12} className="text-emerald-600" /> Mishi Sacred Products
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
