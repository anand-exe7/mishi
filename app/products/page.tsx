"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Minus, ShoppingCart, Search, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProductStore, useCartStore } from "@/store/store";
import { toast } from "react-hot-toast";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [cartSuccessDetails, setCartSuccessDetails] = useState<any>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search");

  const { products, fetchProducts, loading, error } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (urlSearch) {
      setSearchFilter(urlSearch);
    }
  }, [urlSearch]);

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

  const filteredProducts = products.filter((p) => {
    if (p.isActive === false) return false;
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.nameTa && p.nameTa.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  });

  const popUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: Math.min(i * 0.04, 0.4),
        type: "spring" as const,
        stiffness: 150,
        damping: 15,
      },
    }),
  };

  return (
    <div className="bg-zinc-50 min-h-screen font-sans selection:bg-amber-600/30 selection:text-amber-900 overflow-x-hidden">
      {/* Hero Header */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-10 sm:pb-16 px-4 sm:px-6 md:px-16 bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-amber-600 text-xs sm:text-sm tracking-[0.25em] uppercase mb-2 sm:mb-4 font-bold">
              The Complete Collection
            </h3>
            <h1 className={`text-3xl sm:text-5xl md:text-7xl text-zinc-900 mb-3 sm:mb-6 ${playfair.className}`}>
              Our Products
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto font-light text-xs sm:text-base leading-relaxed px-2">
              Every blend is a masterpiece of tradition, meticulously handcrafted to bring peace and divinity to your sacred spaces.
            </p>

            {/* In-page Search Bar for quick filtering */}
            <div className="mt-6 sm:mt-8 max-w-md mx-auto relative px-2">
              <input
                type="text"
                placeholder="Filter by product name, category..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-zinc-100 border border-zinc-200 rounded-full py-2.5 sm:py-3 pl-10 pr-10 text-xs sm:text-sm outline-none focus:border-amber-600 focus:bg-white transition-all shadow-inner"
              />
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 sm:py-16 md:py-24 px-3 sm:px-6 md:px-16 max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent animate-spin rounded-full mb-3"></div>
            <p className="text-zinc-500 font-medium text-xs sm:text-sm">Fetching spiritual collections...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold text-base mb-2">Error loading products</p>
            <p className="text-zinc-500 text-xs">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 max-w-md mx-auto p-8">
            <p className="text-zinc-600 font-bold text-base mb-2">No matching products found</p>
            <p className="text-zinc-400 text-xs mb-4">Try adjusting your search filter or view all items.</p>
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="bg-amber-600 text-white text-xs font-bold px-5 py-2 rounded-full"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product, i) => {
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
                  className="group flex flex-col bg-white border border-zinc-200/80 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative h-full justify-between"
                >
                  <div>
                    <div className="w-full aspect-square sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden mb-2.5 sm:mb-4 relative bg-zinc-50">
                      <img
                        src={product.imageUrl || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      <div className="hidden sm:flex absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-full text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 shadow-md">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                    <div className="px-1 flex flex-col">
                      <span className="text-emerald-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 block">
                        {product.category || "Herbal"}
                      </span>
                      <h3 className={`text-xs sm:text-xl lg:text-2xl text-zinc-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors font-bold ${playfair.className}`}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="hidden sm:block text-zinc-500 text-xs sm:text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-1 pt-2 sm:pt-4 border-t border-zinc-100 mt-2 flex items-center justify-between">
                    <span className="text-zinc-900 font-bold text-xs sm:text-base">
                      From ₹{lowestPrice}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      View
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => {
              setSelectedProduct(null);
              setQty(1);
              setSelectedSize("");
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-[2rem] flex flex-col md:flex-row shadow-2xl relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setQty(1);
                  setSelectedSize("");
                }}
                className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-colors shadow-md border border-zinc-200"
              >
                <X size={18} />
              </button>

              {/* Product Image */}
              <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto shrink-0 relative bg-zinc-100/60 p-4 flex items-center justify-center">
                <img
                  src={selectedProduct.imageUrl || "/placeholder.jpg"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain max-h-[280px] md:max-h-full"
                />
              </div>

              {/* Product Details */}
              <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-amber-600 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1.5 block">
                    {selectedProduct.category || "Herbal Product"}
                  </span>
                  <h2 className={`text-2xl sm:text-3xl lg:text-4xl text-zinc-900 mb-3 font-bold ${playfair.className}`}>
                    {selectedProduct.name}
                  </h2>
                  <p className="text-zinc-600 font-light text-xs sm:text-sm mb-6 leading-relaxed">
                    {selectedProduct.description || "Traditional authentic Siddha product crafted for purity."}
                  </p>

                  <div className="space-y-4 sm:space-y-6 mb-6">
                    {/* Size Selection */}
                    {selectedProduct.predefinedOptions && selectedProduct.predefinedOptions.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block mb-2">
                          Select Size
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProduct.predefinedOptions.filter((opt: any) => opt.isAvailable !== false).map((opt: any) => (
                            <button
                              key={opt.label}
                              onClick={() => setSelectedSize(opt.label)}
                              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
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
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block mb-2">
                        Quantity
                      </span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-zinc-200 rounded-full bg-zinc-50 overflow-hidden">
                          <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center font-bold text-xs sm:text-sm text-zinc-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => setQty(qty + 1)}
                            className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-xl font-bold text-zinc-900">
                          ₹{getSelectedPrice()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    addItem(selectedProduct, qty, selectedSize);
                    
                    toast.custom((t) => (
                      <div
                        className={`${
                          t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-sm w-full bg-zinc-900 shadow-2xl rounded-2xl pointer-events-auto flex items-center p-3.5 gap-3 border border-zinc-800`}
                      >
                        <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                          <ShoppingCart size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white">
                            Added to cart
                          </p>
                          <p className="text-[10px] text-zinc-400 line-clamp-1">
                            {qty}x {selectedProduct.name}
                          </p>
                        </div>
                        <Link 
                          href="/cart"
                          className="bg-white text-zinc-900 px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors shrink-0"
                          onClick={() => toast.dismiss(t.id)}
                        >
                          View Cart
                        </Link>
                      </div>
                    ), { position: 'bottom-center', duration: 4000 });

                    setCartSuccessDetails({ product: selectedProduct, qty, selectedSize });
                    setSelectedProduct(null);
                    setQty(1);
                    setSelectedSize("");
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-full uppercase tracking-widest text-xs transition-colors shadow-lg shadow-amber-600/20"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Success Modal */}
      <AnimatePresence>
        {cartSuccessDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartSuccessDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl relative p-6 sm:p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={30} />
              </div>
              <h3 className={`text-2xl sm:text-3xl text-zinc-900 mb-2 ${playfair.className}`}>Added to Cart!</h3>
              <p className="text-zinc-500 mb-6 font-light text-xs sm:text-sm">
                You have successfully added <strong className="text-zinc-900">{cartSuccessDetails.qty}x {cartSuccessDetails.product.name}</strong> 
                {cartSuccessDetails.selectedSize && ` (${cartSuccessDetails.selectedSize})`} to your cart.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setCartSuccessDetails(null)}
                  className="px-5 py-3 rounded-full border border-zinc-200 text-zinc-600 font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-colors w-full sm:w-auto flex-1"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/cart"
                  className="px-5 py-3 rounded-full bg-amber-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20 text-center w-full sm:w-auto flex-1"
                >
                  Go to Checkout
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full bg-[#faf9f6]">
        <div className="py-6 px-4 md:px-12 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider flex flex-col md:flex-row justify-between items-center gap-3 text-center">
          <div>© 2026 Mishi Pooja Products. All Rights Reserved</div>
          <div>Powered by <a href="https://www.cenexasystems.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Cenexa Systems</a></div>
          <div>PURE • ORGANIC • PROVEN</div>
        </div>
        <div className="w-full h-2 bg-[#3f3f46]"></div>
      </footer>
    </div>
  );
}

