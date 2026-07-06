'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

// Mock data generator for demonstration
const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    data.push({
      id: `INV-${1000 + i}`,
      created_at: d.toISOString(),
      total_amount: Math.floor(Math.random() * 5000) + 500,
      status: 'completed',
      is_offline: Math.random() > 0.5,
      items: [
        { product_name: 'Premium Mattress', quantity: 1 },
      ]
    });
  }
  return data;
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('This Week');
  const initialInquiries = useMemo(() => generateMockData(), []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const getWeekNumber = (d: Date) => {
    const dObj = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = dObj.getUTCDay() || 7;
    dObj.setUTCDate(dObj.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(dObj.getUTCFullYear(),0,1));
    return Math.ceil((((dObj.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };
  const currentWeek = getWeekNumber(now);

  const filteredData = useMemo(() => {
    return initialInquiries.filter(order => {
      const d = new Date(order.created_at);
      if (period === 'This Week') {
        const diffToMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return d >= startOfWeek && d <= endOfWeek;
      }
      return true; // Simple mock filter, expand as needed
    });
  }, [initialInquiries, period, now]);

  const stats = useMemo(() => {
    let totalRev = 0;
    let completed = 0;
    let offline = 0;
    let online = 0;
    let items = 0;

    filteredData.forEach(order => {
      totalRev += order.total_amount;
      completed++;
      if (order.is_offline) offline++; else online++;
      items += order.items.reduce((acc, item) => acc + item.quantity, 0);
    });

    const avg = completed > 0 ? Math.round(totalRev / completed) : 0;
    return { totalRev, completed, offline, online, items, avg, topProduct: 'Premium Mattress' };
  }, [filteredData]);

  const yearData = [
    { name: 'JAN', value: 12000 }, { name: 'FEB', value: 15000 }, { name: 'MAR', value: 10000 },
    { name: 'APR', value: 20000 }, { name: 'MAY', value: 18000 }, { name: 'JUN', value: 25000 },
    { name: 'JUL', value: 22000 }, { name: 'AUG', value: 30000 }, { name: 'SEP', value: 28000 },
    { name: 'OCT', value: 35000 }, { name: 'NOV', value: 40000 }, { name: 'DEC', value: 45000 }
  ];

  const weekData = [
    { name: 'MON', value: 500, fill: '#e5e5e5' }, { name: 'TUE', value: 800, fill: '#e5e5e5' }, 
    { name: 'WED', value: 600, fill: '#e5e5e5' }, { name: 'THU', value: 1200, fill: '#e5e5e5' }, 
    { name: 'FRI', value: 1500, fill: '#10b981' }, { name: 'SAT', value: 900, fill: '#e5e5e5' },
    { name: 'SUN', value: 400, fill: '#e5e5e5' }
  ];

  return (
    <div className="space-y-6">
      <style>{`
        .recharts-wrapper, .recharts-surface, .recharts-surface:focus {
          outline: none !important;
        }
      `}</style>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">POS Analytics</h1>
          <p className="text-sm font-medium text-slate-500">Real-time store & channel insights</p>
        </div>
        <div className="bg-white rounded-full border border-slate-200 p-1 shadow-sm flex text-xs font-bold text-slate-600">
          <button 
            onClick={() => setPeriod('All Time')}
            className={`px-4 py-1.5 rounded-full transition-colors ${period === 'All Time' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-50'}`}
          >
            ALL TIME
          </button>
          <button 
            onClick={() => setPeriod('This Week')}
            className={`px-4 py-1.5 rounded-full transition-colors ${period === 'This Week' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-50'}`}
          >
            THIS WEEK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Revenue', value: `₹${stats.totalRev.toLocaleString('en-IN')}`, desc: 'POS + manual' },
          { title: 'Completed Bills', value: stats.completed, desc: `${stats.offline} offline / ${stats.online} online` },
          { title: 'Total Items Sold', value: stats.items, desc: 'From completed bills' },
          { title: 'Avg Order Value', value: `₹${stats.avg.toLocaleString('en-IN')}`, desc: 'Per completed order' },
          { title: 'Top Product', value: stats.topProduct, desc: 'Most sold item' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[120px]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.title}</span>
            <div className="min-w-0">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 truncate">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 mt-1 truncate">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-6">Revenue Trend This Year</h2>
          <div className="overflow-x-auto no-scrollbar min-w-[450px]">
            <div className="h-[250px] w-full min-w-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearData} margin={{ top: 20, right: 10, bottom: 0, left: 10 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                  <RechartsTooltip cursor={false} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: 800, color: '#10b981' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} activeBar={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-6">Revenue This Week (Mon-Sun)</h2>
          <div className="overflow-x-auto no-scrollbar min-w-[450px]">
            <div className="h-[250px] w-full min-w-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} margin={{ top: 20, right: 10, bottom: 0, left: 10 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                  <RechartsTooltip cursor={false} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: 800, color: '#10b981' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24} activeBar={false}>
                    {weekData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
