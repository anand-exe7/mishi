'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { 
  Banknote, CheckCircle2, Store, Globe, 
  ShoppingBag, Package, TrendingUp, Award,
  RefreshCw, Search, Percent, Tag, IndianRupee,
  X
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

// --- MOCK DATA SOURCE ---
const mockAnalytics = {
  overview: {
    totalRevenue: 7891.5,
    completedBills: 15,
    offlineBillsAmount: 4502,
    onlineBillsAmount: 3389.5,
    totalOfflineBills: 13,
    totalOnlineBills: 2,
    totalItemsSold: 26,
    avgOrderValue: 526,
    topProductName: "Face Pack & Bath Powder",
    topProductRevenue: 2910,
    topProductQty: 11,
    topProductShare: 32.0,
  },
  today: {
    revenue: 1250,
    bills: 3,
    itemsSold: 5,
    avgOrderValue: 416.6,
    channelSplit: {
      offline: 850,
      offlinePercentage: 68,
      online: 400,
      onlinePercentage: 32
    },
    transactions: [
      { id: 'INV-2026-TODAY1', customer: '9876543210', source: 'Offline', items: 2, total: 850 },
      { id: 'INV-2026-TODAY2', customer: '9123456789', source: 'Online', items: 3, total: 400 },
    ],
    topItems: [
      { name: 'Bath powder', qty: 2, total: 850 },
      { name: 'Health Mix', qty: 3, total: 400 }
    ]
  },
  yearData: [
    { name: 'JAN', value: 1200 }, { name: 'FEB', value: 2100 }, { name: 'MAR', value: 800 },
    { name: 'APR', value: 1500 }, { name: 'MAY', value: 3200 }, 
    { name: 'JUN', value: 5000, isMax: false }, 
    { name: 'JUL', value: 7891.5, isMax: true }, 
    { name: 'AUG', value: 0 }, { name: 'SEP', value: 0 },
    { name: 'OCT', value: 0 }, { name: 'NOV', value: 0 }, { name: 'DEC', value: 0 }
  ],
  weekData: [
    { name: 'MON', value: 500 }, { name: 'TUE', value: 850 }, 
    { name: 'WED', value: 1200 }, { name: 'THU', value: 400 }, 
    { name: 'FRI', value: 2100 }, { name: 'SAT', value: 3500 },
    { name: 'SUN', value: 4200 }
  ],
  topItemsRevenue: [
    { name: 'Bath powder', revenue: 3666, pcs: 3, percentage: 80 },
    { name: 'Face Pack & Bath Powder', revenue: 2910, pcs: 11, percentage: 65 },
    { name: 'Herbal Shikakai Powder (Bio Hair Wash)', revenue: 1860, pcs: 8, percentage: 40 },
  ],
  productLeaderboard: [
    { rank: 1, name: 'Bath powder', qty: 3, revenue: 3666, share: 40.4 },
    { rank: 2, name: 'Face Pack & Bath Powder', qty: 11, revenue: 2910, share: 32.0 },
    { rank: 3, name: 'Herbal Shikakai Powder (Bio Hair Wash)', qty: 8, revenue: 1860, share: 20.5 },
    { rank: 4, name: 'Multi Millet Health Mix', qty: 2, revenue: 400, share: 4.4 },
    { rank: 5, name: 'Health Mix', qty: 2, revenue: 246, share: 2.7 },
  ],
  coupons: {
    summary: {
      totalDiscounts: 1364.5,
      discountedOrders: 9,
      avgDiscount: 152
    },
    transactions: [
      { id: 'INV-2026-RFZ9FOB', customer: 'Priya Sharma', total: 640, discount: 40 },
      { id: 'INV-2026-3XQLH2Q', customer: 'Rahul Kumar', total: 1035, discount: 115 },
      { id: 'INV-2026-YFPHHA4', customer: 'Sneha Patel', total: 225, discount: 25 },
      { id: 'INV-2026-00007', customer: 'Amit Singh', total: 1260, discount: 100 },
      { id: 'INV-2026-00006', customer: 'Neha Gupta', total: 1244, discount: 50 },
      { id: 'INV-2026-00004', customer: 'Vikram Desai', total: 756, discount: 84 },
      { id: 'INV-2026-00003', customer: 'Kavita Reddy', total: 1218, discount: 122 },
      { id: 'INV-2026-00002', customer: 'Suresh Menon', total: 2749.5, discount: 916.5 },
      { id: 'INV-2026-00001', customer: 'Anita Bose', total: 1234, discount: 112 },
    ]
  }
};

