"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/store";
import { fetchCoupons, insertWhatsappRequest, Order, OrderItem, Coupon, generateSequentialOrderId } from "@/lib/db";
import { useAuth } from "@/lib/useAuth";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper to get item price based on selected size
  const getItemPrice = (item: any) => {
    if (item.product.predefinedOptions && item.product.predefinedOptions.length > 0) {
      const option = item.product.predefinedOptions.find((opt: any) => opt.label === item.unit);
      return option ? option.price : item.product.price;
    }
    return item.product.price;
  };

  // Calculate Subtotal
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    return Math.round((subtotal * appliedCoupon.discount) / 100);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const allCoupons = await fetchCoupons();
      const matched = allCoupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
      
      if (!matched) {
        toast.error("Invalid coupon code");
        setAppliedCoupon(null);
        return;
      }
      if (matched.status !== 'ACTIVE') {
        toast.error("This coupon is no longer active");
        setAppliedCoupon(null);
        return;
      }
      if (matched.expiryDate && new Date(matched.expiryDate) < new Date()) {
        toast.error("This coupon has expired");
        setAppliedCoupon(null);
        return;
      }
      if (matched.usageLimit > 0 && matched.usedCount >= matched.usageLimit) {
        toast.error("This coupon has reached its usage limit");
        setAppliedCoupon(null);
        return;
      }
      if (calculateSubtotal() < matched.minOrder) {
        toast.error(`Minimum order amount of ₹${matched.minOrder} required`);
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(matched);
      toast.success("Coupon applied successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error applying coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const orderId = await generateSequentialOrderId(true);
    const subtotal = calculateSubtotal();
    const couponDiscount = calculateDiscount();
    const finalTotal = subtotal - couponDiscount;

    // Map cart items to DB OrderItems
    const dbItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      size: item.unit,
      quantity: item.quantity,
      price: getItemPrice(item),
    }));

    // Construct order payload
    const orderPayload: Order = {
      id: orderId,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: user?.email || "",
      customerAddress: formData.address,
      source: "ONLINE",
      items: dbItems,
      subtotal,
      totalPrice: finalTotal,
      status: "Pending",
      createdAt: new Date().toISOString(),
      couponCode: appliedCoupon?.code || "",
      couponDiscount: couponDiscount,
      manualDiscount: 0,
      deliveryCharge: 0,
      cashReceived: 0,
      changeReturned: 0,
    };

    try {
      // 1. Insert order to Supabase
      await insertWhatsappRequest(orderPayload);
      toast.success("Order saved to database!");

      // 2. Format WhatsApp redirect message
      let rawWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919894609057";
      const adminWhatsApp = rawWhatsApp.length === 10 ? `91${rawWhatsApp}` : rawWhatsApp;
      let itemsSummary = items
        .map((item) => `- ${item.quantity}x ${item.product.name} (${item.unit}) - ₹${getItemPrice(item) * item.quantity}`)
        .join("\n");

      const ePray = String.fromCodePoint(0x1F64F);
      const ePackage = String.fromCodePoint(0x1F4E6);
      const ePerson = String.fromCodePoint(0x1F464);
      const eCart = String.fromCodePoint(0x1F6D2);
      const eCard = String.fromCodePoint(0x1F4B3);
      const eMobile = String.fromCodePoint(0x1F4F1);
      const eTruck = String.fromCodePoint(0x1F69A);
      const eSparkle = String.fromCodePoint(0x2728);

      let discountText = couponDiscount > 0 ? `\n\n*Subtotal:* ₹${subtotal}\n*Discount (${appliedCoupon?.code}):* -₹${couponDiscount}` : `\n\n*Subtotal:* ₹${subtotal}`;
      const message = `${ePray} *Hello Mishi Pooja Products!*\n\nI would like to place an order. ${ePackage}\n\n*Order ID:* ${orderId}\n\n${ePerson} *Customer Details:*\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Address:* ${formData.address}\n\n${eCart} *Order Summary:*\n${itemsSummary}${discountText}\n\n${eCard} *Final Total:* ₹${finalTotal}\n\n${eMobile} *GPay Number:* 9894609057\n\n${eTruck} _Delivery charges may vary based on location._\n\nPlease confirm my order. Thank you! ${eSparkle}`;
      
      // 3. Clear Zustand cart and redirect to WhatsApp
      clearCart();
      window.open(`https://api.whatsapp.com/send/?phone=${adminWhatsApp}&text=${encodeURIComponent(message)}`, "_blank");
    } catch (err: any) {
      console.error("Error creating order:", err?.message || err);
      toast.error(`Failed to place order in database: ${err?.message || "Unknown error"}. Redirecting to WhatsApp anyway...`);
      
      // Fallback redirect even if DB insert fails
      let rawWhatsAppFallback = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "919894609057";
      const adminWhatsAppFallback = rawWhatsAppFallback.length === 10 ? `91${rawWhatsAppFallback}` : rawWhatsAppFallback;
      let itemsSummary = items
        .map((item) => `- ${item.quantity}x ${item.product.name} (${item.unit}) - ₹${getItemPrice(item) * item.quantity}`)
        .join("\n");
      
      const ePray = String.fromCodePoint(0x1F64F);
      const ePackage = String.fromCodePoint(0x1F4E6);
      const ePerson = String.fromCodePoint(0x1F464);
      const eCart = String.fromCodePoint(0x1F6D2);
      const eCard = String.fromCodePoint(0x1F4B3);
      const eMobile = String.fromCodePoint(0x1F4F1);
      const eTruck = String.fromCodePoint(0x1F69A);
      const eSparkle = String.fromCodePoint(0x2728);

      let discountText = couponDiscount > 0 ? `\n\n*Subtotal:* ₹${subtotal}\n*Discount (${appliedCoupon?.code}):* -₹${couponDiscount}` : `\n\n*Subtotal:* ₹${subtotal}`;
      const message = `${ePray} *Hello Mishi Pooja Products!*\n\nI would like to place an order. ${ePackage}\n\n*Order ID:* ${orderId}\n\n${ePerson} *Customer Details:*\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Address:* ${formData.address}\n\n${eCart} *Order Summary:*\n${itemsSummary}${discountText}\n\n${eCard} *Final Total:* ₹${finalTotal}\n\n${eMobile} *GPay Number:* 9894609057\n\n${eTruck} _Delivery charges may vary based on location._\n\nPlease confirm my order. Thank you! ${eSparkle}`;
      window.open(`https://api.whatsapp.com/send/?phone=${adminWhatsAppFallback}&text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const handleSizeChange = (item: any, newUnit: string) => {
    removeItem(item.product.id, item.unit);
    const productToAdd = item.product;
    useCartStore.getState().addItem(productToAdd, item.quantity, newUnit);
  };

  if (!isMounted) {
    return (
      <div className="bg-zinc-50 min-h-screen font-sans flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen font-sans selection:bg-amber-600/30 selection:text-amber-900 overflow-x-hidden">
      {/* Cart Content */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-24 px-3 sm:px-6 md:px-16 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10 text-center sm:text-left"
        >
          <h1 className={`text-2xl sm:text-4xl md:text-5xl text-zinc-900 font-bold ${playfair.className}`}>
            Your Shopping Cart
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-zinc-200 shadow-sm max-w-xl mx-auto flex flex-col items-center">
            <ShoppingCart className="text-zinc-300 w-12 h-12 sm:w-16 sm:h-16 mb-4 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 mb-2">Your cart is empty</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mb-6">Discover the divine fragrances & herbal purity of Mishi.</p>
            <Link href="/products" className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full uppercase tracking-wider text-xs transition-colors shadow-lg shadow-amber-600/20">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            {/* Cart Items List */}
            <div className="w-full lg:w-7/12 space-y-3 sm:space-y-6">
              {items.map((item) => {
                const itemPrice = getItemPrice(item);
                const hasOptions = item.product.predefinedOptions && item.product.predefinedOptions.length > 0;

                return (
                  <div key={`${item.product.id}-${item.unit}`} className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-zinc-200/80 shadow-sm flex flex-row items-start gap-3 sm:gap-6">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-zinc-100 rounded-xl overflow-hidden shrink-0 border border-zinc-100">
                      <img src={item.product.imageUrl || "/placeholder.jpg"} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs sm:text-lg font-bold text-zinc-900 line-clamp-1">{item.product.name}</h3>
                        <button
                          onClick={() => {
                            removeItem(item.product.id, item.unit);
                            toast.success("Removed item from cart!");
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors p-1.5 bg-red-50 hover:bg-red-100 rounded-full shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                        {/* Size Selector */}
                        {hasOptions ? (
                          <select 
                            value={item.unit}
                            onChange={(e) => handleSizeChange(item, e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs font-semibold text-zinc-700 outline-none focus:border-amber-500 cursor-pointer"
                          >
                            {item.product.predefinedOptions.map((opt) => (
                              <option key={opt.label} value={opt.label}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="bg-zinc-100 text-zinc-600 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{item.unit}</span>
                        )}

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                          <button onClick={() => updateQuantity(item.product.id, item.unit, Math.max(1, item.quantity - 1))} className="px-2 py-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"><Minus size={12} /></button>
                          <span className="w-6 text-center text-xs font-bold text-zinc-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.unit, item.quantity + 1)} className="px-2 py-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"><Plus size={12} /></button>
                        </div>
                      </div>

                      <div className="mt-2 text-right">
                        <span className="font-bold text-sm sm:text-base text-amber-600">
                          ₹{itemPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Form & Summary */}
            <div className="w-full lg:w-5/12">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-200/80 shadow-sm sticky top-28">
                <h2 className="text-xs sm:text-sm font-bold text-zinc-900 mb-4 uppercase tracking-widest border-b border-zinc-100 pb-3">
                  Delivery Details
                </h2>
                
                <form onSubmit={handleCheckout} className="space-y-3.5 sm:space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Full Name</label>
                    <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-400 text-zinc-900" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Mobile Number</label>
                    <input required value={formData.phone} onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({...formData, phone: val});
                    }} type="tel" pattern="[0-9]{10}" maxLength={10} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-400 text-zinc-900" placeholder="e.g. 9876543210" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Complete Address</label>
                    <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors min-h-[90px] resize-none placeholder-zinc-400 text-zinc-900" placeholder="Door No, Street Name, City, Pincode"></textarea>
                  </div>

                  <div className="border-t border-zinc-100 pt-4 mt-4 space-y-3">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 min-w-0 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 placeholder-zinc-400 text-zinc-900 uppercase" 
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <span>Coupon applied: {appliedCoupon.code}</span>
                        <button type="button" onClick={() => setAppliedCoupon(null)} className="text-red-500 hover:underline">Remove</button>
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-zinc-500 pt-1">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{calculateSubtotal()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-xs text-emerald-600 font-bold">
                        <span>Discount ({appliedCoupon.discount}%)</span>
                        <span>-₹{calculateDiscount()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-zinc-500">Delivery</span>
                      <span className="font-bold text-emerald-700 text-[11px]">Calculated on WhatsApp</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-zinc-900 pt-3 border-t border-zinc-100">
                      <span>Total</span>
                      <span className="text-amber-600">₹{calculateSubtotal() - calculateDiscount()}</span>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs transition-colors shadow-lg shadow-emerald-600/20 mt-4 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg> Order via WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

