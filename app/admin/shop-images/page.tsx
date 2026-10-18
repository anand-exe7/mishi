'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, UploadCloud, Trash2, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { fetchShopImages, uploadShopImage, deleteShopImage, ShopImage } from '@/lib/db';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const SLOTS: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

type Toast = { message: string; type: 'success' | 'error' } | null;

export default function ShopImagesPage() {
  const [images, setImages] = useState<Record<number, ShopImage | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    try {
      setLoading(true);
      const rows = await fetchShopImages();
      const map: Record<number, ShopImage> = {};
      rows.forEach(r => { map[r.position] = r; });
      setImages(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFile = async (position: 1 | 2 | 3 | 4, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file (JPG, PNG, WEBP).', 'error');
      return;
    }
    if (file.size > MAX_BYTES) {
      showToast(`"${file.name}" is ${(file.size / 1024 / 1024).toFixed(2)} MB — the limit is 5 MB.`, 'error');
      return;
    }
    try {
      setSavingSlot(position);
      const saved = await uploadShopImage(position, file);
      setImages(prev => ({ ...prev, [position]: saved }));
      showToast(`Shop image #${position} updated.`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Failed to upload image.', 'error');
    } finally {
      setSavingSlot(null);
    }
  };

  const handleDelete = async (position: 1 | 2 | 3 | 4) => {
    if (!confirm(`Remove shop image #${position}?`)) return;
    try {
      setSavingSlot(position);
      await deleteShopImage(position);
      setImages(prev => ({ ...prev, [position]: undefined }));
      showToast(`Shop image #${position} removed.`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete.', 'error');
    } finally {
      setSavingSlot(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            <Camera className="text-[#2C392A]" size={22} /> Shop Images
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Upload up to 4 photos of your shop. They appear on the home page gallery.
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5">
          Max 4 images · 5 MB each
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Grid of 4 slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {SLOTS.map(position => {
          const img = images[position];
          const busy = savingSlot === position;

          return (
            <div
              key={position}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-300">
                {img?.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt={`Shop photo ${position}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon size={36} />
                    <span className="text-xs font-bold uppercase tracking-widest">No image yet</span>
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-slate-700 rounded-full px-2.5 py-1 border border-slate-200 shadow-sm">
                  Slot {position}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <input
                  ref={el => { inputRefs.current[position] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0] || null;
                    handleFile(position, f);
                    e.target.value = '';
                  }}
                />

                <button
                  onClick={() => inputRefs.current[position]?.click()}
                  disabled={busy || loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2C392A] hover:bg-[#1e271d] text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-sm cursor-pointer disabled:opacity-60"
                >
                  <UploadCloud size={14} />
                  {busy ? 'Uploading…' : img ? 'Replace Image' : 'Upload Image'}
                </button>

                {img && (
                  <button
                    onClick={() => handleDelete(position)}
                    disabled={busy}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs uppercase tracking-widest border border-rose-200 cursor-pointer disabled:opacity-60"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}

                <p className="text-[10px] text-slate-400 font-medium text-center">
                  JPG, PNG or WEBP — up to 5 MB
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Setup help */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
        <p className="font-bold mb-1">First-time setup</p>
        <p className="font-medium leading-relaxed">
          If uploads fail, create a public storage bucket named <code className="bg-white border border-amber-200 rounded px-1 py-0.5">shop-images</code> and
          a table <code className="bg-white border border-amber-200 rounded px-1 py-0.5">shop_images</code> in Supabase.
          See the on-screen help in the page docs — this feature doesn't touch any existing data.
        </p>
      </div>
    </div>
  );
}
