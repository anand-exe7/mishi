"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Minus, User, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useProductStore, useCartStore } from "@/store/store";
import { toast } from "react-hot-toast";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function ProductsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const { products, fetchProducts, loading, error } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When a product is selected, default to its first available size option
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.predefinedOptions && selectedProduct.predefinedOptions.length > 0) {
        const availableOptions = selectedProduct.predefinedOptions.filter((opt: any) => opt.isAvailable !== false);
        if (availableOptions.length > 0) {
          setSelectedSize(availableOptions[0].label);
        } else {
          setSelectedSize(selectedProduct.unitLabel || "unit");
        }
      } else {
        setSelectedSize(selectedProduct.unitLabel || "unit");
      }
    }
  }, [selectedProduct]);

  // Find price for the selected size
  const getSelectedPrice = () => {
    if (!selectedProduct) return 0;
    if (selectedProduct.predefinedOptions && selectedProduct.predefinedOptions.length > 0) {
      const option = selectedProduct.predefinedOptions.find((opt: any) => opt.label === selectedSize);
      return (option ? option.price : selectedProduct.price) * qty;
    }
    return selectedProduct.price * qty;
  };

  const popUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
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
             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white"></span>
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent animate-spin rounded-full mb-4"></div>
            <p className="text-zinc-500 font-medium">Fetching spiritual collections...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold text-lg mb-2">Error loading products</p>
            <p className="text-zinc-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No products found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.isActive !== false).map((product, i) => {
              const availableOptions = product.predefinedOptions ? product.predefinedOptions.filter((opt: any) => opt.isAvailable !== false) : [];
              const lowestPrice = availableOptions.length > 0
                ? Math.min(...availableOptions.map((opt: any) => opt.price))
                : product.price;

              return (
                <motion.div
                  key={product.id}
                  custom={i}
                  variants={popUpVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setSelectedProduct(product)}
                  className="group flex flex-col bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
                >
                  <div className="w-full h-72 overflow-hidden relative bg-zinc-100">
                    <img
                      src={product.imageUrl || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 shadow-lg">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 bg-white">
                    <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 block">
                      {product.category}
                    </span>
                    <h3
                      className={`text-3xl text-zinc-900 mb-3 group-hover:text-amber-600 transition-colors ${playfair.className}`}
                    >
                      {product.name}
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-auto">
                      <span className="text-zinc-900 font-bold text-lg">
                        From ₹{lowestPrice}
                      </span>
                      <button className="text-xs uppercase tracking-widest font-bold text-amber-600 hover:text-amber-700 flex items-center gap-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
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
              setSelectedSize("");
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
                  setSelectedSize("");
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 hover:bg-zinc-100 transition-colors shadow-sm"
              >
                <Plus className="rotate-45" size={24} />
              </button>

              {/* Product Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-zinc-100">
                <img
                  src={selectedProduct.imageUrl || "/placeholder.jpg"}
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
                  {selectedProduct.description}
                </p>

                <div className="space-y-6 mb-8">
                  {/* Size Selection */}
                  {selectedProduct.predefinedOptions && selectedProduct.predefinedOptions.length > 0 && (
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 block mb-3">
                        Select Size
                      </span>
                      <div className="flex gap-3 flex-wrap">
                        {selectedProduct.predefinedOptions.filter((opt: any) => opt.isAvailable !== false).map((opt: any) => (
                          <button
                            key={opt.label}
                            onClick={() => setSelectedSize(opt.label)}
                            className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
                              selectedSize === opt.label
                                ? "border-amber-600 bg-amber-50 text-amber-700"
                                : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                        ₹{getSelectedPrice()}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    addItem(selectedProduct, qty, selectedSize);
                    toast.success(`Added ${qty}x ${selectedProduct.name} (${selectedSize}) to your cart!`);
                    setSelectedProduct(null);
                    setQty(1);
                    setSelectedSize("");
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-full uppercase tracking-widest text-sm transition-colors shadow-lg shadow-amber-600/20"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full bg-[#faf9f6]">
        <div className="py-6 px-6 md:px-12 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div>© 2026 Mishi Pooja Products. All Rights Reserved</div>
          <div>Powered by <a href="https://www.cenexasystems.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Cenexa Systems</a> © 2026</div>
          <div>PURE • ORGANIC • PROVEN</div>
        </div>
        <div className="w-full h-3 bg-[#3f3f46]"></div>
      </footer>
    </div>
  );
}
