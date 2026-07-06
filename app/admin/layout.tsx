'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, ShoppingBag, 
  Ticket, CreditCard, Users, 
  Menu, X, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const WhatsAppIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  const navigation = [
    { name: 'WhatsApp Center', href: '/admin/whatsapp', icon: WhatsAppIcon, color: 'text-[#25D366]' },
    { name: 'Billing', href: '/admin/billing', icon: CreditCard, color: 'text-blue-500' },
    { name: 'POS Analytics', href: '/admin/analytics', icon: BarChart3, color: 'text-amber-500' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, color: 'text-emerald-500' },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket, color: 'text-purple-500' },
    { name: 'Users', href: '/admin/users', icon: Users, color: 'text-pink-500' },
  ];

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const title = segment === 'analytics' ? 'POS Analytics' : segment.charAt(0).toUpperCase() + segment.slice(1);
      return (
        <span key={segment} className="flex items-center">
          <span className={`${isLast ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
            {title}
          </span>
          {!isLast && <span className="mx-2 text-slate-300">/</span>}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white border-r border-slate-100 flex flex-col
        transition-all duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        ${isDesktopSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          {!isDesktopSidebarCollapsed && (
            <span className="text-xl font-black text-slate-900 tracking-tight whitespace-nowrap overflow-hidden">
              Mishi Admin
            </span>
          )}
          {isDesktopSidebarCollapsed && (
            <span className="text-xl font-black text-slate-900 tracking-tight mx-auto">
              M
            </span>
          )}
          <button className="lg:hidden text-slate-400" onClick={() => setMobileSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive 
                    ? 'bg-[#dc2626] text-white shadow-md shadow-red-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }
                  ${isDesktopSidebarCollapsed ? 'justify-center' : 'justify-start'}
                `}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : item.color}`} />
                {!isDesktopSidebarCollapsed && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 px-2 py-2 ${isDesktopSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
              AD
            </div>
            {!isDesktopSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@mishi.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <button
              className="hidden lg:flex p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
            >
              {isDesktopSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <div className="hidden md:flex text-sm ml-2">
              {getBreadcrumbs()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[#f8f9fa]">
          {children}
        </div>
      </main>
    </div>
  );
}
