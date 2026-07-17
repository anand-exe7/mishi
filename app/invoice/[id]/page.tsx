"use client";

import { useEffect, useState, use } from "react";
import { ShoppingBag, MapPin, Phone, Printer, Copy, Check } from "lucide-react";
import Link from "next/link";
import { fetchOrderById, Order } from "@/lib/db";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await fetchOrderById(id);
        if (!data) {
          setError(true);
        } else {
          setOrder(data);
          document.title = `Invoice - ${data.id}`;
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFA] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <p className="text-[#4C3D32] font-bold tracking-widest uppercase text-sm">Generating Digital Bill...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FCFCFA] flex flex-col items-center justify-center gap-4">
        <p className="text-amber-600 font-bold text-xl">Invoice Not Found</p>
        <Link href="/admin" className="px-6 py-2 bg-[#E8DEC8] hover:bg-[#DBCABF] rounded-lg text-[#32231A] font-bold transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFAEB] text-[#32231A] font-sans py-12 px-4 print:p-0 print:bg-white flex flex-col items-center">
      <style>{`
        @media print {
          @page {
            margin: 10mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
      
      {/* Top Navigation / Action Bar (Hidden when printing) */}
      <div className="w-full max-w-3xl flex justify-end items-center mb-8 print:hidden gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-white hover:bg-[#F0EBE1]/40 text-[#4C3D32] hover:text-amber-700 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm border border-[#E8DEC8] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Download PDF / Print
          </button>
        </div>
      </div>

      {/* The Invoice Document */}
      <div className="w-full max-w-3xl bg-white border border-[#E8DEC8] rounded-2xl shadow-xl print:shadow-none print:border-none print:rounded-none overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#FCFCFA] border-b border-[#E8DEC8] p-8 sm:p-12 print:p-6 flex flex-col items-center text-center">
          <div className="w-80 h-48 flex items-center justify-center mb-4">
            <img src="/logo.webp" alt="Mishi Pooja Products Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <p className="text-xs text-amber-600 font-bold tracking-wider mt-1 mb-4">INVOICE: {order.id}</p>
          
          <div className="flex flex-col items-center gap-2 text-sm text-[#4C3D32] font-semibold">
            <div className="text-center max-w-md leading-relaxed">
              <span className="inline-block text-amber-600 mr-1.5 align-middle -mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span>123 Spiritual Way, Chennai, Tamil Nadu, India</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>+91 {process.env.NEXT_PUBLIC_STORE_PHONE || "99400 88786"}</span>
            </div>
          </div>
        </div>

        {/* Invoice Meta Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 sm:p-12 print:p-6 border-b border-[#E8DEC8]/50">
          <div>
            <h3 className="text-[10px] font-bold text-[#8A7B72] uppercase tracking-[0.2em] mb-3">Billed To</h3>
            <p className="text-base font-bold text-[#192836]">{order.customerName || "Guest Customer"}</p>
            {order.customerPhone && (
              <p className="text-sm text-[#4C3D32] font-semibold mt-1">+91 {order.customerPhone}</p>
            )}
            {order.customerAddress && (
              <p className="text-sm text-[#4C3D32] mt-1 whitespace-pre-line">{order.customerAddress}</p>
            )}
          </div>
          <div className="sm:text-right flex flex-col sm:items-end">
            <h3 className="text-[10px] font-bold text-[#8A7B72] uppercase tracking-[0.2em] mb-3 self-start sm:self-auto">Order Details</h3>
            <div className="inline-block text-left text-sm space-y-1">
              <div className="flex gap-2">
                <span className="text-[#8A7B72] font-bold w-12 text-left sm:text-right">Date:</span>
                <span className="text-[#32231A] font-black">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#8A7B72] font-bold w-12 text-left sm:text-right">Time:</span>
                <span className="text-[#32231A] font-black">{new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#8A7B72] font-bold w-12 text-left sm:text-right">Type:</span>
                <span className="text-[#32231A] font-black uppercase">{order.source} SALE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-8 sm:p-12 print:py-4 print:px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#E8DEC8]">
                <th className="py-4 text-[11px] font-bold text-[#8A7B72] uppercase tracking-wider">Item Description</th>
                <th className="py-4 text-[11px] font-bold text-[#8A7B72] uppercase tracking-wider text-center">Qty</th>
                <th className="py-4 text-[11px] font-bold text-[#8A7B72] uppercase tracking-wider text-right">Price</th>
                <th className="py-4 text-[11px] font-bold text-[#8A7B72] uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DEC8]/40">
              {order.items.map((item, index) => (
                <tr key={index} className="group">
                  <td className="py-6 pr-4 print:py-3">
                    <p className="text-sm font-bold text-[#192836]">{item.name}</p>
                    {item.size && item.size !== '—' && (
                      <p className="text-xs text-[#8A7B72] mt-0.5">Size: {item.size}</p>
                    )}
                  </td>
                  <td className="py-6 px-4 print:py-3 text-center text-sm font-bold text-[#4C3D32]">{item.quantity}</td>
                  <td className="py-6 pl-4 print:py-3 text-right text-sm font-bold text-[#4C3D32]">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="py-6 pl-4 print:py-3 text-right text-sm font-black text-[#192836]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="bg-[#FCFCFA] border-t border-[#E8DEC8] p-8 sm:p-12 print:p-6 flex justify-end">

            {/* Calculations */}
            <div className="w-full sm:w-1/2 space-y-3">
              {(order.couponDiscount > 0 || order.manualDiscount > 0 || order.deliveryCharge > 0) && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8A7B72] font-bold uppercase tracking-wider">Subtotal</span>
                  <span className="font-bold text-[#32231A]">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              {order.couponDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8A7B72] font-bold uppercase tracking-wider">
                    Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}
                  </span>
                  <span className="font-bold text-emerald-600">-₹{order.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {order.manualDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8A7B72] font-bold uppercase tracking-wider">Manual Discount</span>
                  <span className="font-bold text-emerald-600">-₹{order.manualDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {order.deliveryCharge > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8A7B72] font-bold uppercase tracking-wider">Delivery Fee</span>
                  <span className="font-bold text-[#32231A]">₹{order.deliveryCharge.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-[#E8DEC8] pt-4 mt-2 flex justify-between items-center">
                <span className="text-sm font-black text-amber-600 uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-[#192836]">₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-[#E8DEC8]/60 p-6 print:p-4 text-center bg-[#F8F5F0] flex flex-col items-center justify-center gap-1.5">
          <p className="text-xs font-bold text-amber-700 tracking-wider uppercase">Thank you for shopping!</p>
          <p className="text-[9px] font-bold text-[#8A7B72]/80 uppercase tracking-[0.15em]">Powered by Cenexa Systems @ {new Date().getFullYear()}</p>
        </div>

      </div>
    </div>
  );
}
