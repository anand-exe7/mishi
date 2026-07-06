'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  image?: string;
};

const initialProducts: Product[] = [
  { id: '1', name: 'Bath Powder', category: 'Personal Care', price: 250, stock: 150, isActive: true },
  { id: '2', name: 'Herbal Hair Oil', category: 'Hair Care', price: 350, stock: 45, isActive: true },
  { id: '3', name: 'Multi Millet Health Mix', category: 'Health Foods', price: 400, stock: 0, isActive: false },
  { id: '4', name: 'Herbal Shikakai Powder', category: 'Hair Care', price: 200, stock: 89, isActive: true },
];

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Personal Care',
    price: '',
    stock: '',
    isActive: true,
    image: ''
  });

  const themeColor = '#E75F24';

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: 'Personal Care', price: '', stock: '', isActive: true, image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      isActive: product.isActive,
      image: product.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        isActive: formData.isActive,
        image: formData.image
      } : p));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        isActive: formData.isActive,
        image: formData.image
      };
      setProducts([newProduct, ...products]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto text-slate-900 font-sans p-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Products Inventory</h1>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Manage your catalog, pricing, and stock levels</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md hover:shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-300 placeholder:text-slate-400 transition-colors"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400 overflow-hidden relative">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={18} />
                      )}
                    </div>
                    <span className="font-bold text-slate-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                      {product.stock} {product.stock === 0 && <span className="text-[10px] uppercase ml-1">(Out)</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => handleToggleStatus(product.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${product.isActive ? 'bg-[#E75F24]' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-4.5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-sm text-slate-500 font-medium">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Product Image</label>
                <div className="flex flex-col items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full ${formData.image ? 'h-40' : 'h-32'} border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden`}>
                    {formData.image ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-white p-2">
                        <img src={formData.image} alt="Preview" className="h-full w-auto object-contain rounded-lg" />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); setFormData({...formData, image: ''}); }} 
                          className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full text-red-500 shadow-sm hover:bg-red-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="mb-1 text-xs text-slate-500"><span className="font-bold">Click to upload</span> or drag and drop</p>
                        <p className="text-[10px] text-slate-400">PNG, JPG or WEBP (Max 2MB)</p>
                      </div>
                    )}
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setFormData({...formData, image: url});
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                  placeholder="e.g. Herbal Hair Oil"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                  >
                    <option value="Personal Care">Personal Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Health Foods">Health Foods</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Price (₹) *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Stock Level *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                    placeholder="0"
                  />
                </div>
                
                <div className="flex flex-col justify-center pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Status</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isActive ? 'bg-[#E75F24]' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  type="submit"
                  className="w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm tracking-wide"
                  style={{ backgroundColor: themeColor }}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
