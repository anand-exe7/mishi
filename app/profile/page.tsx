"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { User, ShoppingCart, LogOut, Package, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="bg-zinc-50 min-h-screen font-sans selection:bg-amber-600/30 selection:text-amber-900">

      {/* Main Content */}
      <section className="pt-40 pb-24 px-6 md:px-16 max-w-[1400px] mx-auto min-h-[80vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-3xl font-bold shadow-inner uppercase">
                  {user.email ? user.email.charAt(0) : 'U'}
                </div>
                <div>
                  <h1 className={`text-4xl text-zinc-900 ${playfair.className}`}>
                    {user.user_metadata?.full_name || "Valued Customer"}
                  </h1>
                  <p className="text-zinc-500 mt-1">{user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors px-6 py-3 rounded-full border border-red-600 shadow-sm">
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar Menu */}
              <div className="lg:col-span-1 space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-50 border-amber-200 text-amber-700 font-bold border">
                  <div className="flex items-center gap-3">
                    <Package size={20} />
                    Order History
                  </div>
                  <ChevronRight size={16} className="text-amber-500" />
                </button>
              </div>

              {/* Order History */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm">
                  <h2 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-widest text-sm border-b border-zinc-100 pb-4">Recent Orders</h2>
                  
                  {ordersLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                      <p className="text-zinc-500 font-medium">No orders placed yet.</p>
                      <Link href="/products" className="text-emerald-600 font-bold text-sm hover:underline mt-2 inline-block">
                        Browse our collection
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="flex flex-col p-6 border border-zinc-100 rounded-2xl hover:border-amber-200 transition-colors bg-zinc-50/50">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-2 border-b border-zinc-100 pb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-zinc-900">{order.id}</h3>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                  order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 mt-1">
                                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                              </p>
                            </div>
                            <span className="text-xl font-black text-zinc-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm text-zinc-700">
                                <div>
                                  <span className="font-semibold text-zinc-900">{item.quantity}x</span> {item.name}
                                  {item.size && <span className="ml-2 text-xs text-zinc-400">({item.size})</span>}
                                </div>
                                <span className="font-semibold text-zinc-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between text-xs text-zinc-500 mt-4 pt-4 border-t border-zinc-100 font-medium">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          {order.couponDiscount > 0 && (
                            <div className="flex justify-between text-xs text-red-600 font-bold mt-1">
                              <span>Coupon Discount ({order.couponCode})</span>
                              <span>-₹{order.couponDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {order.manualDiscount > 0 && (
                            <div className="flex justify-between text-xs text-red-600 font-bold mt-1">
                              <span>Manual Discount</span>
                              <span>-₹{order.manualDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {order.deliveryCharge > 0 && (
                            <div className="flex justify-between text-xs text-zinc-500 mt-1">
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
