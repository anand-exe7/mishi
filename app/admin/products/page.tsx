'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Image as ImageIcon, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  fetchProducts, 
  fetchCategories, 
  upsertProduct, 
  dbDeleteProduct, 
  insertCategory,
  updateCategory,
  dbDeleteCategory,
  Product, 
  ProductSize 
} from '@/lib/db';

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  // Edit Category state
  const [editingCatName, setEditingCatName] = useState<string | null>(null);
  const [editedCatNameValue, setEditedCatNameValue] = useState('');
  const [isEditingCategorySubmitting, setIsEditingCategorySubmitting] = useState(false);
  
  // New Category input state
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [herbs, setHerbs] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  const themeColor = '#2C392A'; // Match Mishi Green Theme

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedProducts, fetchedCats] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCats);
      if (fetchedCats.length > 0) {
        setCategory(fetchedCats[0]);
      }
    } catch (err) {
      console.error('Error loading products page data:', err);
      showToast('Failed to load catalog data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleProductStatus = async (product: Product) => {
    try {
      const updatedProduct = { ...product, isAvailable: !product.isAvailable };
      await upsertProduct(updatedProduct);
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      showToast(`Product availability updated!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this product? All its sizes will also be deleted.')) {
      try {
        await dbDeleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        showToast('Product deleted successfully', 'success');
      } catch (err) {
        console.error(err);
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setTamilName('');
    setCategory(categories[0] || '');
    setDescription('');
    setDetails('');
    setHerbs('');
    setHowToUse('');
    setIsAvailable(true);
    setImage('');
    setImageFile(null);
    setSizes([{ size: 'Standard', price: 0, isAvailable: true }]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setTamilName(product.tamilName || '');
    setCategory(product.category);
    setDescription(product.description);
    setDetails(product.details || '');
    setHerbs(product.herbs || '');
    setHowToUse(product.howToUse || '');
    setIsAvailable(product.isAvailable !== false);
    setImage(product.image || '');
    setImageFile(null);
    setSizes(product.sizes.length > 0 ? [...product.sizes] : [{ size: 'Standard', price: 0, isAvailable: true }]);
    setIsModalOpen(true);
  };

  const handleAddSizeRow = () => {
    setSizes([...sizes, { size: '', price: 0, isAvailable: true }]);
  };

  const handleSizeChange = (index: number, field: keyof ProductSize, value: any) => {
    setSizes(sizes.map((s, idx) => idx === index ? { ...s, [field]: value } : s));
  };

  const handleRemoveSizeRow = (index: number) => {
    if (sizes.length === 1) return;
    setSizes(sizes.filter((_, idx) => idx !== index));
  };

  const handleCreateCategory = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await insertCategory(newCategoryName.trim());
      setCategories([...categories, newCategoryName.trim()]);
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCatInput(false);
      showToast('Category created successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to create category: ${err?.message || err}`, 'error');
    }
  };

  const handleAddCategoryModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setIsCategorySubmitting(true);
      await insertCategory(newCatName.trim());
      setCategories([...categories, newCatName.trim()]);
      setNewCatName('');
      showToast('Category added successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to add category: ${err?.message || err}`, 'error');
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleStartEditCategory = (catName: string) => {
    setEditingCatName(catName);
    setEditedCatNameValue(catName);
  };

  const handleCancelEditCategory = () => {
    setEditingCatName(null);
    setEditedCatNameValue('');
  };

  const handleSaveEditedCategory = async (oldCatName: string) => {
    const trimmedNewName = editedCatNameValue.trim();
    if (!trimmedNewName) {
      showToast('Category name cannot be empty', 'error');
      return;
    }
    if (trimmedNewName === oldCatName) {
      setEditingCatName(null);
      return;
    }
    try {
      setIsEditingCategorySubmitting(true);
      await updateCategory(oldCatName, trimmedNewName);
      setCategories(prev => prev.map(c => c === oldCatName ? trimmedNewName : c));
      if (category === oldCatName) {
        setCategory(trimmedNewName);
      }
      await loadData();
      setEditingCatName(null);
      showToast(`Category renamed successfully!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to update category: ${err?.message || err}`, 'error');
    } finally {
      setIsEditingCategorySubmitting(false);
    }
  };

  const handleDeleteCategoryModal = async (catName: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }
    try {
      await dbDeleteCategory(catName);
      setCategories(categories.filter(c => c !== catName));
      if (category === catName) {
        setCategory(categories.filter(c => c !== catName)[0] || '');
      }
      showToast('Category deleted successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to delete category: ${err?.message || err}`, 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (sizes.some(s => !s.size.trim() || s.price <= 0)) {
      alert("All sizes must have valid names and prices greater than 0.");
      return;
    }

    try {
      setSaving(true);
      const productId = editingProduct?.id || `prod-${Date.now()}`;
      
      const newProduct: Product = {
        id: productId,
        name,
        tamilName: tamilName || undefined,
        category,
        description,
        details: details || undefined,
        herbs: herbs || undefined,
        howToUse: howToUse || undefined,
        isAvailable,
        sizes,
        image,
        benefits: editingProduct?.benefits || []
      };

      const uploadedUrl = await upsertProduct(newProduct, imageFile || undefined);
      if (uploadedUrl) {
        newProduct.image = uploadedUrl;
      }

      await loadData();
      setIsModalOpen(false);
      showToast(editingProduct ? 'Product updated successfully!' : 'Product created successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Error saving product: ${err?.message || err}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto text-slate-900 font-sans p-2">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 font-medium text-sm transition-all animate-in slide-in-from-top-2
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}
        `}>
          {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-rose-500" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Products Catalog</h1>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Manage Mishi herbal products, sizes, prices, and Supabase synced content</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Manage Categories
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
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
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626]"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Tamil Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Sizes & Pricing</th>
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
                      <div>
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {product.tamilName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-center justify-center">
                        {product.sizes.map((s, i) => (
                          <span key={i} className="text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {s.size}: ₹{s.price} {s.isAvailable === false && <span className="text-red-500 font-extrabold">(Out)</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleToggleProductStatus(product)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${product.isAvailable !== false ? 'bg-[#2C392A]' : 'bg-slate-200'}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.isAvailable !== false ? 'translate-x-4.5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
      )}      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {editingProduct ? 'Edit Mishi Product' : 'Add New Mishi Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Product Image</label>
                  <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full ${image ? 'h-40' : 'h-32'} border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden`}>
                    {image ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-white p-2">
                        <img src={image} alt="Preview" className="h-full w-auto object-contain rounded-lg" />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); setImage(''); setImageFile(null); }} 
                          className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full text-red-500 shadow-sm hover:bg-red-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="mb-1 text-xs text-slate-500"><span className="font-bold">Click to upload</span> or drag/drop</p>
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
                          setImageFile(file);
                          setImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name *</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
                      placeholder="e.g. Pure Sambrani Cup"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tamil Name</label>
                    <input 
                      type="text" 
                      value={tamilName}
                      onChange={e => setTamilName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none"
                      placeholder="e.g. சாம்பிராணி"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowNewCatInput(!showNewCatInput)}
                      className="text-[10px] text-[#dc2626] font-bold hover:underline cursor-pointer"
                    >
                      {showNewCatInput ? 'Cancel' : '+ New Category'}
                    </button>
                  </div>
                  
                  {showNewCatInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        placeholder="Category Name"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                      />
                      <button
                        onClick={handleCreateCategory}
                        className="bg-emerald-600 text-white text-xs px-3 py-2 rounded-xl font-bold cursor-pointer hover:bg-emerald-700"
                      >
                        Create
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Status</span>
                    <button 
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAvailable ? 'bg-[#dc2626]' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Short Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none resize-none"
                  placeholder="Summarize product benefits..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Details / Specs</label>
                  <input 
                    type="text" 
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900"
                    placeholder="Dimensions, packaging..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Herbs Included</label>
                  <input 
                    type="text" 
                    value={herbs}
                    onChange={e => setHerbs(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900"
                    placeholder="Vetiver, Tulsi..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">How to Use</label>
                  <input 
                    type="text" 
                    value={howToUse}
                    onChange={e => setHowToUse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900"
                    placeholder="Light with match..."
                  />
                </div>
              </div>

              {/* Sizes Variants Section */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Size Variants & Prices *</span>
                  <button
                    type="button"
                    onClick={handleAddSizeRow}
                    className="text-xs text-[#dc2626] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add Size Variant
                  </button>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {sizes.map((s, index) => (
                    <div key={index} className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 items-center bg-slate-50 border border-slate-150 p-2 sm:p-2.5 rounded-xl">
                      <div className="flex-1 min-w-[110px]">
                        <input
                           type="text"
                           required
                           value={s.size}
                           placeholder="e.g. 100g, 200ml"
                           onChange={e => handleSizeChange(index, 'size', e.target.value)}
                           className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      
                      <div className="w-24 sm:w-28">
                        <input
                           type="number"
                           required
                           min="0"
                           value={s.price || ''}
                           placeholder="Price (₹)"
                           onChange={e => handleSizeChange(index, 'price', Number(e.target.value))}
                           className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
                        <button
                          type="button"
                          onClick={() => handleSizeChange(index, 'isAvailable', s.isAvailable !== false ? false : true)}
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${s.isAvailable !== false ? 'bg-emerald-600' : 'bg-slate-200'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${s.isAvailable !== false ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={sizes.length === 1}
                        onClick={() => handleRemoveSizeRow(index)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: themeColor }}
                >
                  {saving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Manage Categories
              </h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6">
              {/* Add New Category Section */}
              <form onSubmit={handleAddCategoryModal} className="space-y-2.5 bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Add New Category</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400 min-w-0"
                    placeholder="e.g. Wellness, Gifts"
                  />
                  <button 
                    type="submit"
                    disabled={isCategorySubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 sm:px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isCategorySubmitting ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>

              {/* Category List */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Categories ({categories.length})</label>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto border border-slate-100 rounded-2xl bg-white p-1.5 sm:p-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex justify-between items-center py-2 px-2.5 sm:px-3 hover:bg-slate-50 rounded-xl transition-colors gap-2">
                      {editingCatName === cat ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            type="text"
                            value={editedCatNameValue}
                            onChange={e => setEditedCatNameValue(e.target.value)}
                            className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-500 min-w-0"
                            autoFocus
                          />
                          <button 
                            type="button"
                            disabled={isEditingCategorySubmitting}
                            onClick={() => handleSaveEditedCategory(cat)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Save Category Name"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button 
                            type="button"
                            onClick={handleCancelEditCategory}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Cancel Edit"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider truncate">{cat}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Category Name"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteCategoryModal(cat)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-center py-6 text-xs text-slate-400 italic font-medium">No categories available.</p>
                  )}
                </div>
              </div>

            </div>
            
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
