"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const { signInWithGoogle, signInWithMagicLink, loading, error, message, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/cart');
    }
  }, [user, router]);

  if (user) {
    return <div className="min-h-screen bg-zinc-50" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-neutral-800 font-sans relative overflow-hidden p-3.5 sm:p-6 selection:bg-red-500/20 selection:text-red-950">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-500/10 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-neutral-100 shadow-xl relative z-10 flex flex-col items-center text-center my-auto"
      >
        <button 
          onClick={() => router.push('/')}
          className="absolute top-5 left-5 text-neutral-400 hover:text-neutral-800 transition-colors p-1"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="mb-4 mt-2 flex justify-center w-full">
          <img src="/logo.webp" alt="Mishi" className="h-12 sm:h-16 w-auto object-contain" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 mb-2">
          Welcome to Mishi
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm mb-6 leading-relaxed">
          Sign in to track orders, manage your profile, or access the admin portal.
        </p>

        {error && (
          <div className="w-full bg-red-50 text-red-600 text-xs py-2.5 px-3.5 rounded-xl mb-4 text-left border border-red-100">
            {error}
          </div>
        )}
        
        {message && (
          <div className="w-full bg-green-50 text-green-800 text-xs py-2.5 px-3.5 rounded-xl mb-4 text-left border border-green-100">
            {message}
          </div>
        )}

        {/* Google Login Button */}
        <button 
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full bg-white border border-neutral-200 hover:border-neutral-800 text-neutral-800 font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>
        
        <div className="flex items-center w-full my-6">
          <div className="flex-1 border-t border-neutral-100"></div>
          <span className="px-3 text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Or</span>
          <div className="flex-1 border-t border-neutral-100"></div>
        </div>

        <div className="w-full space-y-3">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-white border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 text-xs sm:text-sm py-3 sm:py-3.5 pl-10 pr-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2C392A] transition-all duration-300 disabled:opacity-70"
            />
          </div>
          <button 
            onClick={() => signInWithMagicLink(email)}
            disabled={loading || !email}
            className="w-full bg-[#2C392A] hover:bg-[#1e271d] text-white text-xs font-bold tracking-wider uppercase py-3.5 rounded-xl shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue with Email
          </button>
        </div>
        
        <p className="mt-6 text-[11px] text-neutral-400">
          By continuing, you agree to our <a href="#" className="underline hover:text-neutral-800">Terms of Service</a> and <a href="#" className="underline hover:text-neutral-800">Privacy Policy</a>.
        </p>
      </motion.div>

      {/* Simple Footer */}
      <div className="mt-6 text-center text-[10px] text-neutral-400 uppercase tracking-widest px-4">
        &copy; 2026 Mishi Pooja Products. All rights reserved.
      </div>
    </div>
  );
}

