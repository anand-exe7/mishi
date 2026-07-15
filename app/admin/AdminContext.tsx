'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  fetchOrders, 
  insertOrder, 
  updateOrderStatusDb, 
  fetchWhatsappRequests, 
  updateWhatsappRequestStatus 
} from '@/lib/db';

type AdminContextType = {
  orders: Order[];
  whatsappRequests: Order[];
  loading: boolean;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => Promise<void>;
  updateWhatsappStatus: (id: string, status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => Promise<void>;
  refreshData: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [whatsappRequests, setWhatsappRequests] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [fetchedOrders, fetchedWhatsapp] = await Promise.all([
        fetchOrders(),
        fetchWhatsappRequests()
      ]);
      setOrders(fetchedOrders);
      setWhatsappRequests(fetchedWhatsapp);
    } catch (err) {
      console.error('Error refreshing admin context data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addOrder = async (order: Order) => {
    await insertOrder(order);
    setOrders((prev) => [order, ...prev]);
    // If it was an online order, sync whatsappRequests too
    if (order.source === 'ONLINE') {
      setWhatsappRequests((prev) => [order, ...prev]);
    }
  };

  const updateOrderStatus = async (id: string, status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => {
    await updateOrderStatusDb(id, status);
    setOrders((prev) => prev.map(o => o.id === id ? { ...o, status } : o));
    // Keep whatsappRequests in sync
    setWhatsappRequests((prev) => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateWhatsappStatus = async (id: string, status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => {
    await updateWhatsappRequestStatus(id, status);
    setWhatsappRequests((prev) => prev.map(o => o.id === id ? { ...o, status } : o));
    // Keep orders in sync
    setOrders((prev) => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AdminContext.Provider value={{ 
      orders, 
      whatsappRequests, 
      loading, 
      addOrder, 
      updateOrderStatus, 
      updateWhatsappStatus,
      refreshData 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
