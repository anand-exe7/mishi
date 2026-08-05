"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Minus, ShoppingCart, Search, X, Check } from "lucide-react";
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
  const cartItems = useCartStore((state) => state.items);
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
      if (
        selectedProduct.predefinedOptions &&
        selectedProduct.predefinedOptions.length > 0
      ) {
        const availableOptions = selectedProduct.predefinedOptions.filter(
          (opt: any) => opt.isAvailable !== false,
        );
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
    if (
      selectedProduct.predefinedOptions &&
      selectedProduct.predefinedOptions.length > 0
    ) {
      const option = selectedProduct.predefinedOptions.find(
        (opt: any) => opt.label === selectedSize,
      );
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
    <div className="bg-[#F9F8F5] min-h-screen flex flex-col justify-between font-sans selection:bg-[#7DAA8F]/30 selection:text-[#2C392A] overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Header */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-10 sm:pb-16 px-4 sm:px-6 md:px-16 bg-white border-b border-emerald-900/10">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-emerald-700 text-xs sm:text-sm tracking-[0.25em] uppercase mb-2 sm:mb-4 font-extrabold">
              The Complete Collection
            </h3>
            <h1
              className={`text-3xl sm:text-5xl md:text-7xl text-emerald-950 mb-3 sm:mb-6 font-black ${playfair.className}`}
            >
              Our Sacred Products
            </h1>
            <p className="text-[#5F6D59] max-w-2xl mx-auto font-normal text-xs sm:text-base leading-relaxed px-2">
              Every blend is a masterpiece of Siddha tradition, meticulously
              handcrafted to bring peace and divinity to your sacred spaces.
            </p>

            {/* In-page Search Bar for quick filtering */}
            <div className="mt-6 sm:mt-8 max-w-md mx-auto relative px-2">
              <input
                type="text"
                placeholder="Filter by product name, category..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-emerald-50/40 border border-emerald-200/80 rounded-full py-2.5 sm:py-3 pl-10 pr-10 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner text-emerald-950 font-medium"
              />
              <Search
                size={16}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-700/60"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-900 p-1"
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
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent animate-spin rounded-full mb-3"></div>
            <p className="text-[#5F6D59] font-medium text-xs sm:text-sm">
              Fetching spiritual collections...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold text-base mb-2">
              Error loading products
            </p>
            <p className="text-zinc-500 text-xs">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-emerald-100 max-w-md mx-auto p-8 shadow-sm">
            <p className="text-emerald-950 font-bold text-base mb-2">
              No matching products found
            </p>
            <p className="text-zinc-500 text-xs mb-4">
              Try adjusting your search filter or view all items.
            </p>
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="bg-[#2C392A] text-white text-xs font-bold px-5 py-2 rounded-full"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product, i) => {
              const availableOptions = product.predefinedOptions
                ? product.predefinedOptions.filter(
                    (opt: any) => opt.isAvailable !== false,
                  )
                : [];
              const lowestPrice =
                availableOptions.length > 0
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
                  className="group flex flex-col bg-white border border-emerald-100 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative h-full justify-between"
                >
                  <div>
                    <div className="w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden mb-2.5 sm:mb-4 relative bg-[#F9F8F5]">
                      <img
                        src={product.imageUrl || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      <div className="hidden sm:flex absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-full text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 shadow-md">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                    <div className="px-1 flex flex-col">
                      <span className="text-emerald-700 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider mb-1 block">
                        {product.category || "Herbal"}
                      </span>
                      <h3
                        className={`text-xs sm:text-xl lg:text-2xl text-emerald-950 mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors font-bold ${playfair.className}`}
                      >
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="hidden sm:block text-[#5F6D59] text-xs sm:text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-1 pt-2 sm:pt-4 border-t border-emerald-100 mt-2 flex items-center justify-between">
                    <span className="text-emerald-950 font-black text-xs sm:text-base">
                      From ₹{lowestPrice}
                    </span>
                    {(() => {
                      const itemInCart = cartItems.find((i) => i.product.id === product.id);
                      if (itemInCart) {
                        return (
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-emerald-900 bg-emerald-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                            <Check size={10} className="text-emerald-800" /> In Cart ({itemInCart.quantity})
                          </span>
                        );
                      }
                      return (
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full group-hover:bg-[#2C392A] group-hover:text-white transition-colors">
                          View
                        </span>
                      );
                    })()}
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
              className="bg-white w-[94vw] max-w-2xl max-h-[85vh] sm:max-h-[88vh] rounded-3xl md:rounded-[2rem] flex flex-col md:flex-row shadow-2xl relative my-auto border border-emerald-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setQty(1);
                  setSelectedSize("");
                }}
                className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors shadow-md border border-emerald-200"
              >
                <X size={18} />
              </button>

              {/* Product Image Container - Perfect Full-View Display */}
              <div className="w-full md:w-5/12 bg-[#F7F6F0] relative shrink-0 h-52 sm:h-64 md:h-auto flex items-center justify-center p-3 sm:p-4 overflow-hidden border-b md:border-b-0 md:border-r border-emerald-100/60">
                <img
                  src={selectedProduct.imageUrl || "/placeholder.jpg"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                />
              </div>

              {/* Product Details - Scrollable Body + Fixed Sticky Footer */}
              <div className="w-full md:w-7/12 flex flex-col justify-between overflow-hidden bg-white">
                {/* Scrollable Content Body */}
                <div className="p-4 xs:p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                  {/* Category, Title, Price */}
                  <div>
                    <span className="text-emerald-700 text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase block mb-1">
                      {selectedProduct.category || "Herbal Product"}
                    </span>
                    <h2
                      className={`text-xl xs:text-2xl sm:text-3xl text-emerald-950 font-black leading-tight mb-2 ${playfair.className}`}
                    >
                      {selectedProduct.name}
                    </h2>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-950">
                      ₹{getSelectedPrice() / qty} <span className="text-xs text-neutral-400 font-normal">/ unit</span>
                    </div>
                  </div>

                  {/* Select Package Size Chips */}
                  {selectedProduct.predefinedOptions &&
                    selectedProduct.predefinedOptions.length > 0 && (
                      <div className="pt-3 border-t border-neutral-100">
                        <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-800 block mb-2">
                          Select Package Size
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProduct.predefinedOptions
                            .filter((opt: any) => opt.isAvailable !== false)
                            .map((opt: any) => (
                              <button
                                key={opt.label}
                                onClick={() => setSelectedSize(opt.label)}
                                className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                                  selectedSize === opt.label
                                    ? "border-[#2C392A] bg-[#2C392A] text-white shadow-sm"
                                    : "border-neutral-200 text-zinc-700 hover:border-emerald-400 bg-white"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Product Description */}
                  <div className="pt-3 border-t border-neutral-100">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-800 block mb-1">
                      Description
                    </span>
                    <p className="text-[#5F6D59] font-normal text-xs sm:text-sm leading-relaxed">
                      {selectedProduct.description ||
                        "Traditional authentic Siddha product crafted for purity, peace, and spiritual harmony."}
                    </p>
                  </div>

                  {/* Key Herbal Highlights Section */}
                  <div className="bg-[#F9F8F5] border border-emerald-900/10 rounded-2xl p-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      100% Sun-Dried Organic Ingredients
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      Authentic Siddha Formulation
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      Fast Dispatch & Secure Packaging
                    </div>
                  </div>

                  {/* Delivery Notice & Guarantees */}
                  <div className="pt-2 border-t border-neutral-100 space-y-1">
                    <p className="text-[10px] sm:text-[11px] text-emerald-900 font-bold flex items-center gap-1">
                      <span>🚚</span> Delivery charges may vary based on location
                    </p>
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-semibold text-[#5F6D59]">
                      <span>• Express Store Dispatch</span>
                      <span>• WhatsApp Support</span>
                    </div>
                  </div>
                </div>

                {/* STICKY BOTTOM FOOTER BAR (Fixed to bottom like reference image) */}
                <div className="p-3.5 sm:p-4 bg-white border-t border-neutral-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] shrink-0 space-y-2.5">
                  {/* Footer Top Row: Size Info & Calculated Total Price */}
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-600">
                      {selectedSize || "Standard"} <span className="text-zinc-400 font-normal">(₹{getSelectedPrice() / qty} each)</span>
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-950">
                      ₹{getSelectedPrice()}
                    </span>
                  </div>

                  {/* Footer Bottom Row: Quantity Stepper + Add To Cart Button */}
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-neutral-300 rounded-full bg-neutral-50 px-1 py-1 shrink-0">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-7 h-7 rounded-full bg-white text-zinc-700 hover:bg-emerald-100 hover:text-emerald-950 flex items-center justify-center font-bold text-sm shadow-sm transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-black text-sm text-emerald-950">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="w-7 h-7 rounded-full bg-white text-zinc-700 hover:bg-emerald-100 hover:text-emerald-950 flex items-center justify-center font-bold text-sm shadow-sm transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        addItem(selectedProduct, qty, selectedSize);

                        toast.custom(
                          (t) => (
                            <div
                              className={`${
                                t.visible ? "animate-enter" : "animate-leave"
                              } max-w-sm w-full bg-[#2C392A] shadow-2xl rounded-2xl pointer-events-auto flex items-center p-3.5 gap-3 border border-emerald-500/30`}
                            >
                              <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                                <ShoppingCart size={16} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-white">
                                  Added to cart
                                </p>
                                <p className="text-[10px] text-emerald-200 line-clamp-1">
                                  {qty}x {selectedProduct.name}
                                </p>
                              </div>
                              <Link
                                href="/cart"
                                className="bg-white text-emerald-950 px-3.5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase hover:bg-emerald-50 transition-colors shrink-0"
                                onClick={() => toast.dismiss(t.id)}
                              >
                                View Cart
                              </Link>
                            </div>
                          ),
                          { position: "bottom-center", duration: 4000 },
                        );

                        setCartSuccessDetails({
                          product: selectedProduct,
                          qty,
                          selectedSize,
                        });
                        setSelectedProduct(null);
                        setQty(1);
                        setSelectedSize("");
                      }}
                      className="flex-1 bg-[#2C392A] hover:bg-[#1e271d] text-white font-extrabold py-3 px-4 rounded-full uppercase tracking-wider text-xs transition-all shadow-lg shadow-[#2C392A]/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {(() => {
                        const inCartCount = cartItems
                          .filter((i) => i.product.id === selectedProduct.id && (!selectedSize || i.unit === selectedSize))
                          .reduce((acc, i) => acc + i.quantity, 0);
                        if (inCartCount > 0) {
                          return (
                            <>
                              <Check size={15} className="text-emerald-400" />
                              <span>In Cart ({inCartCount}) — Add More</span>
                            </>
                          );
                        }
                        return (
                          <>
                            <ShoppingCart size={15} /> Add to Cart
                          </>
                        );
                      })()}
                    </button>
                  </div>
                </div>
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
              className="bg-white w-full max-w-md rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl relative p-6 sm:p-8 text-center border border-emerald-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={30} />
              </div>
              <h3
                className={`text-2xl sm:text-3xl text-emerald-950 mb-2 font-black ${playfair.className}`}
              >
                Added to Cart!
              </h3>
              <p className="text-[#5F6D59] mb-6 font-normal text-xs sm:text-sm">
                You have successfully added{" "}
                <strong className="text-emerald-950">
                  {cartSuccessDetails.qty}x {cartSuccessDetails.product.name}
                </strong>
                {cartSuccessDetails.selectedSize &&
                  ` (${cartSuccessDetails.selectedSize})`}{" "}
                to your cart.
              </p>

              <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
                <Link
                  href="/cart"
                  className="w-full py-3.5 rounded-full bg-[#2C392A] text-white font-extrabold text-xs uppercase tracking-widest hover:bg-[#1e271d] transition-all shadow-lg shadow-[#2C392A]/20 text-center flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={15} /> Go to Checkout
                </Link>
                <button
                  onClick={() => setCartSuccessDetails(null)}
                  className="w-full py-3 rounded-full border border-emerald-200 text-emerald-800 font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </main>
    </div>
  );
}
