'use client';

import React, { useState } from 'react';
import { RefreshCw, Search, Shield, User, X, Plus } from 'lucide-react';

type AppUser = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  joined: string;
  role: 'Admin' | 'Customer';
};

const initialUsers: AppUser[] = [
  { id: '1', name: 'Mirudull D', email: 'd.mirudull@gmail.com', mobile: '—', joined: '30/6/2026', role: 'Admin' },
  { id: '2', name: 'Nina Smith', email: 'nina.smith@gmail.com', mobile: '—', joined: '30/6/2026', role: 'Admin' },
  { id: '3', name: 'flame', email: 'crspidey80@gmail.com', mobile: '—', joined: '30/6/2026', role: 'Admin' },
  { id: '4', name: 'Cenexa systems', email: 'cenexasystems@gmail.com', mobile: '—', joined: '30/6/2026', role: 'Admin' },
  { id: '5', name: 'lalithkumarbaskar', email: 'lalithkumarbaskar@gmail.com', mobile: '—', joined: '2/7/2026', role: 'Customer' },
  { id: '6', name: 'Mama', email: 'm39583004@gmail.com', mobile: '—', joined: '2/7/2026', role: 'Customer' },
  { id: '7', name: 'Organic Sisterz', email: 'organicsisterz@gmail.com', mobile: '—', joined: '3/7/2026', role: 'Admin' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const toggleRole = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === 'Admin' ? 'Customer' : 'Admin' };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto text-slate-900 font-sans p-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">User Management</h1>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Manage registered clients and promote store administrators</p>
        </div>
        <button 
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-bold transition-colors shadow-sm ${isRefreshing ? 'text-slate-400' : 'text-slate-700'}`}
          disabled={isRefreshing}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> 
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative w-full md:w-[400px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-slate-300 shadow-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="border-b border-slate-100 bg-white">
              <tr className="text-[11px] font-bold text-slate-700">
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Mobile</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-900">{user.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-600 text-[13px] font-medium">{user.email}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-600 font-medium">{user.mobile}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-600 text-[13px] font-medium">{user.joined}</span>
                  </td>
                  <td className="px-8 py-5">
                    {user.role === 'Admin' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f6ed] text-[#1f874c] text-[11px] font-bold border border-[#c3e6cb]">
                        <Shield size={12} /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                        <User size={12} /> Customer
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {user.role === 'Admin' ? (
                      <button 
                        onClick={() => toggleRole(user.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 text-[11px] font-bold border border-red-200 transition-colors"
                      >
                        <X size={12} /> Remove Admin
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleRole(user.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent hover:bg-[#e8f6ed] text-[#1f874c] text-[11px] font-bold border border-[#c3e6cb] transition-colors"
                      >
                        <Plus size={12} /> Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-slate-500 italic">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
