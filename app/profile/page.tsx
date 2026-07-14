"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { User, ShoppingCart, LogOut, Package, ChevronRight } from "lucide-react";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function ProfilePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-zinc-50 min-h-screen font-sans selection:bg-amber-600/30 selection:text-amber-900">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-xl shadow-lg border border-white/50" : "bg-white/50 backdrop-blur-md border border-white/20 shadow-sm"}`}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <Link href="/">
            <img src="/logo.webp" alt="Mishi" className="h-8 md:h-10 w-auto object-contain" />
          </Link>
        </div>
        
        <div className={`hidden md:flex gap-8 text-xs uppercase tracking-widest font-semibold text-neutral-800`}>
           <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
           <Link href="/#about" className="hover:text-emerald-600 transition-colors">Heritage</Link>
           <Link href="/#products" className="hover:text-emerald-600 transition-colors">Collection</Link>
           <Link href="/products" className="hover:text-emerald-600 transition-colors">Products</Link>
        </div>

        <div className={`flex gap-4 items-center text-neutral-800`}>
          <Link href="/profile" className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors"><User size={18} /></Link>
          <Link href="/cart" className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors relative">
             <ShoppingCart size={18} />
             <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-600 rounded-full"></span>
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <section className="pt-40 pb-24 px-6 md:px-16 max-w-[1400px] mx-auto min-h-[80vh] flex items-center justify-center">
          {/* USER PROFILE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-3xl font-bold shadow-inner">
                  A
                </div>
                <div>
                  <h1 className={`text-4xl text-zinc-900 ${playfair.className}`}>Anand Client</h1>
                  <p className="text-zinc-500 mt-1">anand.client@example.com</p>
                </div>
              </div>
              <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-500 transition-colors bg-white px-6 py-3 rounded-full border border-zinc-200 shadow-sm">
                <LogOut size={16} /> Sign Out
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar Menu */}
              <div className="lg:col-span-1 space-y-3">
                {[
                  { name: "Order History", icon: Package, active: true },
                ].map((item) => (
                  <button key={item.name} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? "bg-amber-50 border-amber-200 text-amber-700 font-bold border" : "bg-white border-zinc-100 text-zinc-600 hover:bg-zinc-50 border"}`}>
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      {item.name}
                    </div>
                    <ChevronRight size={16} className={item.active ? "text-amber-500" : "text-zinc-300"} />
                  </button>
                ))}
              </div>

              {/* Order History */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
                  <h2 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-widest text-sm border-b border-zinc-100 pb-4">Recent Orders</h2>
                  
                  <div className="space-y-6">
                    {/* Order 1 */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-zinc-100 rounded-2xl hover:border-amber-200 transition-colors bg-zinc-50/50">
                      <div className="w-24 h-24 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
                        <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg" alt="Order" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left w-full">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2 gap-2">
                          <div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">Delivered</span>
                            <h3 className="text-lg font-bold text-zinc-900 mt-3">Order #10293</h3>
                          </div>
                          <span className="text-xl font-bold text-zinc-900">₹897</span>
                        </div>
                        <p className="text-sm text-zinc-500">Placed on Oct 24, 2024</p>
                        <p className="text-sm text-zinc-600 mt-2">3x Cup Sambrani (250g)</p>
                      </div>
                    </div>

                    {/* Order 2 */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-zinc-100 rounded-2xl hover:border-amber-200 transition-colors bg-zinc-50/50">
                      <div className="w-24 h-24 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
                        <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg" alt="Order" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left w-full">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2 gap-2">
                          <div>
                            <span className="text-xs font-bold text-zinc-600 bg-zinc-200 px-3 py-1 rounded-full uppercase tracking-wider">Delivered</span>
                            <h3 className="text-lg font-bold text-zinc-900 mt-3">Order #09882</h3>
                          </div>
                          <span className="text-xl font-bold text-zinc-900">₹149</span>
                        </div>
                        <p className="text-sm text-zinc-500">Placed on Sep 12, 2024</p>
                        <p className="text-sm text-zinc-600 mt-2">1x Pure Camphor (100g)</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </section>
    </div>
  );
}
