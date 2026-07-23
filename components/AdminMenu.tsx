'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronDown, LogOut, Shield, UserCircle } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

export function AdminMenu() {
  const { user, signOut, isSupabaseConfigured } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    setOpen(false);
    if (!isSupabaseConfigured) {
      toast.info('Supabase is not configured, so there is no active session to sign out of.');
      return;
    }
    await signOut();
    toast.success('Signed out');
    router.push('/login');
  }

  const label = user?.user_metadata?.full_name || user?.email || 'Admin';
  const initial = String(label).trim().charAt(0).toUpperCase() || 'A';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
          <span className="text-[10px] font-bold text-white">{initial}</span>
        </div>
        <span className="max-w-[9rem] truncate text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Shield className="h-3.5 w-3.5 text-blue-500" /> {label}
              </p>
              {user?.email && <p className="mt-0.5 truncate text-[11px] text-slate-400">{user.email}</p>}
              {!isSupabaseConfigured && <p className="mt-0.5 text-[10px] text-amber-500">Demo mode — no account connected</p>}
            </div>
            <button
              onClick={() => { setOpen(false); router.push('/settings'); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <UserCircle className="h-3.5 w-3.5" /> Account settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
