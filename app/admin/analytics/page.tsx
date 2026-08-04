"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import {
  Banknote,
  CheckCircle2,
  Store,
  Globe,
  ShoppingBag,
  Package,
  TrendingUp,
  Award,
  RefreshCw,
  Search,
  Percent,
  Tag,
  IndianRupee,
  X,
} from "lucide-react";
import { useAdmin } from "../AdminContext";
import { Order } from "@/lib/db";

export default function AnalyticsPage() {
  const { orders, refreshData, loading } = useAdmin();

  const [period, setPeriod] = useState("All Time");
  const [activeTab, setActiveTab] = useState("REVENUE");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  
  const [todaySearch, setTodaySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [couponSearch, setCouponSearch] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const themeColor = "#2C392A"; // Match Mishi Green

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setRefreshKey((prev) => prev + 1);
    setIsRefreshing(false);
  };

  // 1. Filter orders based on the selected period
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);

      if (period === "Today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (period === "This Week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo;
      }
      if (period === "This Month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (period === "This Year") {
        return orderDate.getFullYear() === now.getFullYear();
      }
      if (period === "Custom" && customFrom && customTo) {
        const from = new Date(customFrom);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return orderDate >= from && orderDate <= to;
      }
      return true; // 'All Time'
    });
  }, [orders, period, customFrom, customTo]);

  // 2. Compute dynamic metrics and leaderboard
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let offlineRevenue = 0;
    let onlineRevenue = 0;
    let totalOfflineBills = 0;
    let totalOnlineBills = 0;
    let totalItemsSold = 0;

    // Product aggregation: { [name]: { qty, revenue } }
    const productStats: Record<
      string,
      { name: string; qty: number; revenue: number }
    > = {};

    // Coupon aggregation
    let totalCouponDiscounts = 0;
    let couponOrdersCount = 0;
    const couponTxList: Array<{
      id: string;
      customer: string;
      total: number;
      discount: number;
    }> = [];

    filteredOrders.forEach((order) => {
      totalRevenue += order.totalPrice;
      totalItemsSold += order.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      if (order.source === "OFFLINE") {
        offlineRevenue += order.totalPrice;
        totalOfflineBills++;
      } else {
        onlineRevenue += order.totalPrice;
        totalOnlineBills++;
      }

      // Aggregate products
      order.items.forEach((item) => {
        if (!productStats[item.name]) {
          productStats[item.name] = { name: item.name, qty: 0, revenue: 0 };
        }
        productStats[item.name].qty += item.quantity;
        productStats[item.name].revenue += item.price * item.quantity;
      });

      // Aggregate coupons
      if (order.couponCode && order.couponDiscount > 0) {
        totalCouponDiscounts += order.couponDiscount;
        couponOrdersCount++;
        couponTxList.push({
          id: order.id,
          customer: order.customerName,
          total: order.totalPrice,
          discount: order.couponDiscount,
        });
      }
    });

    // Format Product Leaderboard sorted by revenue descending
    const leaderboard = Object.values(productStats).sort(
      (a, b) => b.revenue - a.revenue,
    );
    const topProduct = leaderboard[0] || { name: "None", qty: 0, revenue: 0 };
    const leaderboardWithShare = leaderboard.map((prod, idx) => ({
      rank: idx + 1,
      name: prod.name,
      qty: prod.qty,
      revenue: prod.revenue,
      share:
        totalRevenue > 0 ? Math.round((prod.revenue / totalRevenue) * 100) : 0,
    }));

    return {
      totalRevenue,
      completedBills: filteredOrders.length,
      offlineRevenue,
      onlineRevenue,
      totalOfflineBills,
      totalOnlineBills,
      totalItemsSold,
      avgOrderValue: filteredOrders.length
        ? Math.round(totalRevenue / filteredOrders.length)
        : 0,
      leaderboard: leaderboardWithShare,
      topProduct: {
        name: topProduct.name,
        revenue: topProduct.revenue,
        qty: topProduct.qty,
        share: totalRevenue > 0 ? (topProduct.revenue / totalRevenue) * 100 : 0,
      },
      coupons: {
        totalDiscounts: totalCouponDiscounts,
        discountedOrders: couponOrdersCount,
        avgDiscount: couponOrdersCount
          ? Math.round(totalCouponDiscounts / couponOrdersCount)
          : 0,
        transactions: couponTxList,
      },
    };
  }, [filteredOrders]);

  // 3. Compute yearly chart data (Revenue by month)
  const yearlyChartData = useMemo(() => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const monthlyValues = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      if (date.getFullYear() === currentYear) {
        monthlyValues[date.getMonth()] += order.totalPrice;
      }
    });

    const maxVal = Math.max(...monthlyValues, 1);

    return months.map((name, index) => ({
      name,
      value: monthlyValues[index],
      isMax: monthlyValues[index] === maxVal && monthlyValues[index] > 0,
    }));
  }, [orders]);

  // 4. Compute weekly chart data (Revenue by day of week)
  const weeklyChartData = useMemo(() => {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const dailyValues = Array(7).fill(0);
    const now = new Date();

    // Get date of Monday of current week
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      if (date >= monday) {
        // Javascript day is 0-6 (Sun-Sat). Map to Mon-Sun (0-6)
        let mappedDayIndex = date.getDay() - 1;
        if (mappedDayIndex === -1) mappedDayIndex = 6; // Sunday
        dailyValues[mappedDayIndex] += order.totalPrice;
      }
    });

    return days.map((name, index) => ({
      name,
      value: dailyValues[index],
    }));
  }, [orders]);

  const yearlyTotalRevenue = useMemo(() => yearlyChartData.reduce((acc, curr) => acc + curr.value, 0), [yearlyChartData]);
  const weeklyTotalRevenue = useMemo(() => weeklyChartData.reduce((acc, curr) => acc + curr.value, 0), [weeklyChartData]);

  // Render sub-tabs helper
  const renderRevenueTab = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Total Revenue
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
              <Banknote size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Selected period sales
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Completed Bills
            </span>
            <div className="p-1.5 bg-green-50 rounded-lg text-green-500">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {stats.completedBills}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              POS + manual bills
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Offline Sales
            </span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
              <Store size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              ₹{stats.offlineRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              POS walk-in channel
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Online Sales
            </span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500">
              <Globe size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              ₹{stats.onlineRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Storefront WhatsApp orders
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Offline Count
            </span>
            <div className="p-1.5 bg-red-50 rounded-lg text-red-500">
              <ShoppingBag size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {stats.totalOfflineBills}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Walk-in POS orders
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Online Count
            </span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-500">
              <Globe size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {stats.totalOnlineBills}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Online orders processed
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Items Sold
            </span>
            <div className="p-1.5 bg-fuchsia-50 rounded-lg text-fuchsia-500">
              <Package size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {stats.totalItemsSold} pcs
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              From completed invoices
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Avg Order Value
            </span>
            <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
              <TrendingUp size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              ₹{stats.avgOrderValue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Per invoice checkout
            </p>
          </div>
        </div>

        <div
          onClick={() => setShowProductModal(true)}
          className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between h-[110px] cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-700 transition-colors">
              Top Product
            </span>
            <div className="p-1.5 bg-pink-50 rounded-lg text-pink-500">
              <Award size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 truncate">
              {stats.topProduct.name}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Click to view share metrics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
              Revenue Trend This Year ({new Date().getFullYear()})
            </h2>
          </div>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-2xl font-black text-slate-900">
              ₹{yearlyTotalRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] font-bold text-emerald-700">
              Calculated from all orders this year
            </span>
          </div>

          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[440px] sm:min-w-0 w-full h-[250px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                key={`year-${refreshKey}`}
              >
                <BarChart
                  data={yearlyChartData}
                  margin={{ top: 20, right: 10, bottom: 0, left: 10 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                    dy={10}
                  />
                  <RechartsTooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 6, 6]}
                    barSize={16}
                    activeBar={false}
                  >
                    {yearlyChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isMax ? "#2C392A" : "#e2e8f0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              Order Channel split
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-[#2C392A]">Offline (POS)</span>
                  <span className="text-slate-700">
                    {stats.totalOfflineBills}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#2C392A] h-1.5 rounded-full"
                    style={{
                      width: `${stats.completedBills > 0 ? Math.min(100, Math.max(0, (stats.totalOfflineBills / stats.completedBills) * 100)) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="uppercase text-emerald-600">Online</span>
                  <span className="text-slate-700">
                    {stats.totalOnlineBills}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{
                      width: `${stats.completedBills > 0 ? Math.min(100, Math.max(0, (stats.totalOnlineBills / stats.completedBills) * 100)) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              Top Items By Revenue
            </h2>
            <div className="space-y-5">
              {stats.leaderboard.slice(0, 3).map((item, index) => {
                const maxRevenue = stats.leaderboard[0]?.revenue || 1;
                const relativeWidth = Math.min(100, Math.max(0, Math.round((item.revenue / maxRevenue) * 100)));
                return (
                  <div key={index} className="overflow-hidden">
                    <div className="flex justify-between items-start text-xs font-bold mb-2">
                      <span className="text-slate-700 flex gap-2 truncate max-w-[65%]">
                        <span className="text-slate-400">{index + 1}</span>{" "}
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="text-slate-900 shrink-0">
                        ₹{item.revenue.toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] text-slate-400 font-medium ml-1">
                          {item.qty} pcs
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${relativeWidth}%`,
                          backgroundColor: themeColor,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {stats.leaderboard.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No products sold in this period.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
              Revenue This Week (Mon-Sun)
            </h2>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-xl font-black text-slate-900">
              ₹{weeklyTotalRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-500">
              Computed dynamically for current week
            </span>
          </div>

          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[360px] sm:min-w-0 w-full h-[250px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                key={`week-${refreshKey}`}
              >
                <BarChart
                  data={weeklyChartData}
                  margin={{ top: 20, right: 10, bottom: 0, left: 10 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                    dy={10}
                  />
                  <RechartsTooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 6, 6]}
                    barSize={18}
                    activeBar={false}
                  >
                    {weeklyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#2C392A" />
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

  const renderTodaySalesTab = () => {
    // Filter transactions completed today
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => o.createdAt && new Date(o.createdAt).toDateString() === today,
    );

    let todayRevenue = 0;
    let todayItemsSold = 0;
    let todayOfflineRevenue = 0;
    let todayOnlineRevenue = 0;
    const todayTopItemsMap: Record<
      string,
      { name: string; qty: number; total: number }
    > = {};

    todayOrders.forEach((order) => {
      todayRevenue += order.totalPrice;
      const orderQty = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      todayItemsSold += orderQty;

      if (order.source === "OFFLINE") {
        todayOfflineRevenue += order.totalPrice;
      } else {
        todayOnlineRevenue += order.totalPrice;
      }

      order.items.forEach((item) => {
        if (!todayTopItemsMap[item.name]) {
          todayTopItemsMap[item.name] = { name: item.name, qty: 0, total: 0 };
        }
        todayTopItemsMap[item.name].qty += item.quantity;
        todayTopItemsMap[item.name].total += item.price * item.quantity;
      });
    });

    const todayTopItems = Object.values(todayTopItemsMap).sort(
      (a, b) => b.total - a.total,
    );
    const offlinePercent =
      todayRevenue > 0
        ? Math.round((todayOfflineRevenue / todayRevenue) * 100)
        : 0;
    const onlinePercent =
      todayRevenue > 0
        ? Math.round((todayOnlineRevenue / todayRevenue) * 100)
        : 0;

    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Today's Revenue
              </span>
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
                <Banknote size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                ₹{todayRevenue.toLocaleString("en-IN")}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Completed today
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Today's Bills
              </span>
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
                <CheckCircle2 size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {todayOrders.length}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                POS + WhatsApp checkouts
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Today's Items Sold
              </span>
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-500">
                <Package size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {todayItemsSold} pcs
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Quantity sold today
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Today's Avg Bill
              </span>
              <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
                <TrendingUp size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                ₹
                {(todayOrders.length
                  ? Math.round(todayRevenue / todayOrders.length)
                  : 0
                ).toLocaleString("en-IN")}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">
                Per completed order
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                Today's Transactions
              </h2>
              <div className="relative w-full sm:w-auto">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search invoice or name..." 
                  value={todaySearch}
                  onChange={e => setTodaySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-red-500 w-full sm:w-48"
                />
              </div>
            </div>
            <div className="overflow-x-auto w-full flex-1">
              <table className="w-full text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Invoice ID</th>
                    <th className="px-6 py-3">Customer Name</th>
                    <th className="px-6 py-3">Source</th>
                    <th className="px-6 py-3 text-center">Items</th>
                    <th className="px-6 py-3 text-right">Grand Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-900">
                  {todayOrders.filter(tx => 
                    tx.id.toLowerCase().includes(todaySearch.toLowerCase()) || 
                    (tx.customerName || '').toLowerCase().includes(todaySearch.toLowerCase())
                  ).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">{tx.id}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {tx.customerName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest ${tx.source === "ONLINE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                        >
                          {tx.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {tx.items.reduce((a, b) => a + b.quantity, 0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        ₹{tx.totalPrice.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                  {todayOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-slate-400 italic"
                      >
                        No orders completed today yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
                Today's Channel Split
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="uppercase text-red-600">Offline</span>
                    <span className="text-slate-900">
                      ₹{todayOfflineRevenue.toLocaleString("en-IN")} (
                      {offlinePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-red-600 h-1.5 rounded-full"
                      style={{ width: `${offlinePercent}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="uppercase text-green-600">Online</span>
                    <span className="text-slate-900">
                      ₹{todayOnlineRevenue.toLocaleString("en-IN")} (
                      {onlinePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${onlinePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
                Today's Top Items
              </h2>
              <div className="space-y-3">
                {todayTopItems.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.qty} pcs
                      </p>
                    </div>
                    <div className="font-black text-slate-900">
                      ₹{item.total.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
                {todayTopItems.length === 0 && (
                  <p className="text-xs text-slate-400 italic">
                    No products sold today.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductsTab = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
          Product Sales Leaderboard
        </h2>
        <div className="relative w-full sm:w-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search product..." 
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-red-500 w-full sm:w-48"
          />
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-[800px]">
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
            {stats.leaderboard
              .filter(prod => prod.name.toLowerCase().includes(productSearch.toLowerCase()))
              .map((prod) => (
              <tr key={prod.rank} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500">{prod.rank}</td>
                <td className="px-6 py-4">{prod.name}</td>
                <td className="px-6 py-4 text-center text-slate-600">
                  {prod.qty} pcs
                </td>
                <td className="px-6 py-4 text-right font-black">
                  ₹{prod.revenue.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-32 bg-slate-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${prod.share}%`,
                          backgroundColor: themeColor,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">
                      {prod.share}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {stats.leaderboard.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400 italic"
                >
                  No products sold in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCouponsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
            Discount Summary
          </h2>
          <div className="space-y-4">
            <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Total Discounts Given
                </span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{stats.coupons.totalDiscounts.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Percent size={16} />
              </div>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Discounted Orders
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {stats.coupons.discountedOrders}
                </span>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Tag size={16} />
              </div>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Avg Discount Per Order
                </span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{stats.coupons.avgDiscount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <IndianRupee size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
            Promo Campaign Performance
          </h2>
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID or name..." 
              value={couponSearch}
              onChange={e => setCouponSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-red-500 w-full sm:w-48"
            />
          </div>
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
              {stats.coupons.transactions
                .filter(tx => tx.id.toLowerCase().includes(couponSearch.toLowerCase()) || tx.customer.toLowerCase().includes(couponSearch.toLowerCase()))
                .map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4">{tx.id}</td>
                  <td className="px-6 py-4">{tx.customer}</td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    ₹{tx.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-right text-red-600">
                    -₹{tx.discount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              {stats.coupons.transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-400 italic"
                  >
                    No coupons used in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto text-slate-800 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            POS & E-Commerce Analytics
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Real-time revenue, product performance, and coupon metrics connected
            directly to Supabase
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-bold transition-colors shadow-sm cursor-pointer ${isRefreshing ? "text-slate-400" : "text-slate-700"}`}
          disabled={isRefreshing}
        >
          <RefreshCw
            size={14}
            className={isRefreshing ? "animate-spin text-slate-400" : ""}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Period Filter (Hidden for TODAY'S SALES) */}
      {activeTab !== "TODAY'S SALES" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">
            PERIOD:
          </span>
          <div className="flex items-center gap-1 bg-white rounded-2xl sm:rounded-full border border-slate-200 p-1 shadow-sm text-xs font-bold text-slate-600 overflow-x-auto max-w-full">
            {[
              "All Time",
              "Today",
              "This Week",
              "This Month",
              "This Year",
              "Custom",
            ].map((f) => (
              <button
                key={f}
                onClick={() => setPeriod(f)}
                className={`px-3 sm:px-4 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0 ${period === f ? "text-white shadow-sm" : "hover:bg-slate-50"}`}
                style={{
                  backgroundColor: period === f ? themeColor : "transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {period === "Custom" && (
            <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl sm:rounded-full border border-slate-200 px-3 py-1.5 shadow-sm text-xs font-bold text-slate-700 animate-in slide-in-from-left-2">
              <span className="text-[10px] text-slate-400">FROM</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="outline-none bg-transparent text-xs"
              />
              <span className="text-[10px] text-slate-400">TO</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="outline-none bg-transparent text-xs"
              />
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 pt-2 overflow-x-auto max-w-full">
        {["REVENUE", "TODAY'S SALES", "PRODUCTS", "COUPONS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? "text-slate-900 border-b-[#dc2626]"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
            style={{
              borderColor: activeTab === tab ? themeColor : "transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626]"></div>
        </div>
      ) : (
        <div className="pt-2">
          {activeTab === "REVENUE" && renderRevenueTab()}
          {activeTab === "TODAY'S SALES" && renderTodaySalesTab()}
          {activeTab === "PRODUCTS" && renderProductsTab()}
          {activeTab === "COUPONS" && renderCouponsTab()}
        </div>
      )}

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
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Product Name
                </p>
                <p className="text-lg font-black text-slate-900 leading-snug">
                  {stats.topProduct.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{stats.topProduct.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Quantity Sold
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {stats.topProduct.qty} pcs
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">
                    Market Share (Products)
                  </span>
                  <span className="text-slate-900">
                    {stats.topProduct.share.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${stats.topProduct.share}%`,
                      backgroundColor: themeColor,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowProductModal(false)}
                className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors text-sm cursor-pointer"
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
