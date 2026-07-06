'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type OrderItem = {
  product_name: string;
  variant: string;
  size: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  shipping_address?: string;
  source: 'Offline' | 'Online';
  status: string;
  total_amount: number;
  discount_amount: number;
  delivery_amount: number;
  items: OrderItem[];
};

type AdminContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Initial Dummy Data to populate the dashboard nicely
const initialOrders: Order[] = [
  {
    id: 'INV-2026-001',
    created_at: new Date().toISOString(),
    customer_name: 'Anita Desai',
    customer_phone: '9876500001',
    source: 'Offline',
    status: 'Completed',
    total_amount: 850,
    discount_amount: 0,
    delivery_amount: 0,
    items: [
      { product_name: 'Bath Powder', variant: 'Standard', size: '500g', quantity: 2, unit_price: 250 },
      { product_name: 'Herbal Hair Oil', variant: 'Premium', size: '100ml', quantity: 1, unit_price: 350 }
    ]
  },
  {
    id: 'INV-2026-002',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    customer_name: 'Vikram Singh',
    customer_phone: '9876500002',
    source: 'Online',
    status: 'Processing',
    total_amount: 1200,
    discount_amount: 100,
    delivery_amount: 100,
    items: [
      { product_name: 'Multi Millet Health Mix', variant: 'Standard', size: '1kg', quantity: 3, unit_price: 400 }
    ]
  },
  {
    id: 'INV-2026-003',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    customer_name: 'Sneha Reddy',
    customer_phone: '9876500003',
    source: 'Offline',
    status: 'Completed',
    total_amount: 2750,
    discount_amount: 250,
    delivery_amount: 0,
    items: [
      { product_name: 'Face Pack & Bath Powder', variant: 'Combo', size: '500g', quantity: 5, unit_price: 550 }
    ]
  },
  {
    id: 'INV-2026-004',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    customer_name: 'Rohan Sharma',
    customer_phone: '9876500004',
    source: 'Online',
    status: 'Completed',
    total_amount: 400,
    discount_amount: 0,
    delivery_amount: 50,
    items: [
      { product_name: 'Herbal Shikakai Powder', variant: 'Standard', size: '200g', quantity: 2, unit_price: 200 }
    ]
  }
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // In a real app, this would fetch from Supabase.
  // For now, we use state (which persists as long as user doesn't hard-refresh).
  
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AdminContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
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
