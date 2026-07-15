'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchCoupons, upsertCoupon, dbDeleteCoupon, Coupon } from '@/lib/db';
import toast from 'react-hot-toast';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('10');
  const [minOrder, setMinOrder] = useState('1');
  const [expiry, setExpiry] = useState('');
  const [usageLimit, setUsageLimit] = useState('0');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchCoupons();
      setCoupons(data);
      toast.success('Coupons list refreshed');
    } catch (err) {
      console.error('Error refreshing coupons:', err);
      toast.error('Failed to refresh coupons');
    } finally {
      setIsRefreshing(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Coupon code is required');
      return;
    }

    setSubmitting(true);
    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      discount: parseFloat(discount) || 0,
      minOrder: parseFloat(minOrder) || 0,
      expiryDate: expiry || undefined,
      usageLimit: parseInt(usageLimit) || 0,
      usedCount: 0,
      status: 'ACTIVE',
    };

    try {
      await upsertCoupon(newCoupon);
      toast.success('Coupon created successfully!');
      
      // Reset form
      setCode('');
      setDiscount('10');
      setMinOrder('1');
      setExpiry('');
      setUsageLimit('0');

      // Reload
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (err: any) {
      console.error('Error creating coupon:', err?.message || err);
      toast.error(`Failed to create coupon: ${err?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (couponCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${couponCode}?`)) {
      return;
    }

    try {
      await dbDeleteCoupon(couponCode);
      setCoupons(coupons.filter(c => c.code !== couponCode));
      toast.success('Coupon deleted');
    } catch (err: any) {
      console.error('Error deleting coupon:', err?.message || err);
      toast.error(`Failed to delete coupon: ${err?.message || 'Unknown error'}`);
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    const nextStatus: 'ACTIVE' | 'INACTIVE' = coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updatedCoupon = { ...coupon, status: nextStatus };
      await upsertCoupon(updatedCoupon);
      setCoupons(coupons.map(c => c.code === coupon.code ? updatedCoupon : c));
      toast.success(`Coupon set to ${nextStatus}`);
    } catch (err: any) {
      console.error('Error toggling coupon status:', err?.message || err);
      toast.error(`Failed to update coupon status: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto text-slate-900 font-sans p-2">
      <h1 className="text-2xl font-black mb-6">Coupon Management</h1>
      
      {/* Info Alert */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-3 rounded-xl text-xs font-medium flex items-center mb-8">
        Coupon discount applies to product subtotal only — not delivery charge.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form */}
        <form onSubmit={handleCreateCoupon} className="lg:col-span-5 bg-white border border-slate-100 shadow-sm rounded-2xl p-8">
          <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
            <span>+</span> NEW COUPON
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                COUPON CODE <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="E.G. PILLOW" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold uppercase focus:outline-none focus:border-slate-400 placeholder:font-normal"
                  required
                />
                <button 
                  type="button"
                  onClick={generateCode}
                  className="bg-[#1a2620] hover:bg-[#111a15] text-white text-[10px] font-bold px-5 py-2.5 rounded-xl transition-colors tracking-widest shrink-0"
                >
                  GENERATE
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                  DISCOUNT % <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-slate-400"
                  required
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                  MIN ORDER (₹)
                </label>
                <input 
                  type="number" 
                  value={minOrder}
                  onChange={e => setMinOrder(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-slate-400"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                  EXPIRY DATE
                </label>
                <input 
                  type="date" 
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-400 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                  USAGE LIMIT
                </label>
                <input 
                  type="number" 
                  value={usageLimit}
                  onChange={e => setUsageLimit(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-slate-400"
                  min="0"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1a2620] hover:bg-[#111a15] text-white text-[11px] font-bold py-3.5 rounded-xl transition-colors tracking-widest mt-2 disabled:opacity-50"
            >
              {submitting ? 'CREATING...' : 'CREATE COUPON'}
            </button>
          </div>
        </form>

        {/* Right List */}
        <div className="lg:col-span-7 bg-white border border-slate-100 shadow-sm rounded-2xl p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
              ALL COUPONS ({coupons.length})
            </h2>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white">
                <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent animate-spin rounded-full mb-2"></div>
                <p className="text-sm text-slate-500">Loading coupons...</p>
              </div>
            ) : (
              coupons.map((coupon) => {
                const isExhausted = coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;
                return (
                <div key={coupon.code} className="border border-slate-100 rounded-xl p-5 flex justify-between items-start hover:border-slate-200 transition-colors bg-[#fdfdfd]">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-slate-900">{coupon.code}</h3>
                      <button 
                        onClick={() => toggleStatus(coupon)}
                        disabled={isExhausted}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border tracking-widest transition-colors ${
                          isExhausted ? 'bg-red-100 text-red-700 border-red-200 cursor-not-allowed' :
                          coupon.status === 'ACTIVE' 
                            ? 'bg-[#e6f4ea] text-[#1e7e34] border-[#c3e6cb] hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                            : 'bg-red-50 text-red-600 border-red-200 hover:bg-[#e6f4ea] hover:text-[#1e7e34] hover:border-[#c3e6cb]'
                        }`}
                      >
                        {isExhausted ? 'EXHAUSTED' : coupon.status}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[13px] text-slate-600 font-medium">
                        {coupon.discount}% off • min ₹{coupon.minOrder}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                        Used {coupon.usedCount} times 
                        {coupon.usageLimit > 0 && ` (Limit: ${coupon.usageLimit})`}
                        {coupon.expiryDate && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span> 
                            expires {new Date(coupon.expiryDate).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[11px] font-bold">
                    <button 
                      onClick={() => handleDelete(coupon.code)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
              })
            )}
            
            {!loading && coupons.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-500 italic">
                No coupons found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
