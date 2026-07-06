'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  status: string;
  total_amount: number;
  items: Array<{
    product_name: string;
    variant: string;
    size: string;
    quantity: number;
    unit_price: number;
  }>;
};

const mockOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    created_at: new Date().toISOString(),
    customer_name: 'Anita Desai',
    customer_phone: '+919876500001',
    shipping_address: '789 Birch Street, Chennai, 600001',
    status: 'New',
    total_amount: 25000,
    items: [
      { product_name: 'Luxury Spring Mattress', variant: 'Plush', size: 'King', quantity: 1, unit_price: 25000 }
    ]
  },
  {
    id: 'ORD-2026-002',
    created_at: new Date(Date.now() - 100000000).toISOString(),
    customer_name: 'Vikram Singh',
    customer_phone: '+919876500002',
    shipping_address: '45 Pine Road, Delhi, 110001',
    status: 'Processing',
    total_amount: 12500,
    items: [
      { product_name: 'Orthopedic Mattress', variant: 'Firm', size: 'Queen', quantity: 1, unit_price: 12500 }
    ]
  }
];

const STATUS_COLORS: Record<string, string> = {
  'New': 'bg-purple-100 text-purple-700 border-purple-200',
  'Processing': 'bg-amber-100 text-amber-700 border-amber-200',
  'Shipped': 'bg-blue-100 text-blue-700 border-blue-200',
  'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Cancelled': 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic Update
    const previousOrders = [...orders];
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      // Simulate API call
      await new Promise((resolve, reject) => setTimeout(() => {
        if (Math.random() > 0.8) reject(new Error('Server error'));
        resolve(true);
      }, 600));
      
      showToast('Order status updated successfully', 'success');
    } catch (error) {
      // Revert on failure
      setOrders(previousOrders);
      showToast('Failed to update status. Reverting changes.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.id.toLowerCase().includes(search.toLowerCase()) || 
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search)
    );
  }, [orders, search]);

  return (
    <div className="space-y-6 relative max-w-full overflow-hidden">
      {/* Toast Notification */}
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
          <h1 className="text-2xl font-black text-slate-900">Orders Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track and update e-commerce orders</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Order ID, Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm w-full md:w-64 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{order.customer_name}</p>
                      <p className="text-xs text-slate-500">{order.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-black text-slate-900">₹{order.total_amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-3 py-1.5 border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-200 ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        <option value="New">NEW</option>
                        <option value="Processing">PROCESSING</option>
                        <option value="Shipped">SHIPPED</option>
                        <option value="Delivered">DELIVERED</option>
                        <option value="Cancelled">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto"
                      >
                        View <ChevronDown size={14} className={`transform transition-transform ${expandedRow === order.id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRow === order.id && (
                    <tr>
                      <td colSpan={6} className="p-0 border-b border-slate-200">
                        <div className="bg-slate-50 p-6 inset-shadow-sm border-t border-slate-100">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="col-span-1 space-y-4">
                              <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Shipping Address</h4>
                                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{order.shipping_address}</p>
                              </div>
                            </div>
                            <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Order Items</h4>
                              <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm min-w-[450px]">
                                  <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs">
                                      <th className="pb-2 text-left">Product</th>
                                      <th className="pb-2 text-center">Qty</th>
                                      <th className="pb-2 text-right">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                    {order.items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td className="py-3">
                                          <p className="font-bold text-slate-900">{item.product_name}</p>
                                          <p className="text-xs text-slate-500">{item.variant} • {item.size}</p>
                                        </td>
                                        <td className="py-3 text-center text-slate-700">{item.quantity}</td>
                                        <td className="py-3 text-right font-bold text-slate-900">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
