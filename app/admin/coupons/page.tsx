'use client';

import React, { useState } from 'react';
import { Search, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

type Coupon = {
  id: string;
  code: string;
  discount_type: 'FLAT' | 'PERCENTAGE';
  discount_value: number;
  min_order_value: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
};

const mockCoupons: Coupon[] = [
  { id: '1', code: 'FESTIVE500', discount_type: 'FLAT', discount_value: 500, min_order_value: 5000, usage_limit: 100, used_count: 45, is_active: true },
  { id: '2', code: 'WELCOME10', discount_type: 'PERCENTAGE', discount_value: 10, min_order_value: 1000, usage_limit: 500, used_count: 120, is_active: true },
  { id: '3', code: 'DIWALI2026', discount_type: 'FLAT', discount_value: 1000, min_order_value: 10000, usage_limit: 50, used_count: 50, is_active: false },
];

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const previous = [...coupons];
    setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast('Coupon status updated', 'success');
    } catch (e) {
      setCoupons(previous);
      showToast('Failed to update status', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 font-medium text-sm transition-all animate-in slide-in-from-top-2
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}
        `}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-rose-500" />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Coupons Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Create and manage discount codes</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm w-full focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-full text-sm transition-colors whitespace-nowrap">
            <Plus size={16} /> New Coupon
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min Order Value</th>
                <th className="px-6 py-4">Usage Limits</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-900">{coupon.code}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {coupon.discount_type === 'FLAT' ? `₹${coupon.discount_value}` : `${coupon.discount_value}%`}
                  </td>
                  <td className="px-6 py-4 text-slate-600">₹{coupon.min_order_value}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 w-24">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(coupon.used_count / coupon.usage_limit) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{coupon.used_count} / {coupon.usage_limit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${coupon.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
