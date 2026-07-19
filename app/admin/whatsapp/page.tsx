'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Copy, Check, RefreshCw } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { Order } from '@/lib/db';

const WhatsAppIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

type Inquiry = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  notes: string;
  status: string;
  total_amount: number;
  discount_amount: number;
  coupon?: { code: string };
  items: Array<{
    product_name: string;
    variant: string;
    size: string;
    quantity: number;
    unit_price: number;
  }>;
};

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    customer_name: 'Rahul Kumar',
    customer_phone: '7904199050',
    notes: '123 Main Street\nINVOICE_ID: ORD-2026-0030',
    status: 'pending',
    total_amount: 945,
    discount_amount: 0,
    items: [ { product_name: 'Cup Sambrani', variant: 'Standard', size: '250g', quantity: 2, unit_price: 299 } ]
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    customer_name: 'Priya Sharma',
    customer_phone: '8925306434',
    notes: 'MAHALAKSHMI NAGAR...\nINVOICE_ID: ORD-2026-0029',
    status: 'pending',
    total_amount: 149,
    discount_amount: 0,
    items: [ { product_name: 'Pure Camphor', variant: 'Premium', size: '100g', quantity: 1, unit_price: 149 } ]
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    customer_name: 'Amit Singh',
    customer_phone: '9876543210',
    notes: '45 Anna Salai, Chennai\nINVOICE_ID: ORD-2026-0028',
    status: 'completed',
    total_amount: 2245,
    discount_amount: 250,
    coupon: { code: 'FESTIVE10' },
    items: [ { product_name: 'Agarbathi', variant: 'Premium', size: '500g', quantity: 5, unit_price: 499 } ]
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    customer_name: 'Sneha Reddy',
    customer_phone: '9123456789',
    notes: 'Hitech City, Hyderabad\nINVOICE_ID: ORD-2026-0027',
    status: 'processing',
    total_amount: 299,
    discount_amount: 0,
    items: [ { product_name: 'Cone Sambrani', variant: 'Standard', size: '250g', quantity: 1, unit_price: 299 } ]
  }
];

