'use client';

import React, { useState, useEffect } from 'react';
import { Search, Edit2, HelpCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { fetchProducts, upsertProduct, Product, ProductSize } from '@/lib/db';
import Link from 'next/link';

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load inventory products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleSizeAvailability = async (product: Product, sizeIndex: number) => {
    try {
      setUpdatingId(`${product.id}-${sizeIndex}`);
      const updatedSizes = product.sizes.map((s, idx) => 
        idx === sizeIndex ? { ...s, isAvailable: s.isAvailable !== false ? false : true } : s
      );
      const updatedProduct = { ...product, sizes: updatedSizes };
      await upsertProduct(updatedProduct);
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
    } catch (err) {
      console.error(err);
      alert('Failed to update size availability.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Inventory Control Center</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitor product sizes, stock availability status, and price tiers</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products & categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm w-full focus:outline-none focus:border-[#2C392A]"
            />
          </div>
          <Link 
            href="/admin/products"
            className="flex items-center justify-center gap-2 px-5 py-2 bg-[#2C392A] hover:bg-[#1e271d] text-white font-bold rounded-full text-xs transition-colors whitespace-nowrap"
          >
            Manage Catalog
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C392A]"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Variants / Sizes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((product) => {
                  const outOfStockVariants = product.sizes.filter(s => s.isAvailable === false).length;
                  const totalVariants = product.sizes.length;
                  const hasOutOfStock = outOfStockVariants > 0;

                  return (
                    <React.Fragment key={product.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">IMG</span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{product.name}</span>
                            {product.tamilName && <p className="text-[10px] text-slate-400 font-medium">{product.tamilName}</p>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {product.isAvailable === false ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                              DISABLED (CATALOG)
                            </span>
                          ) : hasOutOfStock ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1.5 justify-center max-w-[150px] mx-auto">
                              <AlertTriangle size={12} /> {outOfStockVariants}/{totalVariants} OUT
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                              ALL AVAILABLE
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                            className="text-blue-600 font-bold hover:text-blue-700 text-xs underline underline-offset-2 cursor-pointer"
                          >
                            {totalVariants} Size Tiers
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            href="/admin/products"
                            className="p-1.5 inline-block text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </Link>
                        </td>
                      </tr>

                      {expandedProduct === product.id && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-slate-200 bg-slate-50/50">
                            <div className="p-6 border-t border-slate-100 max-w-4xl mx-auto">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Size Options & Availability</h4>
                              </div>
                              
                              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-slate-150 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50">
                                      <th className="px-4 py-3 text-left">Size Tier</th>
                                      <th className="px-4 py-3 text-right">Price (₹)</th>
                                      <th className="px-4 py-3 text-center">Status</th>
                                      <th className="px-4 py-3 text-right">Toggle Availability</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-medium">
                                    {product.sizes.map((variant, index) => {
                                      const isSizeAvail = variant.isAvailable !== false;
                                      return (
                                        <tr key={index} className="hover:bg-slate-50">
                                          <td className="px-4 py-3 font-bold text-slate-900">{variant.size}</td>
                                          <td className="px-4 py-3 text-right text-slate-900 font-black">₹{variant.price.toLocaleString('en-IN')}</td>
                                          <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${isSizeAvail ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                              {isSizeAvail ? 'IN STOCK' : 'OUT OF STOCK'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                            <button 
                                              disabled={updatingId === `${product.id}-${index}`}
                                              onClick={() => handleToggleSizeAvailability(product, index)}
                                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                                                isSizeAvail 
                                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100' 
                                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100'
                                              }`}
                                            >
                                              {isSizeAvail ? <><EyeOff size={12} /> Mark Out</> : <><Eye size={12} /> Mark In</>}
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
