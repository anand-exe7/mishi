'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { 
  Banknote, CheckCircle2, Store, Globe, 
  ShoppingBag, Package, TrendingUp, Award,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('All Time');
  const [activeTab, setActiveTab] = useState('REVENUE');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  
  const themeColor = '#E75F24'; // Primary brand color requested

  // Mock data to match screenshot closely
  const yearData = [
    { name: 'JAN', value: 0 }, { name: 'FEB', value: 0 }, { name: 'MAR', value: 0 },
    { name: 'APR', value: 0 }, { name: 'MAY', value: 0 }, 
    { name: 'JUN', value: 5000, isMax: false }, 
    { name: 'JUL', value: 7891.5, isMax: true }, 
    { name: 'AUG', value: 0 }, { name: 'SEP', value: 0 },
    { name: 'OCT', value: 0 }, { name: 'NOV', value: 0 }, { name: 'DEC', value: 0 }
  ];

  const weekData = [
    { name: 'MON', value: 500 }, { name: 'TUE', value: 0 }, 
    { name: 'WED', value: 0 }, { name: 'THU', value: 0 }, 
    { name: 'FRI', value: 0 }, { name: 'SAT', value: 0 },
    { name: 'SUN', value: 0 }
  ];

  const topItems = [
    { name: 'Bath powder', revenue: 3666, pcs: 3, percentage: 80 },
    { name: 'Face Pack & Bath P...', revenue: 2910, pcs: 11, percentage: 65 },
    { name: 'Herbal Shikakai Po...', revenue: 1860, pcs: 8, percentage: 40 },
  ];

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value, index } = props;
    if (yearData[index].isMax) {
      return (
        <text x={x + width / 2} y={y - 10} fill={themeColor} textAnchor="middle" fontSize="10" fontWeight="bold">
          Max
        </text>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-slate-800">
      <style>{`
        .recharts-wrapper, .recharts-surface, .recharts-surface:focus {
          outline: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">POS Analytics</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Real-time revenue, product performance, categories breakdown, and coupon usage</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-bold text-slate-700 transition-colors shadow-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">PERIOD:</span>
        <div className="flex flex-wrap items-center bg-white rounded-full border border-slate-200 p-1 shadow-sm text-xs font-bold text-slate-600">
          {['All Time', 'Today', 'This Week', 'This Month', 'This Year', 'Custom'].map(f => (
            <button 
              key={f}
              onClick={() => setPeriod(f)}
              className={`px-4 py-1.5 rounded-full transition-colors ${period === f ? 'text-white shadow-sm' : 'hover:bg-slate-50'}`}
              style={{ backgroundColor: period === f ? themeColor : 'transparent' }}
            >
              {f}
            </button>
          ))}
        </div>

        {period === 'Custom' && (
          <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 px-3 py-1 shadow-sm text-xs font-bold text-slate-700">
            <span className="text-[10px] text-slate-400">FROM</span>
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="outline-none bg-transparent" />
            <span className="text-[10px] text-slate-400">TO</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="outline-none bg-transparent" />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 pt-2">
        {['REVENUE', "TODAY'S SALES", 'PRODUCTS', 'COUPONS'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors ${
              activeTab === tab ? 'text-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
            style={{ borderColor: activeTab === tab ? themeColor : 'transparent' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="space-y-4">
        {/* Row 1: 4 Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Revenue</span>
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><Banknote size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">₹7,891.5</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">POS + manual combined</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed Bills</span>
              <div className="p-1.5 bg-green-50 rounded-lg text-green-500"><CheckCircle2 size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">15</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">POS + manual bills</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Offline Bills</span>
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Store size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">₹4,502</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Walk-in POS sales</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Online Bills</span>
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500"><Globe size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">₹3,389.5</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Online POS sales</p>
            </div>
          </div>
        </div>

        {/* Row 2: 5 Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Offline Bills</span>
              <div className="p-1.5 bg-red-50 rounded-lg text-red-500"><ShoppingBag size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">13</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Walk-in POS orders</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Online Bills</span>
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-500"><Globe size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">2</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Online channel orders</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Items Sold</span>
              <div className="p-1.5 bg-fuchsia-50 rounded-lg text-fuchsia-500"><Package size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">26</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">From completed bills</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Order Value</span>
              <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500"><TrendingUp size={14} /></div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">₹526</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Per completed order</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Top Product</span>
              <div className="p-1.5 bg-pink-50 rounded-lg text-pink-500"><Award size={14} /></div>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 truncate" title="Face Pack & Bath Powder">Face Pack & Bat...</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Most sold item</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Year Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Revenue Trend This Year <span style={{color: themeColor}}>2026</span></h2>
          </div>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-2xl font-black text-slate-900">₹7,891.5</span>
            <span className="text-[10px] font-bold" style={{color: themeColor}}>Avg ₹658/mo</span>
          </div>
          
          <div className="w-full h-[250px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData} margin={{ top: 20, right: 10, bottom: 0, left: 10 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <RechartsTooltip cursor={false} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24} activeBar={false}>
                  {yearData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isMax ? '#6D1A36' : '#FDE8E8'} />
                  ))}
                  <LabelList dataKey="value" content={renderCustomBarLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Widgets */}
        <div className="space-y-6">
          
          {/* Order Source */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Order Source</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-red-600">Offline</span>
                  <span className="text-slate-700">13</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-green-600">Online</span>
                  <span className="text-slate-700">2</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Items By Revenue */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Top Items By Revenue</h2>
            <div className="space-y-5">
              {topItems.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start text-xs font-bold mb-2">
                    <span className="text-slate-700 flex gap-2">
                      <span className="text-slate-400">{index + 1}</span> {item.name}
                    </span>
                    <span className="text-slate-900">
                      ₹{item.revenue.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-medium ml-1">{item.pcs} pcs</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div className="h-1 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: themeColor }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Week Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Revenue This Week <span style={{color: themeColor}}>(WEEK 28 OF 2026)</span></h2>
          </div>
          <div className="text-xs text-slate-500 mb-6">₹0 total</div>
          
          <div className="w-full h-[250px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} margin={{ top: 20, right: 10, bottom: 0, left: 10 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <RechartsTooltip cursor={false} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24} activeBar={false}>
                  {weekData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#9f1239" /> // Using a dark rose/maroon to match the screenshot bottom chart
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
}