export default function WhatsAppCenter() {
  const { whatsappRequests, updateWhatsappStatus, refreshData, loading } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const processedData = useMemo(() => {
    return whatsappRequests.map(inq => {
      const subtotal = inq.subtotal || inq.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const totalItems = inq.items.reduce((acc, item) => acc + item.quantity, 0);
      const discount = (inq.couponDiscount || 0) + (inq.manualDiscount || 0);

      return {
        ...inq,
        subtotal,
        totalItems,
        discount
      };
    });
  }, [whatsappRequests]);

  // Derived Metrics from data
  const metrics = useMemo(() => {
    return {
      total: whatsappRequests.length,
      pending: whatsappRequests.filter(i => i.status === 'Pending').length,
      processing: whatsappRequests.filter(i => i.status === 'Processing').length,
      completed: whatsappRequests.filter(i => i.status === 'Completed').length,
    };
  }, [whatsappRequests]);

  const copyMessage = (inq: any) => {
    const itemsText = inq.items.map((i: any) => `• ${i.name} - ${i.size || 'Standard'} × ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
    const discountText = inq.discount > 0 ? `\nDiscount Applied: -₹${inq.discount.toLocaleString('en-IN')}` : '';
    
    const message = `*Order Request — Mishi Pooja Products*
*Invoice ID:* ${inq.id}

👤 ${inq.customerName} | 📞 ${inq.customerPhone}
📍 ${inq.customerAddress || 'No address provided'}

*Items:*
${itemsText}

Subtotal: ₹${inq.subtotal.toLocaleString('en-IN')}${discountText}
💰 *Total Amount: ₹${inq.totalPrice.toLocaleString('en-IN')}*`;

    navigator.clipboard.writeText(message);
    setCopiedId(inq.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => {
    try {
      await updateWhatsappStatus(id, newStatus);
    } catch (err) {
      console.error(err);
      alert('Failed to update request status.');
    }
  };

  const filteredInquiries = useMemo(() => {
    return processedData.filter(inq => {
      // Search filter
      const matchesSearch = inq.id.toLowerCase().includes(search.toLowerCase()) ||
                            inq.customerName.toLowerCase().includes(search.toLowerCase()) ||
                            inq.customerPhone.includes(search);
      
      if (!matchesSearch) return false;

      // Date range filter
      if (filter === 'TODAY') {
        const today = new Date().toDateString();
        return new Date(inq.createdAt).toDateString() === today;
      }
      if (filter === 'WEEK') {
        const now = new Date();
        const dayOfWeek = now.getDay() || 7; // Mon=1 to Sun=7
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
        startOfWeek.setHours(0,0,0,0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        const time = new Date(inq.createdAt).getTime();
        return time >= startOfWeek.getTime() && time <= endOfWeek.getTime();
      }
      if (filter === 'MONTH') {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const time = new Date(inq.createdAt).getTime();
        return time >= startOfMonth.getTime() && time <= endOfMonth.getTime();
      }
      if (filter === 'CUSTOM' && customFrom && customTo) {
        const from = new Date(customFrom).getTime();
        const to = new Date(customTo).setHours(23, 59, 59, 999);
        const time = new Date(inq.createdAt).getTime();
        return time >= from && time <= to;
      }
      return true;
    });
  }, [processedData, filter, search, customFrom, customTo]);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <WhatsAppIcon size={32} className="text-[#25D366]" />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">WhatsApp Center</h1>
          <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
            {metrics.pending} pending
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center bg-white rounded-full border border-slate-200 p-1 shadow-sm text-xs font-bold text-slate-600">
            {['ALL', 'TODAY', 'WEEK', 'MONTH', 'CUSTOM'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'hover:bg-slate-50'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {filter === 'CUSTOM' && (
            <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 px-3 py-1 shadow-sm text-xs font-bold text-slate-700">
              <span className="text-[10px] text-slate-400">FROM</span>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="outline-none bg-transparent" />
              <span className="text-[10px] text-slate-400">TO</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="outline-none bg-transparent" />
            </div>
          )}

          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center items-center h-[120px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Requests</span>
          <span className="text-4xl font-black text-blue-600">{metrics.total}</span>
        </div>
        <div className="bg-amber-50/50 rounded-2xl border border-amber-100 shadow-sm p-6 flex flex-col justify-center items-center h-[120px]">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Pending</span>
          <span className="text-4xl font-black text-amber-500">{metrics.pending}</span>
        </div>
        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col justify-center items-center h-[120px]">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Processing</span>
          <span className="text-4xl font-black text-blue-500">{metrics.processing}</span>
        </div>
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm p-6 flex flex-col justify-center items-center h-[120px]">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Completed</span>
          <span className="text-4xl font-black text-emerald-500">{metrics.completed}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <WhatsAppIcon size={20} className="text-[#25D366]" />
            <h2 className="text-base font-bold text-slate-900">Customer Requests</h2>
            <span className="text-xs text-slate-500 font-medium">{filteredInquiries.length} requests</span>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border-2 border-slate-200 rounded-full text-sm font-medium text-slate-950 placeholder:text-slate-400 w-full focus:outline-none focus:border-[#dc2626]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4 text-center">Products</th>
                  <th className="px-6 py-4">Est. Total</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-500 italic">
                      No WhatsApp requests found.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <React.Fragment key={inq.id}>
                      <tr className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-700">{inq.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{inq.customerName}</td>
                        <td className="px-6 py-4 text-slate-600">{inq.customerPhone}</td>
                        <td className="px-6 py-4 text-slate-500 min-w-[200px] whitespace-pre-wrap">{inq.customerAddress || 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs inline-flex items-center justify-center">
                            {inq.totalItems}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-900">₹{inq.totalPrice.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} <br/>
                          {new Date(inq.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative inline-block w-[130px]">
                            <select
                              value={inq.status}
                              onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                              className={`appearance-none w-full outline-none font-bold text-xs px-3 py-1.5 pr-8 rounded-full border cursor-pointer uppercase ${
                                inq.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                inq.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-emerald-50 text-emerald-600 border-emerald-200'
                              }`}
                            >
                              <option value="Pending">PENDING</option>
                              <option value="Processing">PROCESSING</option>
                              <option value="Completed">COMPLETED</option>
                              <option value="Cancelled">CANCELLED</option>
                            </select>
                            <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                                inq.status === 'Pending' ? 'text-amber-600' : 
                                inq.status === 'Processing' ? 'text-blue-600' : 'text-emerald-600'
                            }`} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setExpandedRow(expandedRow === inq.id ? null : inq.id)}
                            className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-full text-xs transition-colors cursor-pointer"
                          >
                            {expandedRow === inq.id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      
                      {expandedRow === inq.id && (
                        <tr>
                          <td colSpan={9} className="p-0 border-b border-slate-100 bg-slate-50">
                            <div className="p-6 shadow-inner animate-in slide-in-from-top-2">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="col-span-1 space-y-4">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Customer Info</h4>
                                    <p className="font-bold text-slate-900">{inq.customerName}</p>
                                    <p className="text-slate-600">{inq.customerPhone}</p>
                                    {inq.customerEmail && <p className="text-slate-500 text-xs">{inq.customerEmail}</p>}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Delivery Address</h4>
                                    <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{inq.customerAddress || 'No address provided.'}</p>
                                  </div>
                                  <button 
                                    onClick={() => copyMessage(inq)}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                                  >
                                    {copiedId === inq.id ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Message</>}
                                  </button>
                                </div>

                                <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Order Items</h4>
                                  <div className="overflow-x-auto w-full">
                                    <table className="w-full text-sm min-w-[500px] font-medium">
                                      <thead>
                                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px] uppercase tracking-widest">
                                          <th className="pb-2 text-left">Product</th>
                                          <th className="pb-2 text-center">Qty</th>
                                          <th className="pb-2 text-right">Price</th>
                                          <th className="pb-2 text-right">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50">
                                        {inq.items.map((item: any, idx: number) => (
                                          <tr key={idx}>
                                            <td className="py-3">
                                              <p className="font-bold text-slate-900">{item.name}</p>
                                              {item.size && <p className="text-xs text-slate-500">Size: {item.size}</p>}
                                            </td>
                                            <td className="py-3 text-center text-slate-700 font-bold">{item.quantity}</td>
                                            <td className="py-3 text-right text-slate-700">₹{item.price.toLocaleString('en-IN')}</td>
                                            <td className="py-3 text-right font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  
                                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-600 font-medium">
                                      <span>Subtotal</span>
                                      <span>₹{inq.subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    {inq.discount > 0 && (
                                      <div className="flex justify-between text-[#dc2626] font-bold">
                                        <span>Discount Applied ({inq.couponCode || 'Manual'})</span>
                                        <span>-₹{inq.discount.toLocaleString('en-IN')}</span>
                                      </div>
                                    )}
                                    {inq.deliveryCharge > 0 && (
                                      <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Delivery</span>
                                        <span>₹{inq.deliveryCharge.toLocaleString('en-IN')}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-50">
                                      <span>Grand Total</span>
                                      <span>₹{inq.totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
