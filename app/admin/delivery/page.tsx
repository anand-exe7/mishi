'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Plus, Trash2, Edit3, Save, CheckCircle2, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  fetchDeliveryRegions, 
  upsertDeliveryRegion, 
  dbDeleteDeliveryRegion, 
  setDeliveryTiers, 
  DeliveryRegion, 
  DeliveryTier 
} from '@/lib/db';

interface TierFormItem {
  minGrams: string;
  maxGrams: string; // empty string = no upper limit (infinity)
  charge: string;
}

export default function DeliveryManagement() {
  const [regions, setRegions] = useState<DeliveryRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRegionId, setSavingRegionId] = useState<string | null>(null);

  // Region Modal / Input
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<{ id?: string; name: string } | null>(null);
  const [regionNameInput, setRegionNameInput] = useState('');

  // Expanded Region Tiers Editing
  const [expandedRegionId, setExpandedRegionId] = useState<string | null>(null);
  const [tierForms, setTierForms] = useState<Record<string, TierFormItem[]>>({});

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDeliveryRegions(false);
      setRegions(data);

      // Initialize tier forms for each region (in grams)
      const initialForms: Record<string, TierFormItem[]> = {};
      data.forEach(r => {
        initialForms[r.id] = r.tiers.map(t => ({
          minGrams: t.minWeightGrams.toString(),
          maxGrams: t.maxWeightGrams !== null && t.maxWeightGrams !== undefined ? t.maxWeightGrams.toString() : '',
          charge: t.charge.toString(),
        }));
      });
      setTierForms(initialForms);
    } catch (err) {
      console.error(err);
      showToast('Failed to load delivery regions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveRegion = async () => {
    if (!regionNameInput.trim()) {
      showToast('Please enter a valid region name', 'error');
      return;
    }
    try {
      await upsertDeliveryRegion({
        id: editingRegion?.id,
        name: regionNameInput.trim(),
      });
      showToast(editingRegion?.id ? 'Region updated successfully' : 'New region created successfully', 'success');
      setShowRegionModal(false);
      setRegionNameInput('');
      setEditingRegion(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save region', 'error');
    }
  };

  const handleToggleRegionStatus = async (region: DeliveryRegion) => {
    try {
      await upsertDeliveryRegion({
        id: region.id,
        name: region.name,
        isActive: !region.isActive,
      });
      showToast(`Region "${region.name}" is now ${!region.isActive ? 'Active' : 'Inactive'}`, 'success');
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to update region status', 'error');
    }
  };

  const handleDeleteRegion = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete region "${name}" and all its weight tiers?`)) return;
    try {
      await dbDeleteDeliveryRegion(id);
      showToast('Region deleted', 'success');
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to delete region', 'error');
    }
  };

  const handleAddTierRow = (regionId: string) => {
    setTierForms(prev => {
      const existing = prev[regionId] || [];
      const lastMax = existing.length > 0 ? existing[existing.length - 1].maxGrams : '0';
      const newMin = lastMax ? lastMax : '0';
      return {
        ...prev,
        [regionId]: [
          ...existing,
          { minGrams: newMin, maxGrams: '', charge: '100' }
        ]
      };
    });
  };

  const handleRemoveTierRow = (regionId: string, index: number) => {
    setTierForms(prev => ({
      ...prev,
      [regionId]: (prev[regionId] || []).filter((_, i) => i !== index)
    }));
  };

  const handleTierFormChange = (regionId: string, index: number, field: keyof TierFormItem, value: string) => {
    let cleanedValue = value;
    if (/^0+[1-9]/.test(cleanedValue)) {
      cleanedValue = cleanedValue.replace(/^0+/, '');
    }
    setTierForms(prev => {
      const list = [...(prev[regionId] || [])];
      list[index] = { ...list[index], [field]: cleanedValue };
      return { ...prev, [regionId]: list };
    });
  };

  const handleSaveTiers = async (regionId: string) => {
    const rawTiers = tierForms[regionId] || [];
    
    // Convert forms to DB payload (grams)
    const formattedTiers = [];
    for (let i = 0; i < rawTiers.length; i++) {
      const item = rawTiers[i];
      const minGramsNum = parseInt(item.minGrams, 10);
      const chargeNum = parseInt(item.charge, 10);

      if (isNaN(minGramsNum) || minGramsNum < 0) {
        showToast(`Tier #${i + 1}: Invalid minimum weight in grams`, 'error');
        return;
      }
      if (isNaN(chargeNum) || chargeNum < 0) {
        showToast(`Tier #${i + 1}: Invalid shipping charge`, 'error');
        return;
      }

      let maxGrams: number | null = null;
      if (item.maxGrams.trim() !== '') {
        const maxGramsNum = parseInt(item.maxGrams, 10);
        if (isNaN(maxGramsNum) || maxGramsNum <= minGramsNum) {
          showToast(`Tier #${i + 1}: Max weight must be greater than min weight`, 'error');
          return;
        }
        maxGrams = maxGramsNum;
      }

      formattedTiers.push({
        minWeightGrams: minGramsNum,
        maxWeightGrams: maxGrams,
        charge: chargeNum,
      });
    }

    try {
      setSavingRegionId(regionId);
      await setDeliveryTiers(regionId, formattedTiers);
      showToast('Weight tiers saved successfully!', 'success');
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to save weight tiers', 'error');
    } finally {
      setSavingRegionId(null);
    }
  };

  const handleSeedDefaults = async () => {
    try {
      setLoading(true);
      const defaults = [
        {
          name: 'Tamil Nadu',
          tiers: [
            { minWeightGrams: 0, maxWeightGrams: 5000, charge: 100 },
            { minWeightGrams: 5000, maxWeightGrams: 15000, charge: 250 },
            { minWeightGrams: 15000, maxWeightGrams: 30000, charge: 450 },
            { minWeightGrams: 30000, maxWeightGrams: null, charge: 750 },
          ]
        },
        {
          name: 'South India (Kerala, Karnataka, AP, Telangana)',
          tiers: [
            { minWeightGrams: 0, maxWeightGrams: 5000, charge: 180 },
            { minWeightGrams: 5000, maxWeightGrams: 15000, charge: 380 },
            { minWeightGrams: 15000, maxWeightGrams: 30000, charge: 700 },
            { minWeightGrams: 30000, maxWeightGrams: null, charge: 1100 },
          ]
        },
        {
          name: 'Rest of India',
          tiers: [
            { minWeightGrams: 0, maxWeightGrams: 5000, charge: 250 },
            { minWeightGrams: 5000, maxWeightGrams: 15000, charge: 500 },
            { minWeightGrams: 15000, maxWeightGrams: 30000, charge: 950 },
            { minWeightGrams: 30000, maxWeightGrams: null, charge: 1500 },
          ]
        }
      ];

      for (const item of defaults) {
        const regionId = await upsertDeliveryRegion({ name: item.name });
        if (regionId) {
          await setDeliveryTiers(regionId, item.tiers);
        }
      }
      showToast('Default delivery regions & weight tiers added successfully!', 'success');
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast('Failed to seed default regions', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 font-medium text-sm transition-all animate-in slide-in-from-top-2
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}
        `}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-rose-500" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-cyan-600 rounded-full"></div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Delivery & Shipping Rules</h1>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Configure delivery regions and weight-bracket shipping charges (0-10 kg, 10-30 kg, etc.)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSeedDefaults}
            className="flex items-center gap-2 px-3.5 py-2 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Load Sample Regions & Tiers
          </button>

          <button
            onClick={() => {
              setEditingRegion(null);
              setRegionNameInput('');
              setShowRegionModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            Add Delivery Region
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-wider">Loading delivery rules...</p>
        </div>
      ) : regions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-4">
            <Truck size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Delivery Regions Defined</h3>
          <p className="text-xs text-slate-500 mb-6">
            Create your first delivery region or click below to load preconfigured sample regions for Tamil Nadu, South India, and Rest of India.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Load Sample Regions & Tiers
            </button>
            <button
              onClick={() => {
                setEditingRegion(null);
                setRegionNameInput('');
                setShowRegionModal(true);
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Create Region
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {regions.map((region) => {
            const isExpanded = expandedRegionId === region.id;
            const currentTiers = tierForms[region.id] || [];

            return (
              <div 
                key={region.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Region Card Header */}
                <div className="p-4 sm:px-6 flex items-center justify-between gap-4 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setExpandedRegionId(isExpanded ? null : region.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 truncate">{region.name}</h2>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${region.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {region.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {region.tiers.length === 0 ? 'No weight tiers configured' : `${region.tiers.length} weight tier(s) configured`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleRegionStatus(region)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${region.isActive ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                    >
                      {region.isActive ? 'Disable' : 'Enable'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setEditingRegion({ id: region.id, name: region.name });
                        setRegionNameInput(region.name);
                        setShowRegionModal(true);
                      }}
                      className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                      title="Edit Region Name"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteRegion(region.id, region.name)}
                      className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                      title="Delete Region"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Weight Tiers Table & Editor */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <div>
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Weight Tiers & Delivery Charges</h3>
                        <p className="text-xs text-slate-500">Set weight brackets in grams (g) and their corresponding delivery fee (₹).</p>
                      </div>

                      <button
                        onClick={() => handleAddTierRow(region.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold shadow-sm transition-all"
                      >
                        <Plus size={14} />
                        Add Weight Bracket
                      </button>
                    </div>

                    {currentTiers.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500 text-xs font-medium">
                        No weight brackets added yet. Click <strong>"Add Weight Bracket"</strong> to set up delivery fees for this region.
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-bold">
                            <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="py-3 px-4 w-12">#</th>
                                <th className="py-3 px-4">Min Weight (g)</th>
                                <th className="py-3 px-4">Max Weight (g)</th>
                                <th className="py-3 px-4">Delivery Fee (₹)</th>
                                <th className="py-3 px-4 text-right w-16">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                              {currentTiers.map((tier, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                                  <td className="py-2.5 px-4">
                                    <div className="flex items-center gap-1">
                                      <input 
                                        type="number" 
                                        step="1" 
                                        min="0"
                                        value={tier.minGrams} 
                                        onChange={e => handleTierFormChange(region.id, idx, 'minGrams', e.target.value)}
                                        className="w-28 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 bg-white"
                                        placeholder="0"
                                      />
                                      <span className="text-slate-400 font-normal text-xs">g</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <div className="flex items-center gap-1">
                                      <input 
                                        type="number" 
                                        step="1" 
                                        min="0"
                                        value={tier.maxGrams} 
                                        onChange={e => handleTierFormChange(region.id, idx, 'maxGrams', e.target.value)}
                                        className="w-28 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 bg-white placeholder:font-normal"
                                        placeholder="No limit"
                                      />
                                      <span className="text-slate-400 font-normal text-xs">
                                        {tier.maxGrams.trim() === '' ? '(Unlimited)' : 'g'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-400 font-bold">₹</span>
                                      <input 
                                        type="number" 
                                        min="0"
                                        value={tier.charge} 
                                        onChange={e => handleTierFormChange(region.id, idx, 'charge', e.target.value)}
                                        className="w-28 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 bg-white"
                                        placeholder="100"
                                      />
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4 text-right">
                                    <button
                                      onClick={() => handleRemoveTierRow(region.id, idx)}
                                      className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                                      title="Remove Row"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleSaveTiers(region.id)}
                        disabled={savingRegionId === region.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Save size={16} />
                        {savingRegionId === region.id ? 'Saving Tiers...' : 'Save Weight Tiers'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Region Create / Edit Modal */}
      {showRegionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingRegion?.id ? 'Edit Delivery Region' : 'Add New Delivery Region'}
              </h3>
              <button 
                onClick={() => setShowRegionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Region Name
                </label>
                <input 
                  type="text"
                  value={regionNameInput}
                  onChange={e => setRegionNameInput(e.target.value)}
                  placeholder="e.g. Tamil Nadu, South India, Rest of India"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRegionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRegion}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  {editingRegion?.id ? 'Update Region' : 'Create Region'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
