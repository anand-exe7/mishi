"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { LogOut, Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { fetchOrdersByEmail } from "@/lib/db";
import type { Order } from "@/lib/db";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.email) {
      setOrdersLoading(true);
      fetchOrdersByEmail(user.email)
        .then(data => {
          setOrders(data);
          setOrdersLoading(false);
        })
        .catch(err => {
          console.error("Failed to load orders:", err);
          setOrdersLoading(false);
        });
    }
  }, [user?.email]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen font-sans selection:bg-amber-600/30 selection:text-amber-900 overflow-x-hidden">
      {/* Main Content */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-24 px-3.5 sm:px-6 md:px-16 max-w-[1400px] mx-auto min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-sm">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl sm:text-3xl font-bold shadow-inner uppercase shrink-0">
                {user.email ? user.email.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <h1 className={`text-xl sm:text-3xl lg:text-4xl text-zinc-900 font-bold truncate ${playfair.className}`}>
                  {user.user_metadata?.full_name || "Valued Customer"}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 truncate mt-0.5">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors px-4 py-2.5 rounded-full shadow-sm shrink-0 self-end sm:self-auto">
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1 space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-amber-50 border-amber-200 text-amber-800 font-bold border text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <Package size={18} />
                  Order History
                </div>
                <ChevronRight size={16} className="text-amber-600" />
              </button>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-zinc-200/80 shadow-sm">
                <h2 className="text-xs sm:text-sm font-bold text-zinc-900 mb-4 sm:mb-6 uppercase tracking-widest border-b border-zinc-100 pb-3">Recent Orders</h2>
                
                {ordersLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200 p-6">
                    <p className="text-zinc-500 font-medium text-xs sm:text-sm">No orders placed yet.</p>
                    <Link href="/products" className="text-amber-600 font-bold text-xs hover:underline mt-2 inline-block">
                      Browse our collection
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="flex flex-col p-4 sm:p-6 border border-zinc-100 rounded-2xl hover:border-amber-200 transition-colors bg-zinc-50/50">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3 gap-2 border-b border-zinc-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              <h3 className="text-sm sm:text-base font-bold text-zinc-900">{order.id}</h3>
                              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-500 mt-1">
                              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </p>
                          </div>
                          <span className="text-base sm:text-xl font-black text-zinc-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs sm:text-sm text-zinc-700">
                              <div>
                                <span className="font-semibold text-zinc-900">{item.quantity}x</span> {item.name}
                                {item.size && <span className="ml-1.5 text-[10px] text-zinc-400">({item.size})</span>}
                              </div>
                              <span className="font-semibold text-zinc-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-[11px] sm:text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-100 font-medium">
                          <span>Subtotal</span>
                          <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {order.couponDiscount > 0 && (
                          <div className="flex justify-between text-[11px] sm:text-xs text-red-600 font-bold mt-1">
                            <span>Coupon Discount ({order.couponCode})</span>
                            <span>-₹{order.couponDiscount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {order.manualDiscount > 0 && (
                          <div className="flex justify-between text-[11px] sm:text-xs text-red-600 font-bold mt-1">
                            <span>Manual Discount</span>
                            <span>-₹{order.manualDiscount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {order.deliveryCharge > 0 && (
                          <div className="flex justify-between text-[11px] sm:text-xs text-zinc-500 mt-1">
                            <span>Delivery Charge</span>
                            <span>₹{order.deliveryCharge.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

