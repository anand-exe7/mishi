"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { User, ShoppingCart, LogOut, Package, MapPin, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function ProfilePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle this to see the two states!

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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 p-4 px-6 md:px-12 grid grid-cols-2 md:grid-cols-3 items-center transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-zinc-200/50 py-3 text-zinc-900"
            : "bg-white border-b border-zinc-200 py-6 text-zinc-900"
        }`}
      >
        {/* Left Links */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold justify-start">
          <Link href="/" className="transition-colors hover:text-amber-600">
            Home
          </Link>
          <Link href="/#about" className="transition-colors hover:text-amber-600">
            About
          </Link>
          <Link href="/#exports" className="transition-colors hover:text-amber-600">
            Exports
          </Link>
        </div>

        {/* Center Logo */}
        <div className="flex justify-start md:justify-center">
          <Link href="/">
            <div className="transition-all duration-300 cursor-pointer flex items-center">
              <span className={`text-2xl font-bold tracking-widest ${playfair.className} uppercase text-zinc-900`}>
                Mishi
              </span>
            </div>
          </Link>
        </div>

        {/* Right Links & Button */}
        <div className="flex gap-6 md:gap-8 text-sm uppercase tracking-widest font-semibold justify-end items-center">
          <Link href="/products" className="hidden md:block transition-colors hover:text-amber-600">
            Products
          </Link>
          <Link href="/profile" className="transition-colors hover:text-amber-600 text-amber-600">
            <User size={20} />
          </Link>
          <Link href="/cart" className="transition-colors relative hover:text-amber-600">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              2
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-40 pb-24 px-6 md:px-16 max-w-[1400px] mx-auto min-h-[80vh] flex items-center justify-center">
        {!isLoggedIn ? (
          /* LOGIN FORM */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-zinc-100"
          >
            <div className="text-center mb-8">
              <h1 className={`text-4xl text-zinc-900 mb-2 ${playfair.className}`}>Welcome Back</h1>
              <p className="text-zinc-500 font-light">Sign in to manage your orders</p>
            </div>

            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold py-3.5 rounded-xl transition-colors mb-6 shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
              <span className="relative bg-white px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Or Sign In with Email</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Email Address</label>
                <input required type="email" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors" placeholder="hello@example.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Password</label>
                <input required type="password" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors" placeholder="••••••••" />
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-xs text-amber-600 font-bold hover:underline">Forgot Password?</a>
              </div>
              <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-colors shadow-lg mt-4">
                Sign In
              </button>
            </form>
          </motion.div>
        ) : (
          /* USER PROFILE */
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
              <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-500 transition-colors bg-white px-6 py-3 rounded-full border border-zinc-200 shadow-sm">
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar Menu */}
              <div className="lg:col-span-1 space-y-3">
                {[
                  { name: "Order History", icon: Package, active: true },
                  { name: "Saved Addresses", icon: MapPin, active: false },
                  { name: "Account Settings", icon: Settings, active: false },
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
        )}
      </section>
    </div>
  );
}
