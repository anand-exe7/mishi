'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

type Variant = {
  id: string;
  name: string;
  type: 'Standard' | 'Custom Size';
  price: number;
  stock: number;
  notes?: string;
};

type Product = {
  id: string;
  name: string;
  base_price: number;
  total_stock: number;
  variants: Variant[];
};

const mockProducts: Product[] = [
  {
    id: 'P1',
    name: 'Orthopedic Sleep Mattress',
    base_price: 12000,
    total_stock: 45,
    variants: [
      { id: 'V1', name: 'Queen (60x72)', type: 'Standard', price: 12000, stock: 20 },
      { id: 'V2', name: 'King (72x72)', type: 'Standard', price: 15000, stock: 15 },
      { id: 'V3', name: 'Custom Size (65x75)', type: 'Custom Size', price: 14500, stock: 10, notes: 'Dimensions: 65x75' },
    ]
  },
  {
    id: 'P2',
    name: 'Luxury Spring Mattress',
    base_price: 18000,
    total_stock: 12,
    variants: [
      { id: 'V4', name: 'Queen (60x72)', type: 'Standard', price: 18000, stock: 12 },
    ]
  }
];

export default function InventoryManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Inventory Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage products, variants, and stock</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm w-full focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-full text-sm transition-colors whitespace-nowrap">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Total Stock</th>
                <th className="px-6 py-4">Variants</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">₹{product.base_price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${product.total_stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {product.total_stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                        className="text-emerald-600 font-bold hover:text-emerald-700 text-xs underline underline-offset-2"
                      >
                        {product.variants.length} Variants
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>

                  {expandedProduct === product.id && (
                    <tr>
                      <td colSpan={5} className="p-0 border-b border-slate-200 bg-slate-50">
                        <div className="p-6 inset-shadow-sm border-t border-slate-100">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-slate-700">Manage Variants</h4>
                            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                              <Plus size={14} /> Add Custom Size
                            </button>
                          </div>
                          
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs bg-slate-50">
                                  <th className="px-4 py-3 text-left">Variant Name</th>
                                  <th className="px-4 py-3 text-left">Type</th>
                                  <th className="px-4 py-3 text-right">Price</th>
                                  <th className="px-4 py-3 text-center">Stock</th>
                                  <th className="px-4 py-3 text-left">Notes (Dimensions)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {product.variants.map((variant) => (
                                  <tr key={variant.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-900">{variant.name}</td>
                                    <td className="px-4 py-3">
                                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${variant.type === 'Custom Size' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {variant.type}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-700 font-medium">₹{variant.price.toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3 text-center text-slate-700">{variant.stock}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-xs">{variant.notes || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
