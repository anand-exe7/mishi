'use client';

import React, { useState, useEffect } from 'react';
import { User, FileText, Trash2, CheckCircle2, ChevronDown, Search, Plus } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { fetchProducts, fetchCoupons, Product, Coupon, Order, OrderItem } from '@/lib/db';

export default function POSBillingPanel() {
  const { addOrder } = useAdmin();
  const [orderType, setOrderType] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Billing items: { productId, name, size, qty, price }
  const [items, setItems] = useState<Array<{ productId: string; name: string; size: string; qty: number; price: number }>>([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState('No Coupon');
  const [manualDiscount, setManualDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'AMOUNT' | 'PERCENTAGE'>('AMOUNT');
  const [delivery, setDelivery] = useState(0);
  const [amountReceived, setAmountReceived] = useState('');

  // Catalog selection states
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedCoupons] = await Promise.all([
          fetchProducts(),
          fetchCoupons()
        ]);
        setProducts(fetchedProducts);
        setCoupons(fetchedCoupons.filter(c => c.status === 'ACTIVE'));
      } catch (err) {
        console.error('Error fetching billing panel catalog data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCatalogData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(catalogSearch.toLowerCase()) && p.isAvailable !== false
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    if (product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
    } else {
      setSelectedSize('Standard');
    }
  };

  const addSelectedProductToBill = () => {
    if (!selectedProduct) return;
    
    let price = 0;
    if (selectedProduct.sizes.length > 0) {
      const sizeObj = selectedProduct.sizes.find(s => s.size === selectedSize);
      price = sizeObj ? sizeObj.price : selectedProduct.sizes[0].price;
    }

    const existingIndex = items.findIndex(
      i => i.productId === selectedProduct.id && i.size === selectedSize
    );

    if (existingIndex > -1) {
      setItems(items.map((item, idx) => 
        idx === existingIndex ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setItems([...items, {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        size: selectedSize,
        qty: 1,
        price: price
      }]);
    }

    // Reset selection
    setSelectedProduct(null);
    setCatalogSearch('');
  };

  const addCustomItem = () => {
    setItems([...items, { 
      productId: `custom-${Date.now()}`, 
      name: 'Custom Product', 
      size: 'Standard', 
      qty: 1, 
      price: 0 
    }]);
  };

  const updateItem = (productId: string, size: string, field: string, value: string | number) => {
    setItems(items.map(item => 
      item.productId === productId && item.size === size ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (productId: string, size: string) => {
    setItems(items.filter(item => !(item.productId === productId && item.size === size)));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Calculate Coupon discount dynamically
  const couponDiscount = (() => {
    if (selectedCouponCode === 'No Coupon') return 0;
    const matched = coupons.find(c => c.code === selectedCouponCode);
    if (!matched) return 0;
    if (subtotal < matched.minOrder) return 0;
    return Math.round((subtotal * matched.discount) / 100);
  })();

  const calculatedManualDiscount = discountType === 'PERCENTAGE' 
    ? Math.round((subtotal * manualDiscount) / 100) 
    : manualDiscount;

  const grandTotal = Math.max(0, subtotal - couponDiscount - calculatedManualDiscount + delivery);

  const handleSendBill = async () => {
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!customerName.trim() || items.length === 0) {
      alert("Please enter customer name and at least one item.");
      return;
    }

    const received = Number(amountReceived) || 0;
    const change = Math.max(0, received - grandTotal);

    // Generate Supabase compatible Order object
    const newOrder: Order = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: customerName,
      customerPhone: cleanPhone,
      customerAddress: customerAddress || (orderType === 'OFFLINE' ? 'Walk-in' : ''),
      source: orderType,
      status: 'Completed',
      subtotal,
      totalPrice: grandTotal,
      couponCode: selectedCouponCode !== 'No Coupon' ? selectedCouponCode : undefined,
      couponDiscount,
      manualDiscount: calculatedManualDiscount,
      deliveryCharge: delivery,
      cashReceived: received,
      changeReturned: change,
      items: items.map(i => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        quantity: i.qty,
        price: i.price
      }))
    };

    try {
      // 1. Write order to Supabase
      await addOrder(newOrder);

      // 2. Format WhatsApp Message
      const itemsText = items.map(i => `• ${i.name} (${i.size}) - ${i.qty} x ₹${i.price} = ₹${i.qty * i.price}`).join('%0A');
      let message = `Hello ${customerName}, thank you for purchasing from Mishi!%0A%0A`;
      message += `*Your Bill Details:*%0A${itemsText}%0A%0A`;
      message += `Subtotal: ₹${subtotal}%0A`;
      if (couponDiscount > 0) message += `Coupon Discount (${selectedCouponCode}): -₹${couponDiscount}%0A`;
      if (calculatedManualDiscount > 0) message += `Manual Discount: -₹${calculatedManualDiscount}%0A`;
      if (delivery > 0) message += `Delivery: ₹${delivery}%0A`;
      message += `*Grand Total: ₹${grandTotal}*%0A%0A`;
      message += `Have a great day!`;

      // 3. Open WhatsApp Web
      window.open(`https://wa.me/91${cleanPhone}?text=${message}`, '_blank');

      // 4. Reset checkout form
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setItems([]);
      setSelectedCouponCode('No Coupon');
      setManualDiscount(0);
      setDiscountType('AMOUNT');
      setDelivery(0);
      setAmountReceived('');
      alert("Invoice processed and saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving order to Supabase database. Please try again.");
    }
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
            onClick={() => setOrderType('OFFLINE')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${orderType === 'OFFLINE' ? 'bg-slate-50 border border-slate-200 shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className={`w-2 h-2 rounded-full ${orderType === 'OFFLINE' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
            OFFLINE (POS)
          </button>
          <button 
            onClick={() => setOrderType('ONLINE')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${orderType === 'ONLINE' ? 'bg-slate-50 border border-slate-200 shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className={`w-2 h-2 rounded-full ${orderType === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
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
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-300 transition-colors placeholder:text-slate-400 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mobile Number (WhatsApp)</label>
                <div className="flex bg-slate-50 border border-slate-100 rounded-xl overflow-hidden focus-within:border-slate-300 transition-colors">
                  <div className="pl-4 pr-3 flex items-center border-r border-slate-100 bg-slate-100">
                    <span className="text-sm font-bold text-slate-500">+91</span>
                  </div>
                  <input 
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-slate-400 font-bold text-slate-900"
                  />
                </div>
              </div>
              {orderType === 'ONLINE' && (
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Delivery Address</label>
                  <textarea 
                    placeholder="Enter full shipping/delivery address"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-300 transition-colors placeholder:text-slate-400 font-bold text-slate-900 resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Browse Catalog Search */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4">
              <Search size={18} className="text-[#dc2626]" /> Browse Catalog
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products in catalog..."
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300"
                />
              </div>
            </div>

            {catalogSearch.trim().length > 0 && (
              <div className="border border-slate-100 rounded-xl bg-slate-50 p-2 max-h-48 overflow-y-auto mb-4 divide-y divide-slate-100">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="w-full text-left p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all flex justify-between items-center text-xs font-bold"
                  >
                    <span>{p.name}</span>
                    <span className="text-slate-400 uppercase tracking-widest">{p.category}</span>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="p-3 text-center text-xs text-slate-400 italic">No products found</div>
                )}
              </div>
            )}

            {selectedProduct && (
              <div className="bg-[#dc2626]/5 border border-[#dc2626]/10 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Selected: {selectedProduct.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{selectedProduct.category}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {selectedProduct.sizes.length > 0 && (
                    <div className="relative">
                      <select
                        value={selectedSize}
                        onChange={e => setSelectedSize(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        {selectedProduct.sizes.map(s => (
                          <option key={s.size} value={s.size}>{s.size} - ₹{s.price}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  )}
                  <button
                    onClick={addSelectedProductToBill}
                    className="bg-[#dc2626] hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add to Bill
                  </button>
                </div>
              </div>
            )}
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
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                >
                  Clear Order
                </button>
                <button 
                  onClick={addCustomItem}
                  className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-full transition-colors cursor-pointer"
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
                  <div key={`${item.productId}-${item.size}`} className="grid grid-cols-12 gap-4 items-center bg-slate-50 border border-slate-100 p-2 rounded-xl">
                    <div className="col-span-6 flex flex-col justify-center">
                      {item.productId.startsWith('custom-') ? (
                        <input 
                          type="text"
                          placeholder="Type custom product description..."
                          value={item.name}
                          onChange={e => updateItem(item.productId, item.size, 'name', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-300 text-slate-900 font-bold"
                        />
                      ) : (
                        <div className="px-3 py-2">
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Size: {item.size}</p>
                        </div>
                      )}
                    </div>
                    <div className="col-span-3 flex justify-center">
                      <input 
                        type="number"
                        value={item.price || ''}
                        disabled={!item.productId.startsWith('custom-')}
                        onChange={e => updateItem(item.productId, item.size, 'price', Number(e.target.value))}
                        className="w-24 text-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-slate-300 disabled:opacity-80"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-3 flex justify-center items-center gap-3">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-9">
                        <button 
                          onClick={() => updateItem(item.productId, item.size, 'qty', Math.max(1, item.qty - 1))}
                          className="px-3 text-red-500 font-bold hover:bg-slate-50 cursor-pointer"
                        >-</button>
                        <span className="text-sm font-bold text-slate-800 w-6 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateItem(item.productId, item.size, 'qty', item.qty + 1)}
                          className="px-3 text-red-500 font-bold hover:bg-slate-50 cursor-pointer"
                        >+</button>
                      </div>
                      <button onClick={() => removeItem(item.productId, item.size)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg cursor-pointer">
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
                <span className={`font-black uppercase ${orderType === 'OFFLINE' ? 'text-amber-600' : 'text-emerald-600'}`}>{orderType}</span>
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
                    value={selectedCouponCode}
                    onChange={e => setSelectedCouponCode(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option>No Coupon</option>
                    {coupons.map(c => {
                      const isExhausted = c.usageLimit > 0 && c.usedCount >= c.usageLimit;
                      return (
                        <option key={c.code} value={c.code} disabled={subtotal < c.minOrder || isExhausted}>
                          {c.code} ({c.discount}% off, Min ₹{c.minOrder}) {isExhausted ? '(Limit Reached)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Manual Discount</label>
                <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <select 
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="px-3 py-2.5 border-r border-slate-200 bg-white text-sm font-bold text-slate-600 focus:outline-none cursor-pointer appearance-none text-center min-w-[40px]"
                  >
                    <option value="AMOUNT">₹</option>
                    <option value="PERCENTAGE">%</option>
                  </select>
                  <input 
                    type="number" 
                    value={manualDiscount || ''}
                    onChange={e => setManualDiscount(Number(e.target.value))}
                    className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none font-bold text-slate-900"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-5 font-medium">
                <span className="text-slate-500">Subtotal ({items.length} items)</span>
                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-red-600">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-5 font-medium">
                <span className="text-slate-500">Delivery Charge</span>
                <input 
                  type="number" 
                  value={delivery || ''}
                  onChange={e => setDelivery(Number(e.target.value))}
                  className="w-20 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none font-bold text-slate-900"
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
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none font-bold text-slate-900"
                placeholder="0.00"
              />
              {amountReceived && Number(amountReceived) >= grandTotal && (
                <div className="mt-3 flex justify-between items-center text-xs font-bold text-emerald-600 animate-in slide-in-from-top-2">
                  <span>Change Balance:</span>
                  <span>₹{(Number(amountReceived) - grandTotal).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSendBill}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest shadow-md hover:shadow-lg cursor-pointer"
            >
              <CheckCircle2 size={18} /> Send Bill Via WhatsApp
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
