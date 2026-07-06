"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { User, ShoppingCart, Trash2, ArrowRight, Plus, Minus } from "lucide-react";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function CartPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [qty1, setQty1] = useState(1);
  const [size1, setSize1] = useState("250g");
  
  const [qty2, setQty2] = useState(1);
  const [size2, setSize2] = useState("100g");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919876543210"; 
    const message = `Hello Mishi Pooja Products!\n\nI would like to place an order.\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\n*Order Summary:*\n- ${qty1}x Cup Sambrani (${size1}) - ₹${size1==="100g"?149*qty1:size1==="250g"?299*qty1:499*qty1}\n- ${qty2}x Pure Camphor (${size2}) - ₹${size2==="100g"?149*qty2:size2==="250g"?299*qty2:499*qty2}\n\n*Total:* ₹${(size1==="100g"?149*qty1:size1==="250g"?299*qty1:499*qty1) + (size2==="100g"?149*qty2:size2==="250g"?299*qty2:499*qty2)}\n\nPlease confirm my order. Thank you!`;
    
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, "_blank");
  };

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
          <Link href="/profile" className="transition-colors hover:text-amber-600">
            <User size={20} />
          </Link>
          <Link href="/cart" className="transition-colors hover:text-amber-600 text-amber-600 relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              2
            </span>
          </Link>
        </div>
      </nav>

      {/* Cart Content */}
      <section className="pt-40 pb-24 px-6 md:px-16 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className={`text-4xl md:text-5xl text-zinc-900 ${playfair.className}`}>
            Your Shopping Cart
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-zinc-100 rounded-2xl overflow-hidden shrink-0">
                <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg" alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-zinc-900">Cup Sambrani</h3>
                  <button className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 hover:bg-red-100 rounded-full">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  {/* Size Selector */}
                  <select 
                    value={size1}
                    onChange={(e) => setSize1(e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-700 outline-none focus:border-amber-500"
                  >
                    <option value="100g">100g</option>
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                  </select>

                  {/* Quantity Selector */}
                  <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                    <button onClick={() => setQty1(Math.max(1, qty1 - 1))} className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-bold text-zinc-900">{qty1}</span>
                    <button onClick={() => setQty1(qty1 + 1)} className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"><Plus size={14} /></button>
                  </div>
                  
                  <span className="font-bold text-lg text-amber-600 ml-auto">
                    ₹{size1 === "100g" ? 149 * qty1 : size1 === "250g" ? 299 * qty1 : 499 * qty1}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-zinc-100 rounded-2xl overflow-hidden shrink-0">
                <img src="https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg" alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-zinc-900">Pure Camphor</h3>
                  <button className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 hover:bg-red-100 rounded-full">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  {/* Size Selector */}
                  <select 
                    value={size2}
                    onChange={(e) => setSize2(e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-700 outline-none focus:border-amber-500"
                  >
                    <option value="100g">100g</option>
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                  </select>

                  {/* Quantity Selector */}
                  <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                    <button onClick={() => setQty2(Math.max(1, qty2 - 1))} className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-bold text-zinc-900">{qty2}</span>
                    <button onClick={() => setQty2(qty2 + 1)} className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"><Plus size={14} /></button>
                  </div>
                  
                  <span className="font-bold text-lg text-amber-600 ml-auto">
                    ₹{size2 === "100g" ? 149 * qty2 : size2 === "250g" ? 299 * qty2 : 499 * qty2}
                  </span>
                </div>
              </div>
            </div>
            

          </div>

          {/* Checkout Form & Summary */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm sticky top-32">
              <h2 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-widest text-sm border-b border-zinc-100 pb-4">
                Delivery Details
              </h2>
              
              <form onSubmit={handleCheckout} className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Full Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-400" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Mobile Number</label>
                  <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-400" placeholder="e.g. +91 98765 43210" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Complete Address</label>
                  <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors min-h-[100px] resize-none placeholder-zinc-400" placeholder="Door No, Street Name, City, Pincode"></textarea>
                </div>

                <div className="border-t border-zinc-100 pt-6 mt-6 space-y-4">
                  <div className="flex gap-4">
                    <input type="text" placeholder="Enter Coupon Code" className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder-zinc-400" />
                    <button type="button" className="bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">Apply</button>
                  </div>

                  <div className="flex justify-between text-sm text-zinc-500 pt-2">
                    <span>Subtotal</span>
                    <span>₹{(size1==="100g"?149*qty1:size1==="250g"?299*qty1:499*qty1) + (size2==="100g"?149*qty2:size2==="250g"?299*qty2:499*qty2)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-zinc-500">Delivery</span>
                    <span className="font-bold text-red-500">Calculated on WhatsApp</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-zinc-900 pt-3 border-t border-zinc-100">
                    <span>Total</span>
                    <span className="text-amber-600">₹{(size1==="100g"?149*qty1:size1==="250g"?299*qty1:499*qty1) + (size2==="100g"?149*qty2:size2==="250g"?299*qty2:499*qty2)}</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-colors shadow-lg shadow-emerald-500/20 mt-6 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg> Order via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
