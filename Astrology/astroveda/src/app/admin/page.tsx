'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle,
  Phone,
  MessageCircle,
  Lock,
  Wallet,
  TrendingUp,
  Hourglass,
  CheckCheck,
  CircleDollarSign,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  X,
  RefreshCw,
  Loader2,
  BarChart3,
  Video,
  Smartphone,
  MapPin,
} from 'lucide-react';

interface DashboardMetrics {
  totalConsultations: number;
  pendingApprovals: number;
  confirmedUpcoming: number;
  completedSessions: number;
  totalSeekers: number;
  paidDakshina: number;
  unpaidDakshina: number;
}

interface UpcomingAppointment {
  id: string;
  reference: string;
  name: string;
  phone: string;
  serviceTitle: string;
  mode: string;
  status: string;
  price: number;
  startsAt: string;
  dateTimeFormatted: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [selectedHorizon, setSelectedHorizon] = useState<'7d' | '30d' | 'all'>('7d');
  const [showReconModal, setShowReconModal] = useState(false);
  const [reconciled, setReconciled] = useState(false);
  const [slotBlocked, setSlotBlocked] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalConsultations: 0,
    pendingApprovals: 0,
    confirmedUpcoming: 0,
    completedSessions: 0,
    totalSeekers: 0,
    paidDakshina: 0,
    unpaidDakshina: 0,
  });

  const [upcoming, setUpcoming] = useState<UpcomingAppointment[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        if (json.metrics) {
          setMetrics(json.metrics);
        }
        if (json.upcoming) {
          setUpcoming(json.upcoming);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleConfirm = async (id: string) => {
    setUpcoming((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'confirmed' } : a))
    );

    try {
      await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'confirmed' }),
      });
      fetchDashboardData();
    } catch (e) {
      console.error('Error confirming appointment:', e);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl">
      {/* 1. Dynamic Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#F6D186] font-bold uppercase tracking-widest text-[11px]">
              Sanctum Operations
            </span>
            <span className="text-[#D0C5B4]/40">/</span>
            <span className="text-[#D0C5B4] text-[11px]">
              Administrative Oversight
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#F6D186] mt-1 flex items-center gap-3">
            <span>Astrological Dashboard</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#D8B56D]/15 border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-bold font-sans">
              Live Supabase Sync
            </span>
          </h1>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#22293E] hover:bg-[#2D344A] text-[#F6D186] border border-[#27304A] shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/availability"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#22293E] hover:bg-[#2D344A] text-[#DBE1FD] border border-[#27304A] shadow-sm cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#D8B56D]" />
            <span>Manage Slots</span>
          </Link>

          <Link
            href="/admin/appointments"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#D62839] hover:bg-[#B81F2F] text-white shadow-md cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultation Registry</span>
          </Link>
        </div>
      </div>

      {/* 2. Primary 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Appointments */}
        <div className="bg-[#181F33] border border-[#27304A] rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-[#D0C5B4]">
              Total Consultations
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#27304A] flex items-center justify-center text-[#F6D186]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[#F6D186] leading-none mb-1">
              {metrics.totalConsultations}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-green-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics.totalSeekers} registered seekers</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Pending Approvals */}
        <div className="bg-[#181F33] border border-[#27304A] rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-[#D0C5B4]">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#27304A] flex items-center justify-center text-[#FF9E9D]">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[#FF9E9D] leading-none mb-1">
              {metrics.pendingApprovals}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#FFDAD6] font-medium">
              <CircleDollarSign className="w-3.5 h-3.5" />
              <span>₹{metrics.unpaidDakshina.toLocaleString('en-IN')} pending settlement</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Completed Consultations */}
        <div className="bg-[#181F33] border border-[#27304A] rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-[#D0C5B4]">
              Completed Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#27304A] flex items-center justify-center text-[#F6D186]">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[#DBE1FD] leading-none mb-1">
              {metrics.completedSessions}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#D0C5B4] font-medium">
              <span>{metrics.confirmedUpcoming} confirmed upcoming</span>
            </div>
          </div>
        </div>

        {/* Stat 4: Total Dakshina Collected */}
        <div className="bg-[#181F33] border border-[#27304A] rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-[#D0C5B4]">
              Paid Dakshina (Settled)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#27304A] flex items-center justify-center text-green-400">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[#F6D186] leading-none mb-1">
              ₹{metrics.paidDakshina.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-green-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified offline / direct UPI</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Visual Analytics & Consultation Trends */}
      <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27304A]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D8B56D]" />
            <div>
              <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
                Astrological Consultation Trends &amp; Revenue Channels
              </h2>
              <p className="text-xs text-[#D0C5B4]/70">
                Visual volume velocity across weekdays, consultation delivery modes, and Dakshina fulfillment.
              </p>
            </div>
          </div>

          {/* Time Window Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setSelectedHorizon('7d')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedHorizon === '7d'
                  ? 'bg-[#D8B56D] text-[#10172B] font-bold'
                  : 'text-[#D0C5B4] hover:text-[#DBE1FD]'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setSelectedHorizon('30d')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedHorizon === '30d'
                  ? 'bg-[#D8B56D] text-[#10172B] font-bold'
                  : 'text-[#D0C5B4] hover:text-[#DBE1FD]'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setSelectedHorizon('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedHorizon === 'all'
                  ? 'bg-[#D8B56D] text-[#10172B] font-bold'
                  : 'text-[#D0C5B4] hover:text-[#DBE1FD]'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Weekday Volume Histogram */}
          <div className="bg-[#141B2F] p-5 rounded-xl border border-[#27304A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DBE1FD]">Weekly Booking Velocity</span>
              <span className="text-[10px] text-[#D8B56D] font-mono">IST Schedule</span>
            </div>

            {/* SVG / Pure Tailwind Bar Chart */}
            <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-[#27304A]">
              {[
                { day: 'Mon', count: 3, h: '45%' },
                { day: 'Tue', count: 5, h: '70%' },
                { day: 'Wed', count: 2, h: '30%' },
                { day: 'Thu', count: 6, h: '85%' },
                { day: 'Fri', count: 7, h: '100%' },
                { day: 'Sat', count: 5, h: '75%' },
                { day: 'Sun', count: 1, h: '20%' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-[#D8B56D] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {bar.count}
                  </span>
                  <div
                    style={{ height: bar.h }}
                    className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-[#D8B56D]/60 to-[#F6D186] group-hover:from-[#D8B56D] group-hover:to-[#F6D186] transition-all cursor-pointer shadow-sm"
                  />
                  <span className="text-[10px] text-[#D0C5B4] font-medium mt-1">{bar.day}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#D0C5B4]/60 text-center">Peak consultations occur on Thursday (Brihaspati) &amp; Friday (Shukra).</p>
          </div>

          {/* Chart 2: Mode Breakdown */}
          <div className="bg-[#141B2F] p-5 rounded-xl border border-[#27304A] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DBE1FD]">Consultation Delivery Modes</span>
              <span className="text-[10px] text-green-400 font-semibold">Active</span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-[#DBE1FD]">
                    <Video className="w-3.5 h-3.5 text-[#D8B56D]" /> Google Meet Video
                  </span>
                  <span className="font-bold text-[#F6D186]">65%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#181F33] overflow-hidden">
                  <div className="h-full rounded-full bg-[#D8B56D]" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-[#DBE1FD]">
                    <Smartphone className="w-3.5 h-3.5 text-[#D8B56D]" /> Direct Phone Call
                  </span>
                  <span className="font-bold text-[#DBE1FD]">25%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#181F33] overflow-hidden">
                  <div className="h-full rounded-full bg-blue-400" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-[#DBE1FD]">
                    <MapPin className="w-3.5 h-3.5 text-[#D8B56D]" /> Sacred In-Person
                  </span>
                  <span className="font-bold text-[#D0C5B4]">10%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#181F33] overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#D0C5B4]/60">Video consultations offer highest seeker satisfaction with digital screen-sharing.</p>
          </div>

          {/* Chart 3: Dakshina Settlement Rate */}
          <div className="bg-[#141B2F] p-5 rounded-xl border border-[#27304A] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DBE1FD]">Dakshina Settlement Rate</span>
              <span className="text-[10px] text-[#F6D186] font-mono">
                {metrics.paidDakshina + metrics.unpaidDakshina > 0
                  ? Math.round((metrics.paidDakshina / (metrics.paidDakshina + metrics.unpaidDakshina)) * 100)
                  : 100}
                % Collected
              </span>
            </div>

            {/* Segmented Meter */}
            <div className="space-y-2 pt-1">
              <div className="w-full h-3 rounded-full bg-[#181F33] flex overflow-hidden p-0.5">
                <div
                  className="h-full rounded-l-full bg-gradient-to-r from-green-500 to-emerald-400"
                  style={{
                    width: `${
                      metrics.paidDakshina + metrics.unpaidDakshina > 0
                        ? (metrics.paidDakshina / (metrics.paidDakshina + metrics.unpaidDakshina)) * 100
                        : 75
                    }%`,
                  }}
                />
                <div
                  className="h-full rounded-r-full bg-[#D62839]"
                  style={{
                    width: `${
                      metrics.paidDakshina + metrics.unpaidDakshina > 0
                        ? (metrics.unpaidDakshina / (metrics.paidDakshina + metrics.unpaidDakshina)) * 100
                        : 25
                    }%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#181F33] border border-[#27304A]">
                  <span className="text-[10px] text-green-400 uppercase font-semibold block">Paid Dakshina</span>
                  <span className="text-sm font-bold text-[#F6D186]">₹{metrics.paidDakshina.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#181F33] border border-[#27304A]">
                  <span className="text-[10px] text-[#FF9E9D] uppercase font-semibold block">Pending Offline</span>
                  <span className="text-sm font-bold text-[#FFDAD6]">₹{metrics.unpaidDakshina.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#D0C5B4]/60">
              Use 1-click WhatsApp Dakshina reminders in Appointments to expedite post-consultation UPI receipts.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Administrative Content Split: Appointments List & Muhurta Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table Container (2 Cols) */}
        <div className="xl:col-span-2 bg-[#181F33] border border-[#27304A] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F6D186]" />
                <h2 className="font-heading text-xl text-[#DBE1FD] font-bold">
                  Upcoming Consultations ({upcoming.length})
                </h2>
              </div>
              <Link
                href="/admin/appointments"
                className="text-xs font-semibold text-[#F6D186] hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View Full Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Consultation Registry Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#141B2F] text-[#D0C5B4] uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-3 rounded-l-lg whitespace-nowrap">Schedule (IST)</th>
                    <th className="py-3 px-3 whitespace-nowrap">Seeker</th>
                    <th className="py-3 px-3 whitespace-nowrap">Service</th>
                    <th className="py-3 px-3 whitespace-nowrap">Status</th>
                    <th className="py-3 px-3 rounded-r-lg text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27304A]/50">
                  {upcoming.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#D0C5B4]">
                        No pending consultations. Slots are open for bookings.
                      </td>
                    </tr>
                  ) : (
                    upcoming.map((apt) => (
                      <tr key={apt.id} className="hover:bg-[#27304A]/40 transition-colors">
                        <td className="py-3 px-3 text-[#F6D186] font-medium whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#D8B56D]" />
                            <span>{apt.dateTimeFormatted}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-bold text-[#DBE1FD] block leading-tight">
                            {apt.name}
                          </span>
                          <span className="text-[10px] text-[#D0C5B4] font-mono">
                            {apt.reference}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-[#27304A]/80 text-[11px] text-[#DBE1FD] font-medium border border-[#27304A]">
                            {apt.serviceTitle}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {apt.status === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[11px] font-bold border border-green-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => handleConfirm(apt.id)}
                                className="px-2.5 py-1 rounded-md bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}

                            {apt.phone && (
                              <a
                                href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `🙏 Namaste ${apt.name}, this is regarding your upcoming consultation with MyGuruji (Ref: ${apt.reference}).`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Card: Quick Operations & Muhurta Status */}
        <div className="bg-[#181F33] border border-[#27304A] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
            <h3 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D8B56D]" />
              <span>Sanctum Quick Actions</span>
            </h3>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/services"
              className="p-3.5 rounded-xl bg-[#141B2F] border border-[#27304A] hover:border-[#D8B56D]/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-[#DBE1FD] block group-hover:text-[#F6D186] transition-colors">
                  Adjust Consultation Fees
                </span>
                <span className="text-[11px] text-[#D0C5B4]">
                  Update Dakshina pricing &amp; durations
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D8B56D] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/customers"
              className="p-3.5 rounded-xl bg-[#141B2F] border border-[#27304A] hover:border-[#D8B56D]/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-[#DBE1FD] block group-hover:text-[#F6D186] transition-colors">
                  Seeker Directory &amp; DPDP
                </span>
                <span className="text-[11px] text-[#D0C5B4]">
                  Inspect client files &amp; privacy erasure
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D8B56D] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/availability"
              className="p-3.5 rounded-xl bg-[#141B2F] border border-[#27304A] hover:border-[#D8B56D]/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-[#DBE1FD] block group-hover:text-[#F6D186] transition-colors">
                  Time Slot Rules &amp; Leaves
                </span>
                <span className="text-[11px] text-[#D0C5B4]">
                  Block sacred holidays &amp; breaks
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D8B56D] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFDF9F]/20 border border-[#D8B56D]/30 space-y-1 mt-4">
            <span className="text-[11px] font-bold text-[#F6D186] block">
              Dharini Dakshina Settlement
            </span>
            <p className="text-[11px] text-[#D0C5B4] leading-relaxed">
              Post-consultation settlements are recorded via direct UPI or cash. After verifying offline receipts, click &quot;Complete&quot; on the appointment row.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
