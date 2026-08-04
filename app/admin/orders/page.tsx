'use client';

import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, AlertCircle, Eye, X, ChevronDown, MessageSquare, Printer, FileText, ArrowLeft, Trash2 } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { Order } from '@/lib/db';

const STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-purple-100 text-purple-700 border-purple-200',
  'Processing': 'bg-amber-100 text-amber-700 border-amber-200',
  'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function OrdersManagement() {
  const { orders, updateOrderStatus, deleteOrder, loading } = useAdmin();
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('All Time');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showInvoiceView, setShowInvoiceView] = useState(false);

  const themeColor = '#2C392A'; // Match Mishi Green Theme

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete Invoice #${orderId}? This action cannot be undone and will automatically remove its data from all sales analytics.`)) {
      try {
        setUpdatingId(orderId);
        await deleteOrder(orderId);
        showToast(`Invoice #${orderId} deleted successfully`, 'success');
        setSelectedOrder(null);
        setShowInvoiceView(false);
      } catch (err) {
        console.error(err);
        showToast('Failed to delete invoice', 'error');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'Pending' | 'Processing' | 'Completed') => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      
      // Update selected order in state if it is open in modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Invalid customer phone number', 'error');
      return;
    }
    
    const itemsText = order.items.map(i => `• ${i.name} (${i.size || 'Standard'}) - ${i.quantity} x ₹${i.price} = ₹${i.quantity * i.price}`).join('%0A');
    let message = `Hello ${order.customerName}, this is regarding your order ${order.id} from Mishi!%0A%0A`;
    message += `*Order Details:*%0A${itemsText}%0A%0A`;
    message += `*Total: ₹${order.totalPrice}*%0A%0A`;
    message += `Let us know if you need any assistance!`;

    window.open(`https://api.whatsapp.com/send/?phone=91${cleanPhone}&text=${message}`, '_blank');
  };

  const renderInvoice = () => {
    if (!selectedOrder) return null;
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-xl" id="invoice-content">
        <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#2C392A] tracking-tighter">MISHI</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Premium Clothing Brand</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-900">INVOICE</h2>
            <p className="text-sm text-slate-500 font-medium">{selectedOrder.id}</p>
            <p className="text-xs text-slate-400 mt-1">Date: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</h3>
            <p className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</p>
            <p className="text-slate-600 text-sm">{selectedOrder.customerPhone}</p>
            {selectedOrder.customerEmail && <p className="text-slate-600 text-sm">{selectedOrder.customerEmail}</p>}
            {selectedOrder.customerAddress && <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap">{selectedOrder.customerAddress}</p>}
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 text-left font-bold text-slate-700 text-xs uppercase tracking-widest">Item</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700 text-xs uppercase tracking-widest">Qty</th>
                <th className="py-3 px-4 text-right font-bold text-slate-700 text-xs uppercase tracking-widest">Price</th>
                <th className="py-3 px-4 text-right font-bold text-slate-700 text-xs uppercase tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    {item.size && <p className="text-xs text-slate-500">Size: {item.size}</p>}
                  </td>
                  <td className="py-4 px-4 text-center text-slate-700">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-slate-700">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {selectedOrder.couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Coupon ({selectedOrder.couponCode})</span>
                <span>-₹{selectedOrder.couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {selectedOrder.manualDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Discount</span>
                <span>-₹{selectedOrder.manualDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {selectedOrder.deliveryCharge > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Delivery</span>
                <span>₹{selectedOrder.deliveryCharge.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total</span>
              <span>₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-slate-400 mt-12 pt-6 border-t border-slate-100">
          Thank you for shopping with Mishi. This is a computer generated invoice.
        </div>
      </div>
    );
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      // Period filter
      if (o.createdAt) {
        const orderDate = new Date(o.createdAt);
        if (period === 'Today' && orderDate.toDateString() !== now.toDateString()) return false;
        if (period === 'Week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          if (orderDate < oneWeekAgo) return false;
        }
        if (period === 'Month' && (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear())) return false;
        if (period === 'Year' && orderDate.getFullYear() !== now.getFullYear()) return false;
        if (period === 'Custom' && customFrom && customTo) {
          const from = new Date(customFrom);
          const to = new Date(customTo);
          to.setHours(23, 59, 59, 999);
          if (orderDate < from || orderDate > to) return false;
        }
      }

      // Search filter
      return (
        o.id.toLowerCase().includes(search.toLowerCase()) || 
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search)
      );
    });
  }, [orders, search, period, customFrom, customTo]);

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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track and update e-commerce orders</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">SORT:</span>
          <div className="flex flex-wrap items-center bg-slate-50 rounded-full border border-slate-200 p-1 shadow-sm text-xs font-bold text-slate-600">
            {['All Time', 'Today', 'Week', 'Month', 'Year', 'Custom'].map(f => (
              <button 
                key={f}
                onClick={() => setPeriod(f)}
                className={`px-4 py-1.5 rounded-full transition-colors ${period === f ? 'text-white shadow-sm' : 'hover:bg-slate-100'}`}
                style={{ backgroundColor: period === f ? themeColor : 'transparent' }}
              >
                {f}
              </button>
            ))}
          </div>

          {period === 'Custom' && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-full border border-slate-200 px-3 py-1 shadow-sm text-xs font-bold text-slate-700 animate-in slide-in-from-left-2">
              <span className="text-[10px] text-slate-400">FROM</span>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="outline-none bg-transparent" />
              <span className="text-[10px] text-slate-400">TO</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="outline-none bg-transparent" />
            </div>
          )}
        </div>
        
        <div className="relative w-full xl:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Order ID, Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 pl-11 pr-4 py-2.5 border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:border-slate-300 transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626]"></div>
        </div>
      ) : (
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                      No orders found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[10px] font-bold rounded-full px-3 py-1.5 border uppercase tracking-widest ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setSelectedOrder(order); setShowInvoiceView(false); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                {showInvoiceView && (
                  <button onClick={() => setShowInvoiceView(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{showInvoiceView ? 'Invoice' : 'Order Details'}</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{selectedOrder.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {showInvoiceView ? (
                  <button 
                    onClick={() => {
                      const printContent = document.getElementById('invoice-content');
                      const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
                      if (windowPrint && printContent) {
                        windowPrint.document.write('<html><head><title>Print Invoice</title>');
                        windowPrint.document.write('<script src="https://cdn.tailwindcss.com"></script>');
                        windowPrint.document.write('</head><body style="padding: 20px;">');
                        windowPrint.document.write(printContent.innerHTML);
                        windowPrint.document.write('</body></html>');
                        windowPrint.document.close();
                        setTimeout(() => {
                          windowPrint.focus();
                          windowPrint.print();
                          windowPrint.close();
                        }, 500);
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Printer size={14} /> Print
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowInvoiceView(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-200"
                  >
                    <FileText size={14} /> View Invoice
                  </button>
                )}
                
                <button 
                  disabled={updatingId !== null}
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Invoice permanently"
                >
                  <Trash2 size={14} /> Delete Invoice
                </button>

                <button 
                  onClick={() => { setSelectedOrder(null); setShowInvoiceView(false); }}
                  className="p-2 ml-1 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 shadow-sm cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {showInvoiceView ? renderInvoice() : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer Information</h4>
                    <button 
                      onClick={() => handleWhatsAppCustomer(selectedOrder)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={12} /> WhatsApp Customer
                    </button>
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{selectedOrder.customerName}</p>
                  <p className="text-slate-600 text-xs font-medium">{selectedOrder.customerPhone}</p>
                  {selectedOrder.customerEmail && (
                    <p className="text-slate-600 text-xs font-medium mt-1">{selectedOrder.customerEmail}</p>
                  )}
                </div>
                
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Order Status Action</h4>
                  <div className="relative inline-block w-full">
                    <select
                      value={selectedOrder.status}
                      disabled={updatingId !== null}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none cursor-pointer uppercase text-slate-700"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Processing">Processing</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="mt-3 flex justify-between text-xs font-medium text-slate-600">
                    <span>Source:</span>
                    <span className="font-bold uppercase tracking-widest text-[#2C392A]">{selectedOrder.source}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Shipping Address</h4>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                    {selectedOrder.customerAddress || 'Walk-in / POS Purchase'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Order Items</h4>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-medium">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                          <th className="py-3 px-4 text-left">Product</th>
                          <th className="py-3 px-4 text-center">Qty</th>
                          <th className="py-3 px-4 text-right">Price</th>
                          <th className="py-3 px-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{item.name}</p>
                              {item.size && <p className="text-xs text-slate-500">Size: {item.size}</p>}
                            </td>
                            <td className="py-3 px-4 text-center text-slate-700">{item.quantity}</td>
                            <td className="py-3 px-4 text-right text-slate-700">₹{item.price.toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4 text-right font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.couponDiscount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-red-500">
                        <span>Coupon Discount ({selectedOrder.couponCode})</span>
                        <span>-₹{selectedOrder.couponDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {selectedOrder.manualDiscount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-red-500">
                        <span>Manual Discount</span>
                        <span>-₹{selectedOrder.manualDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {selectedOrder.deliveryCharge > 0 && (
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Delivery</span>
                        <span>₹{selectedOrder.deliveryCharge.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-200 mt-2">
                      <span className="uppercase tracking-widest">Grand Total</span>
                      <span className="text-lg">₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
              </>
            )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
