'use client';

import React, { useState } from 'react';
import { RefreshCw, Info } from 'lucide-react';

type Coupon = {
  id: string;
  code: string;
  discount: number;
  minOrder: number;
  used: number;
  status: 'ACTIVE' | 'INACTIVE';
  expiry?: string;
};

const mockCoupons: Coupon[] = [
  { id: '1', code: 'S55DRKKT', discount: 10, minOrder: 1, used: 0, status: 'ACTIVE' },
  { id: '2', code: 'LALITH', discount: 10, minOrder: 1000, used: 0, status: 'ACTIVE', expiry: '16/7/2026' },
  { id: '3', code: 'HELLO', discount: 10, minOrder: 1, used: 0, status: 'ACTIVE' },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('10');
  const [minOrder, setMinOrder] = useState('1');
  const [expiry, setExpiry] = useState('');
  const [usageLimit, setUsageLimit] = useState('20');
  
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
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
        <div className="lg:col-span-5 bg-white border border-slate-100 shadow-sm rounded-2xl p-8">
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
                />
                <button 
                  onClick={generateCode}
                  className="bg-[#1a2620] hover:bg-[#111a15] text-white text-[10px] font-bold px-5 py-2.5 rounded-xl transition-colors tracking-widest"
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
                />
              </div>
            </div>

            <button className="w-full bg-[#1a2620] hover:bg-[#111a15] text-white text-[11px] font-bold py-3.5 rounded-xl transition-colors tracking-widest mt-2">
              CREATE COUPON
            </button>
          </div>
        </div>

        {/* Right List */}
        <div className="lg:col-span-7 bg-white border border-slate-100 shadow-sm rounded-2xl p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
              ALL COUPONS ({coupons.length})
            </h2>
            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="border border-slate-100 rounded-xl p-5 flex justify-between items-start hover:border-slate-200 transition-colors bg-[#fdfdfd]">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-slate-900">{coupon.code}</h3>
                    {coupon.status === 'ACTIVE' && (
                      <span className="bg-[#e6f4ea] text-[#1e7e34] text-[9px] font-bold px-2 py-0.5 rounded border border-[#c3e6cb] tracking-widest">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] text-slate-600 font-medium">
                      {coupon.discount}% off • min ₹{coupon.minOrder}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                      Used {coupon.used} times 
                      {coupon.expiry && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span> 
                          expires {coupon.expiry}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-[11px] font-bold">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
            
            {coupons.length === 0 && (
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
