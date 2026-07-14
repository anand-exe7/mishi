"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Minus, User, ShoppingCart } from "lucide-react";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"] });

const allProducts = [
  {
    name: "Cup Sambrani",
    desc: "A traditional aromatic product used in many homes to create a pure and peaceful environment.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg",
  },
  {
    name: "Computer Sambrani",
    desc: "A modern and convenient form of traditional sambrani.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-4.jpg",
  },
  {
    name: "Cone Sambrani",
    desc: "Crafted to spread a rich and soothing fragrance.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr1.jpg",
  },
  {
    name: "Dhoop Sticks",
    desc: "Known for their rich and long-lasting fragrance.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr2.jpg",
  },
  {
    name: "Agarbathi",
    desc: "Creates a calm, refreshing, and spiritually uplifting atmosphere.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr3.jpg",
  },
  {
    name: "Camphor",
    desc: "A powerful and sacred element widely used in spiritual rituals.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg",
  },
  {
    name: "Sacred Sandalwood Dhoop",
    desc: "Deep, woody, and grounding. Ideal for intense meditation and spiritual focus.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr5.jpg",
  },
  {
    name: "Divine Rose Incense",
    desc: "Soft, floral, and uplifting. Creates an aura of love, peace, and gentle positivity.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img1.jpg",
  },
  {
    name: "Mystic Loban Cup",
    desc: "Rich, earthy, and cleansing. Traditionally used to purify spaces and ward off negativity.",
    img: "https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/img2.jpg",
  },
];

export default function ProductsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("250g");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const popUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 150,
        damping: 15,
      },
    }),
  };

  return (
    <div className="bg-zinc-50 min-h-screen font-sans selection:bg-amber-600/30 selection:text-amber-900 overflow-x-hidden">
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

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 md:px-16 bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-amber-600 text-sm tracking-[0.3em] uppercase mb-4 font-bold">
              The Complete Collection
            </h3>
            <h1
              className={`text-5xl md:text-7xl text-zinc-900 mb-6 ${playfair.className}`}
            >
              Our Products
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto font-light text-lg">
              Every blend is a masterpiece of tradition, meticulously handcrafted to bring peace and divinity to your sacred spaces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProducts.map((product, i) => (
            <motion.div
              key={product.name}
              custom={i}
              variants={popUpVariants}
              initial="hidden"
              animate="visible"
              onClick={() => setSelectedProduct(product)}
              className="group flex flex-col bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
            >
              <div className="w-full h-72 overflow-hidden relative bg-zinc-100">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1 bg-white">
                <h3
                  className={`text-3xl text-zinc-900 mb-3 group-hover:text-amber-600 transition-colors ${playfair.className}`}
                >
                  {product.name}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
                  {product.desc}
                </p>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-auto">
                  <span className="text-zinc-900 font-bold text-lg">
                    From ₹149
                  </span>
                  <button className="text-xs uppercase tracking-widest font-bold text-amber-600 hover:text-amber-700 flex items-center gap-2">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedProduct(null);
              setQty(1);
              setSelectedSize("250g");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setQty(1);
                  setSelectedSize("250g");
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-colors shadow-sm"
              >
                <Plus className="rotate-45" size={24} />
              </button>

              {/* Product Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-zinc-100">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-amber-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">
                  Premium Quality
                </span>
                <h2
                  className={`text-3xl md:text-5xl text-zinc-900 mb-4 ${playfair.className}`}
                >
                  {selectedProduct.name}
                </h2>
                <p className="text-zinc-600 font-light mb-8 leading-relaxed">
                  {selectedProduct.desc}
                </p>

                <div className="space-y-6 mb-8">
                  {/* Size Selection */}
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 block mb-3">
                      Select Size
                    </span>
                    <div className="flex gap-3">
                      {["100g", "250g", "500g"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
                            selectedSize === size
                              ? "border-amber-600 bg-amber-50 text-amber-700"
                              : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 block mb-3">
                      Quantity
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-zinc-200 rounded-full bg-zinc-50 overflow-hidden">
                        <button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="px-4 py-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-zinc-900">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(qty + 1)}
                          className="px-4 py-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-2xl font-bold text-zinc-900">
                        ₹
                        {selectedSize === "100g"
                          ? 149 * qty
                          : selectedSize === "250g"
                          ? 299 * qty
                          : 499 * qty}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-full uppercase tracking-widest text-sm transition-colors shadow-lg shadow-amber-600/20">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
