'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock, Mail, ShieldAlert, Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from') || '/admin';
  // Open Redirect Mitigation: only permit relative /admin paths
  const safeFrom = (rawFrom.startsWith('/admin') && !rawFrom.startsWith('//') && !rawFrom.includes('\\'))
    ? rawFrom
    : '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      router.push(safeFrom);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 border border-[#D8B56D]/30 shadow-2xl space-y-6 relative z-10">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-full bg-[#10172B] border border-[#D8B56D]/60 flex items-center justify-center text-[#F6D186]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeDasharray="2 2" strokeOpacity="0.6" />
              <circle cx="24" cy="24" r="14" stroke="currentColor" />
              <polygon fill="none" points="24,6 29,19 42,19 31,27 35,40 24,32 13,40 17,27 6,19 19,19" stroke="currentColor" strokeWidth="1" />
              <circle cx="24" cy="24" fill="currentColor" r="2.5" />
            </svg>
          </div>
          <span className="font-heading text-2xl font-bold text-[#10172B]">
            MyGuruji
          </span>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A5A12] block">
          ADMINISTRATOR SANCTUM
        </span>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#10172B]">
          Sign In to Dashboard
        </h1>
        <p className="text-xs text-[#10172B]/60 font-body">
          Authorized astrologer and staff access only. Public registration is disabled.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#10172B] mb-1">
            Administrator Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A5A12]" />
            <input
              type="email"
              required
              placeholder="admin@astroveda.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#10172B]/15 bg-[#F7F3EA]/30 text-xs text-[#10172B] focus:outline-none focus:border-[#D8B56D]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#10172B] mb-1">
            Secret Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A5A12]" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#10172B]/15 bg-[#F7F3EA]/30 text-xs text-[#10172B] focus:outline-none focus:border-[#D8B56D]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#10172B]/50 hover:text-[#10172B] cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-[#D62839] hover:bg-[#B81F2F] text-white font-bold cursor-pointer"
            isLoading={isLoading}
            loadingText="Authenticating…"
          >
            Sign In to Sanctuary Admin
          </Button>
        </div>
      </form>

      {/* Security notice */}
      <div className="pt-4 border-t border-[#10172B]/10 flex flex-col items-center gap-1">
        <p className="text-[11px] text-[#10172B]/60 font-medium">
          Protected by Encrypted Session &amp; Supabase RLS
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#10172B] flex items-center justify-center p-4">
      {/* Background celestial glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D8B56D]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Suspense fallback={
        <div className="flex items-center justify-center gap-2 text-sm text-[#F6D186]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Sanctum Portal...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