export default function AnalyticsPage() {
  const { orders } = useAdmin();
  
  const [period, setPeriod] = useState('All Time');
  const [activeTab, setActiveTab] = useState('REVENUE');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const themeColor = '#E75F24'; 

  // --- DYNAMIC CALCULATIONS ---
  const dynamicOverview = React.useMemo(() => {
    let totalRevenue = 0;
    let offlineBillsAmount = 0;
    let onlineBillsAmount = 0;
    let totalOfflineBills = 0;
    let totalOnlineBills = 0;
    let totalItemsSold = 0;

    orders.forEach(order => {
      totalRevenue += order.total_amount;
      totalItemsSold += order.items.reduce((sum, item) => sum + item.quantity, 0);
      if (order.source === 'Offline') {
        offlineBillsAmount += order.total_amount;
        totalOfflineBills++;
      } else {
        onlineBillsAmount += order.total_amount;
        totalOnlineBills++;
      }
    });

    return {
      totalRevenue,
      completedBills: orders.length,
      offlineBillsAmount,
      onlineBillsAmount,
      totalOfflineBills,
      totalOnlineBills,
      totalItemsSold,
      avgOrderValue: orders.length ? Math.round(totalRevenue / orders.length) : 0,
      topProductName: "Face Pack & Bath Powder", // Keeping static for visual consistency in modal
      topProductRevenue: 2910,
      topProductQty: 11,
      topProductShare: 32.0,
    };
  }, [orders]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value, index } = props;
    if (mockAnalytics.yearData[index].isMax) {
      return (
        <text x={x + width / 2} y={y - 10} fill={themeColor} textAnchor="middle" fontSize="10" fontWeight="bold">
          Max
        </text>
      );
    }
    return null;
  };

  const renderRevenueTab = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Revenue</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><Banknote size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">₹{dynamicOverview.totalRevenue.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">POS + manual combined</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed Bills</span>
            <div className="p-1.5 bg-green-50 rounded-lg text-green-500"><CheckCircle2 size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{dynamicOverview.completedBills}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">POS + manual bills</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Offline Bills</span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Store size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">₹{dynamicOverview.offlineBillsAmount.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Walk-in POS sales</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Online Bills</span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500"><Globe size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">₹{dynamicOverview.onlineBillsAmount.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Online POS sales</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Offline Bills</span>
            <div className="p-1.5 bg-red-50 rounded-lg text-red-500"><ShoppingBag size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{dynamicOverview.totalOfflineBills}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Walk-in POS orders</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Online Bills</span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-500"><Globe size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{dynamicOverview.totalOnlineBills}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Online channel orders</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Items Sold</span>
            <div className="p-1.5 bg-fuchsia-50 rounded-lg text-fuchsia-500"><Package size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{dynamicOverview.totalItemsSold}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">From completed bills</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Order Value</span>
            <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500"><TrendingUp size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">₹{dynamicOverview.avgOrderValue.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Per completed order</p>
          </div>
        </div>

        <div 
          onClick={() => setShowProductModal(true)}
          className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px] cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-700 transition-colors">Top Product</span>
            <div className="p-1.5 bg-pink-50 rounded-lg text-pink-500"><Award size={14} /></div>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 truncate">{mockAnalytics.overview.topProductName.length > 15 ? mockAnalytics.overview.topProductName.substring(0, 15) + '...' : mockAnalytics.overview.topProductName}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Most sold item (Click to view)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Revenue Trend This Year <span style={{color: themeColor}}>2026</span></h2>
          </div>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-2xl font-black text-slate-900">₹{mockAnalytics.overview.totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-bold" style={{color: themeColor}}>Avg ₹658/mo</span>
          </div>
          
          <div className="w-full h-[250px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%" key={`year-${refreshKey}`}>
              <BarChart data={mockAnalytics.yearData} margin={{ top: 20, right: 10, bottom: 0, left: 10 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <RechartsTooltip cursor={false} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24} activeBar={false}>
                  {mockAnalytics.yearData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isMax ? '#6D1A36' : '#FDE8E8'} />
                  ))}
                  <LabelList dataKey="value" content={renderCustomBarLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Order Source</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-red-600">Offline</span>
                  <span className="text-slate-700">{mockAnalytics.overview.totalOfflineBills}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-green-600">Online</span>
                  <span className="text-slate-700">{mockAnalytics.overview.totalOnlineBills}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Top Items By Revenue</h2>
            <div className="space-y-5">
              {mockAnalytics.topItemsRevenue.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start text-xs font-bold mb-2">
                    <span className="text-slate-700 flex gap-2">
                      <span className="text-slate-400">{index + 1}</span> {item.name.length > 20 ? item.name.substring(0, 17) + '...' : item.name}
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

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Revenue This Week <span style={{color: themeColor}}>(WEEK 28 OF 2026)</span></h2>
          </div>
          <div className="text-xs text-slate-500 mb-6">₹12,550 total</div>
          
          <div className="w-full h-[250px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%" key={`week-${refreshKey}`}>
              <BarChart data={mockAnalytics.weekData} margin={{ top: 20, right: 10, bottom: 0, left: 10 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <RechartsTooltip cursor={false} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24} activeBar={false}>
                  {mockAnalytics.weekData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#9f1239" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTodaySalesTab = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Revenue</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><Banknote size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">₹{mockAnalytics.today.revenue.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Completed today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Bills</span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><CheckCircle2 size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{mockAnalytics.today.bills}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Completed today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Items Sold</span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500"><Package size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{mockAnalytics.today.itemsSold} pcs</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Quantity sold today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Avg Order Value</span>
            <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500"><TrendingUp size={14} /></div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">₹{mockAnalytics.today.avgOrderValue.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Per invoice today</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Today's Transactions</h2>
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search contact no..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none" 
              />
            </div>
          </div>
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Invoice ID</th>
                  <th className="px-6 py-3">Customer No</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3 text-center">Items</th>
                  <th className="px-6 py-3 text-right">Grand Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-900">
                {mockAnalytics.today.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{tx.id}</td>
                    <td className="px-6 py-4 text-slate-600">{tx.customer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest ${tx.source === 'Online' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {tx.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{tx.items}</td>
                    <td className="px-6 py-4 text-right">₹{tx.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Today's Channel Split</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-red-600">Offline</span>
                  <span className="text-slate-900">₹{mockAnalytics.today.channelSplit.offline.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${mockAnalytics.today.channelSplit.offlinePercentage}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-green-600">Online</span>
                  <span className="text-slate-900">₹{mockAnalytics.today.channelSplit.online.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${mockAnalytics.today.channelSplit.onlinePercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Today's Top Items</h2>
            <div className="space-y-3">
              {mockAnalytics.today.topItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.qty} pcs</p>
                  </div>
                  <div className="font-black text-slate-900">₹{item.total.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-50">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Product Sales Leaderboard</h2>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4 text-center">Qty Sold</th>
              <th className="px-6 py-4 text-right">Revenue</th>
              <th className="px-6 py-4 text-right">Market Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-900">
            {mockAnalytics.productLeaderboard.map((prod) => (
              <tr key={prod.rank} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500">{prod.rank}</td>
                <td className="px-6 py-4">{prod.name}</td>
                <td className="px-6 py-4 text-center text-slate-600">{prod.qty} pcs</td>
                <td className="px-6 py-4 text-right font-black">₹{prod.revenue.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-32 bg-slate-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${prod.share}%`, backgroundColor: '#b91c1c' }}></div>
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{prod.share}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCouponsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Discount Summary</h2>
          <div className="space-y-4">
            <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Discounts Given</span>
                <span className="text-2xl font-black text-slate-900">₹{mockAnalytics.coupons.summary.totalDiscounts.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Percent size={16} /></div>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Discounted Orders</span>
                <span className="text-2xl font-black text-slate-900">{mockAnalytics.coupons.summary.discountedOrders}</span>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Tag size={16} /></div>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Discount Per Order</span>
                <span className="text-2xl font-black text-slate-900">₹{mockAnalytics.coupons.summary.avgDiscount}</span>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><IndianRupee size={16} /></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Promo Campaign Performance</h2>
        </div>
        <div className="overflow-x-auto w-full flex-1">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4 text-right">Order Total</th>
                <th className="px-6 py-4 text-right">Discount Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-900">
              {mockAnalytics.coupons.transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{tx.id}</td>
                  <td className="px-6 py-4">{tx.customer}</td>
                  <td className="px-6 py-4 text-right text-slate-600">₹{tx.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right text-red-600">-₹{tx.discount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-slate-800 relative">
      <style jsx global>{`
        .recharts-wrapper, 
        .recharts-surface, 
        .recharts-surface:focus,
        .recharts-responsive-container,
        .recharts-responsive-container:focus,
        svg, path, rect, text {
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">POS Analytics</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Real-time revenue, product performance, categories breakdown, and coupon usage</p>
        </div>
        <button 
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-bold transition-colors shadow-sm ${isRefreshing ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700'}`}
          disabled={isRefreshing}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-slate-400' : ''} /> 
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Period Filter (Hidden for TODAY'S SALES) */}
      {activeTab !== "TODAY'S SALES" && (
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
            <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 px-3 py-1 shadow-sm text-xs font-bold text-slate-700 animate-in slide-in-from-left-2">
              <span className="text-[10px] text-slate-400">FROM</span>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="outline-none bg-transparent" />
              <span className="text-[10px] text-slate-400">TO</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="outline-none bg-transparent" />
            </div>
          )}
        </div>
      )}

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

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'REVENUE' && renderRevenueTab()}
        {activeTab === "TODAY'S SALES" && renderTodaySalesTab()}
        {activeTab === 'PRODUCTS' && renderProductsTab()}
        {activeTab === 'COUPONS' && renderCouponsTab()}
      </div>

      {/* Top Product Modal Overlay */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Award size={18} className="text-pink-500" />
                Top Product Details
              </h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Product Name</p>
                <p className="text-lg font-black text-slate-900 leading-snug">{mockAnalytics.overview.topProductName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
                  <p className="text-2xl font-black text-slate-900">₹{mockAnalytics.overview.topProductRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Quantity Sold</p>
                  <p className="text-2xl font-black text-slate-900">{mockAnalytics.overview.topProductQty} pcs</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Market Share (Products)</span>
                  <span className="text-slate-900">{mockAnalytics.overview.topProductShare.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${mockAnalytics.overview.topProductShare}%`, backgroundColor: themeColor }}></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setShowProductModal(false)}
                className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
