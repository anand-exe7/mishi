'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, ShoppingBag, 
  Ticket, CreditCard, Users, 
  Menu, X, PanelLeftClose, PanelLeftOpen, Package,
  ShieldAlert, LogOut
} from 'lucide-react';
import { AdminProvider } from './AdminContext';
import { useAuth } from '@/lib/useAuth';
import { fetchProfileByUid, fetchProfiles } from '@/lib/db';
import { createClient } from '@/lib/supabase';

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
  const router = useRouter();
  
  const { user, loading: authLoading, signOut } = useAuth();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState('Admin User');

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkAndBootstrap = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const profile = await fetchProfileByUid(user.id);
        if (profile) {
          if (profile.role === 'Admin') {
            setIsAdmin(true);
            setAdminName(profile.name || user.email || 'Admin User');
          } else {
            setIsAdmin(false);
          }
          setRoleLoading(false);
        } else {
          // Profile does not exist. Let's seed it!
          const allProfiles = await fetchProfiles().catch(() => []);
          const isFirstProfile = allProfiles.length === 0;
          const initialRole = isFirstProfile ? 'Admin' : 'Customer';

          const newProfile = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || 'Admin User',
            mobile: '',
            role: initialRole,
            joined_date: new Date().toISOString()
          };

          const supabase = createClient();
          const { error } = await supabase.from('profiles').insert([newProfile]);
          
          if (!error) {
            if (initialRole === 'Admin') {
              setIsAdmin(true);
              setAdminName(newProfile.name);
            } else {
              setIsAdmin(false);
            }
          } else {
            console.error('Error auto-creating user profile:', error);
            setIsAdmin(false);
          }
          setRoleLoading(false);
        }
      } catch (err) {
        console.error('Error in admin verification:', err);
        setIsAdmin(false);
        setRoleLoading(false);
      }
    };

    if (!authLoading) {
      checkAndBootstrap();
    }
  }, [user, authLoading, router]);

  const navigation = [
    { name: 'WhatsApp Center', href: '/admin/whatsapp', icon: WhatsAppIcon, color: 'text-[#25D366]' },
    { name: 'Billing', href: '/admin/billing', icon: CreditCard, color: 'text-blue-500' },
    { name: 'Products', href: '/admin/products', icon: Package, color: 'text-orange-500' },
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

  // Loading Screen
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626]"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verifying Admin Access...</p>
      </div>
    );
  }

  // Access Denied Screen
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-slate-200 shadow-xl rounded-[2rem] p-10 max-w-md w-full text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#dc2626] flex items-center justify-center mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-wide">Access Denied</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            You do not have administrative privileges to access this portal. Please log in with an authorized account or return to the storefront.
          </p>
          
          <div className="flex flex-col gap-3 w-full font-bold">
            <Link 
              href="/"
              className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg text-center"
            >
              Back to Storefront
            </Link>
            <button 
              onClick={async () => {
                await signOut();
                router.push('/login');
              }}
              className="py-3 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Log in with another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex font-sans">
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
              {adminName.charAt(0).toUpperCase()}
            </div>
            {!isDesktopSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{adminName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
            {!isDesktopSidebarCollapsed && (
              <button 
                onClick={async () => {
                  await signOut();
                  router.push('/login');
                }}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
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
          <AdminProvider>
            {children}
          </AdminProvider>
        </div>
      </main>
    </div>
  );
}
