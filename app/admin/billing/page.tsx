'use client';

import React, { useState } from 'react';
import { User, FileText, Trash2, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAdmin, Order } from '../AdminContext';

export default function POSBillingPanel() {
  const { addOrder } = useAdmin();
  const [orderType, setOrderType] = useState<'Offline' | 'Online'>('Offline');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<Array<{ id: number; name: string; price: number; qty: number }>>([]);
  const [coupon, setCoupon] = useState('No Coupon');
  const [manualDiscount, setManualDiscount] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [amountReceived, setAmountReceived] = useState('');

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const grandTotal = Math.max(0, subtotal - manualDiscount + delivery);

  const addCustomItem = () => {
    setItems([...items, { id: Date.now(), name: '', price: 0, qty: 1 }]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSendBill = () => {
    // Validation
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!customerName.trim() || items.length === 0) {
      alert("Please enter customer name and at least one item.");
      return;
    }

    // Prepare Context Order Object
    const newOrder: Order = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      customer_name: customerName,
      customer_phone: cleanPhone,
      source: orderType,
      status: 'Completed',
      total_amount: grandTotal,
      discount_amount: manualDiscount,
      delivery_amount: delivery,
      items: items.map(i => ({
        product_name: i.name || 'Custom Item',
        variant: 'Standard',
        size: '-',
        quantity: i.qty,
        unit_price: i.price
      }))
    };

    // Build WhatsApp Message String
    const itemsText = items.map(i => `• ${i.name || 'Item'} - ${i.qty} x ₹${i.price} = ₹${i.qty * i.price}`).join('%0A');
    let message = `Hello ${customerName}, thank you for purchasing from Mishi!%0A%0A`;
    message += `*Your Bill Details:*%0A${itemsText}%0A%0A`;
    message += `Subtotal: ₹${subtotal}%0A`;
    if (manualDiscount > 0) message += `Discount: -₹${manualDiscount}%0A`;
    if (delivery > 0) message += `Delivery: ₹${delivery}%0A`;
    message += `*Grand Total: ₹${grandTotal}*%0A%0A`;
    message += `Have a great day!`;

    // 1. Save globally to update Analytics and Orders
    addOrder(newOrder);

    // 2. Open WhatsApp in new tab
    window.open(`https://wa.me/91${cleanPhone}?text=${message}`, '_blank');

    // 3. Clear form
    setCustomerName('');
    setCustomerPhone('');
    setItems([]);
    setManualDiscount(0);
    setDelivery(0);
    setAmountReceived('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-[#dc2626] rounded-full"></div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">POS Billing Panel</h1>
          <span className="text-slate-300 mx-2">|</span>
          <p className="text-xs font-medium text-slate-500 mt-1">Quick invoice generator & database synced checkout</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 p-1 shadow-sm">
          <button 
            onClick={() => setOrderType('Offline')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${orderType === 'Offline' ? 'bg-slate-50 border border-slate-200 shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className={`w-2 h-2 rounded-full ${orderType === 'Offline' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
            OFFLINE (POS)
          </button>
          <button 
            onClick={() => setOrderType('Online')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${orderType === 'Online' ? 'bg-slate-50 border border-slate-200 shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className={`w-2 h-2 rounded-full ${orderType === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            ONLINE ORDER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-6">
              <User size={18} className="text-[#dc2626]" /> Customer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Customer Name</label>
                <input 
                  type="text" 
                  placeholder="Enter name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-300 transition-colors placeholder:text-slate-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mobile Number (WhatsApp)</label>
                <input 
                  type="text" 
                  placeholder="Enter 10-digit number"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-300 transition-colors placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <FileText size={18} className="text-[#dc2626]" /> Order Items
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => setItems([])}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  Clear Order
                </button>
                <button 
                  onClick={addCustomItem}
                  className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-full transition-colors"
                >
                  + Add Custom Item
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-500 italic">
                No items added to this bill. Add custom items or select from catalog.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">
                  <div className="col-span-6">Item Name / Description</div>
                  <div className="col-span-3 text-center">Price (₹)</div>
                  <div className="col-span-3 text-center">Qty</div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 border border-slate-100 p-2 rounded-xl">
                    <div className="col-span-6 flex gap-2">
                      <input 
                        type="text"
                        placeholder="Type custom product description..."
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-300"
                      />
                    </div>
                    <div className="col-span-3 flex justify-center">
                      <input 
                        type="number"
                        value={item.price || ''}
                        onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                        className="w-24 text-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-slate-300"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-3 flex justify-center items-center gap-3">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-9">
                        <button 
                          onClick={() => updateItem(item.id, 'qty', Math.max(1, item.qty - 1))}
                          className="px-3 text-red-500 font-bold hover:bg-slate-50"
                        >-</button>
                        <span className="text-sm font-bold text-slate-800 w-6 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateItem(item.id, 'qty', item.qty + 1)}
                          className="px-3 text-red-500 font-bold hover:bg-slate-50"
                        >+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Summary & Payment) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            
            {/* Source Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-4 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-widest">Source</span>
                <span className={`font-black uppercase ${orderType === 'Offline' ? 'text-amber-600' : 'text-emerald-600'}`}>{orderType}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Customer</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{customerName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{customerPhone || '-'}</span>
                </div>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Apply Coupon</label>
                <div className="relative">
                  <select 
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    <option>No Coupon</option>
                    <option>FESTIVE500</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Manual Discount</label>
                <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="px-3 py-2.5 border-r border-slate-200 flex items-center bg-white">
                    <span className="text-sm font-bold text-slate-600">₹</span>
                  </div>
                  <input 
                    type="number" 
                    value={manualDiscount || ''}
                    onChange={e => setManualDiscount(Number(e.target.value))}
                    className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none font-medium"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-5">
                <span className="text-slate-500">Subtotal ({items.length} items)</span>
                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-5">
                <span className="text-slate-500">Delivery</span>
                <input 
                  type="number" 
                  value={delivery || ''}
                  onChange={e => setDelivery(Number(e.target.value))}
                  className="w-20 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none font-bold"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-between items-end pt-2">
                <span className="text-sm font-black uppercase tracking-widest text-slate-800">Grand Total</span>
                <span className="text-2xl font-black text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Cash Payment Section */}
            <div className="mt-8 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Cash Payment</h3>
              <label className="block text-xs font-bold text-slate-600 mb-1">Amount Received (₹)</label>
              <input 
                type="number" 
                value={amountReceived}
                onChange={e => setAmountReceived(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none font-bold"
                placeholder="0.00"
              />
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSendBill}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest shadow-md hover:shadow-lg"
            >
              <CheckCircle2 size={18} /> Send Bill Via WhatsApp
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
