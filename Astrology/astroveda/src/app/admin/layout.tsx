'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { fontVariables } from '@/lib/fonts';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Clock,
  FileText,
  Star,
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  CalendarDays,
  User,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    router.push('/admin/login');
    router.refresh();
  };

  // Close mobile nav on route change or Escape
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    if (mobileNavOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  if (pathname === '/admin/login') {
    return (
      <html lang="en" className={fontVariables}>
        <body className="min-h-screen bg-[#10172B] text-[#DBE1FD] antialiased">
          {children}
        </body>
      </html>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/services', label: 'Services', icon: Briefcase },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/availability', label: 'Time Slots', icon: Clock },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { href: '/admin/enquiries', label: 'Enquiries', icon: HelpCircle },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-[#10172B] text-[#DBE1FD] flex flex-col antialiased">
        <div className="min-h-screen bg-[#10172B] text-[#DBE1FD] flex flex-col flex-1">

      {/* 1. Top Header Bar */}
      <header className="h-16 bg-[#10172B] border-b border-[#27304A] px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 gap-4">
        
        {/* Mobile menu trigger (< lg) */}
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="lg:hidden p-2 rounded-lg text-[#D0C5B4] hover:text-[#F6D186] hover:bg-[#27304A] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
          aria-label="Toggle admin navigation menu"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile Admin Brand */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="h-7 w-7 rounded-full bg-[#27304A] border border-[#D8B56D]/40 flex items-center justify-center text-[#F6D186] font-serif text-xs">
            ॐ
          </div>
          <span className="font-heading text-sm font-bold text-[#F6D186] tracking-wide">
            MyGuruji
          </span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D0C5B4]/60" />
          <input
            type="text"
            placeholder="Search consultations, patrons, muhurta..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#27304A]/60 border border-[#D8B56D]/20 text-xs text-white placeholder-[#D0C5B4]/50 focus:outline-none focus:border-[#D8B56D]"
          />
        </div>

        {/* Right Info & Admin Profile */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/20 text-[#16A34A] text-[11px] font-semibold border border-[#16A34A]/30">
            <div className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Panchang Sync Active</span>
          </div>

          <button type="button" className="p-2 rounded-lg text-[#D0C5B4] hover:text-[#F6D186] hover:bg-[#27304A] transition-colors relative min-h-[40px] min-w-[40px] flex items-center justify-center">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#D62839]" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-[#27304A]">
            <div className="h-8 w-8 rounded-full bg-[#F6D186] text-[#402D00] flex items-center justify-center font-bold text-xs shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">Vedic Registrar</span>
              <span className="text-[10px] text-[#D8B56D]">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay (< lg) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-[#10172B] border-r border-[#27304A] p-4 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#27304A] border border-[#D8B56D]/40 flex items-center justify-center text-[#F6D186] font-serif text-sm">
                    ॐ
                  </div>
                  <div>
                    <span className="font-heading text-sm font-bold text-[#F6D186] tracking-wide block">
                      MYGURUJI
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-[#D0C5B4] block">
                      ADMIN SANCTUM
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-[#D0C5B4] hover:text-[#F6D186]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px]
                        ${active
                          ? 'bg-[#F6D186] text-[#402D00] shadow-sm font-bold'
                          : 'text-[#D0C5B4] hover:bg-[#27304A] hover:text-[#F6D186]'}
                      `}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-[#27304A] px-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#27304A] text-[#F6D186] flex items-center justify-center text-xs font-bold">
                  ॐ
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block">Omkar Ransing Guruji</span>
                  <span className="text-[9px] text-[#D8B56D] block">Grand Astrologer</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Log Out from Admin Sanctum"
                className="text-[#D0C5B4] hover:text-[#D62839] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-1">
        {/* 2. Desktop Left Midnight Sidebar */}
        <aside className="hidden lg:flex w-56 bg-[#10172B] border-r border-[#27304A] shrink-0 min-h-[calc(100vh-4rem)] flex-col justify-between p-3">
          <div className="space-y-4">
            {/* Logo */}
            <div className="px-3 py-2 flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#27304A] border border-[#D8B56D]/40 flex items-center justify-center text-[#F6D186] font-serif text-sm">
                ॐ
              </div>
              <div>
                <span className="font-heading text-sm font-bold text-[#F6D186] tracking-wide block">
                  MYGURUJI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#D0C5B4] block">
                  ADMIN SANCTUM
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                      ${active
                        ? 'bg-[#F6D186] text-[#402D00] shadow-sm font-bold'
                        : 'text-[#D0C5B4] hover:bg-[#27304A] hover:text-[#F6D186]'}
                    `}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Astrologer Status */}
          <div className="pt-3 border-t border-[#27304A] px-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#27304A] text-[#F6D186] flex items-center justify-center text-xs font-bold">
                ॐ
              </div>
              <div>
                <span className="text-[11px] font-bold text-white block">Omkar Ransing Guruji</span>
                <span className="text-[9px] text-[#D8B56D] block">Grand Astrologer</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Log Out from Admin Sanctum"
              className="text-[#D0C5B4] hover:text-[#D62839] p-1 cursor-pointer transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>

        {/* 3. Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#10172B] overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
      </body>
    </html>
  );
}
