'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Check,
  ShieldCheck,
  CalendarDays,
  Sliders,
  Calendar,
  Trash2,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  Save,
  X,
  Sparkles,
} from 'lucide-react';

interface DayConfig {
  id?: string;
  weekday: number;
  dayName: string;
  workingRuleId?: string;
  breakRuleId?: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  breakStart: string;// HH:mm
  breakEnd: string;  // HH:mm
  hasBreak: boolean;
  active: boolean;
}

interface ExceptionItem {
  id: string;
  kind: 'holiday' | 'blocked' | 'extra_hours';
  date_from: string;
  date_to: string;
  reason?: string;
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const fallbackDays: DayConfig[] = [
  { weekday: 1, dayName: 'Monday', startTime: '10:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: true, active: true },
  { weekday: 2, dayName: 'Tuesday', startTime: '10:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: true, active: true },
  { weekday: 3, dayName: 'Wednesday', startTime: '10:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: true, active: true },
  { weekday: 4, dayName: 'Thursday', startTime: '10:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: true, active: true },
  { weekday: 5, dayName: 'Friday', startTime: '10:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: true, active: true },
  { weekday: 6, dayName: 'Saturday', startTime: '10:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: true, active: true },
  { weekday: 0, dayName: 'Sunday', startTime: '11:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', hasBreak: false, active: false },
];

function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let hour = parseInt(parts[0], 10);
  const min = parts[1] || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour.toString().padStart(2, '0')}:${min} ${ampm}`;
}

export default function AvailabilityAdminPage() {
  const [days, setDays] = useState<DayConfig[]>(fallbackDays);
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [savingDay, setSavingDay] = useState<number | null>(null);

  // Edit Day Modal State
  const [editingDay, setEditingDay] = useState<DayConfig | null>(null);

  // Add Exception Modal State
  const [isAddExceptionOpen, setIsAddExceptionOpen] = useState(false);
  const [newExcDateFrom, setNewExcDateFrom] = useState('');
  const [newExcDateTo, setNewExcDateTo] = useState('');
  const [newExcKind, setNewExcKind] = useState<'holiday' | 'blocked'>('holiday');
  const [newExcReason, setNewExcReason] = useState('');
  const [savingException, setSavingException] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/availability');
      const data = await res.json();

      if (data.rules && Array.isArray(data.rules) && data.rules.length > 0) {
        // Map DB rules into day configs (group by weekday)
        const dayMap = new Map<number, DayConfig>();
        // Initialize in order Mon -> Sun
        [1, 2, 3, 4, 5, 6, 0].forEach((w) => {
          dayMap.set(w, {
            weekday: w,
            dayName: WEEKDAY_NAMES[w],
            startTime: '10:00',
            endTime: '19:00',
            breakStart: '13:00',
            breakEnd: '14:00',
            hasBreak: true,
            active: w !== 0,
          });
        });

        data.rules.forEach((r: any) => {
          const existing = dayMap.get(r.weekday);
          if (existing) {
            if (r.kind === 'working') {
              existing.workingRuleId = r.id;
              existing.startTime = (r.start_time || '10:00:00').slice(0, 5);
              existing.endTime = (r.end_time || '19:00:00').slice(0, 5);
              existing.active = r.is_active;
            } else if (r.kind === 'break') {
              existing.breakRuleId = r.id;
              existing.breakStart = (r.start_time || '13:00:00').slice(0, 5);
              existing.breakEnd = (r.end_time || '14:00:00').slice(0, 5);
              existing.hasBreak = r.is_active;
            }
          }
        });

        // Convert map values preserving [1..6, 0] order
        const mappedList = [1, 2, 3, 4, 5, 6, 0].map((w) => dayMap.get(w)!);
        setDays(mappedList);
      }

      if (data.exceptions) {
        setExceptions(data.exceptions);
      }
      setIsLive(data.isLive ?? true);
    } catch (e) {
      console.error('Failed to load availability:', e);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  // 1. Toggle Day Active / Closed
  const toggleDay = async (dayConfig: DayConfig) => {
    const nextActive = !dayConfig.active;

    // Optimistic UI update
    setDays((prev) =>
      prev.map((d) => (d.weekday === dayConfig.weekday ? { ...d, active: nextActive } : d))
    );

    try {
      setSavingDay(dayConfig.weekday);
      await fetch('/api/admin/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dayConfig.workingRuleId,
          weekday: dayConfig.weekday,
          kind: 'working',
          is_active: nextActive,
          start_time: `${dayConfig.startTime}:00`,
          end_time: `${dayConfig.endTime}:00`,
        }),
      });
      showToast(`${dayConfig.dayName} status updated to ${nextActive ? 'Active' : 'Closed'}`);
    } catch (e) {
      console.error('Error toggling day:', e);
      // Rollback
      setDays((prev) =>
        prev.map((d) => (d.weekday === dayConfig.weekday ? { ...d, active: dayConfig.active } : d))
      );
      showToast('Failed to update weekday status.');
    } finally {
      setSavingDay(null);
    }
  };

  // 2. Save Day Schedule from Modal
  const saveDaySchedule = async () => {
    if (!editingDay) return;
    try {
      setSavingDay(editingDay.weekday);

      // Save working window
      await fetch('/api/admin/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDay.workingRuleId,
          weekday: editingDay.weekday,
          kind: 'working',
          is_active: editingDay.active,
          start_time: `${editingDay.startTime}:00`,
          end_time: `${editingDay.endTime}:00`,
        }),
      });

      // Save break window
      await fetch('/api/admin/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDay.breakRuleId,
          weekday: editingDay.weekday,
          kind: 'break',
          is_active: editingDay.hasBreak,
          start_time: `${editingDay.breakStart}:00`,
          end_time: `${editingDay.breakEnd}:00`,
        }),
      });

      // Update local state
      setDays((prev) =>
        prev.map((d) => (d.weekday === editingDay.weekday ? editingDay : d))
      );

      setEditingDay(null);
      showToast(`Updated consultation hours for ${editingDay.dayName}`);
    } catch (e) {
      console.error('Failed to save day schedule:', e);
      showToast('Error saving hours. Please try again.');
    } finally {
      setSavingDay(null);
    }
  };

  // 3. Add Blackout Date / Holiday
  const handleAddException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExcDateFrom) {
      showToast('Please select a start date.');
      return;
    }
    const toDate = newExcDateTo || newExcDateFrom;

    try {
      setSavingException(true);
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: newExcKind,
          date_from: newExcDateFrom,
          date_to: toDate,
          reason: newExcReason.trim() || 'Sacred Holiday / Blackout Window',
        }),
      });
      const data = await res.json();

      if (data.success && data.exception) {
        setExceptions((prev) => [...prev, data.exception]);
        setIsAddExceptionOpen(false);
        setNewExcDateFrom('');
        setNewExcDateTo('');
        setNewExcReason('');
        showToast('Sacred blackout date registered successfully.');
      } else {
        showToast(data.error || 'Failed to add blackout date.');
      }
    } catch (err: any) {
      showToast('Failed to connect to server.');
    } finally {
      setSavingException(false);
    }
  };

  // 4. Delete Blackout Date
  const handleDeleteException = async (id: string) => {
    if (!confirm('Remove this blackout date? Slots will open again for booking.')) return;
    try {
      const res = await fetch(`/api/admin/availability?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setExceptions((prev) => prev.filter((exc) => exc.id !== id));
        showToast('Blackout date removed.');
      } else {
        showToast(data.error || 'Failed to remove blackout date.');
      }
    } catch (err) {
      showToast('Error deleting blackout date.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#27304A] border border-[#D8B56D]/60 text-[#F6D186] text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#27304A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold mb-2">
            <span>VEDIC CALENDAR &amp; WORKING WINDOWS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
            Availability &amp; Slot Rules
          </h1>
          <p className="text-xs text-[#D0C5B4] mt-0.5">
            Configure consultation windows, midday breaks, and block sacred festival or eclipse dates.
          </p>
        </div>

        <button
          onClick={loadAvailability}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#27304A] hover:bg-[#344062] text-xs font-semibold text-[#F6D186] border border-[#D8B56D]/30 transition-all cursor-pointer w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#D8B56D]' : ''}`} />
          <span>Refresh Rules</span>
        </button>
      </div>

      {/* Rules Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#181F33] p-5 sm:p-6 rounded-2xl border border-[#27304A] shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#D0C5B4] uppercase font-semibold">Slot Interval</span>
            <Clock className="w-4 h-4 text-[#D8B56D]" />
          </div>
          <p className="text-2xl font-bold font-heading text-[#F6D186]">30 Minutes</p>
          <p className="text-[11px] text-[#D0C5B4]/70">Spacing between bookable slots</p>
        </div>

        <div className="bg-[#181F33] p-5 sm:p-6 rounded-2xl border border-[#27304A] shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#D0C5B4] uppercase font-semibold">Minimum Notice</span>
            <ShieldCheck className="w-4 h-4 text-[#D8B56D]" />
          </div>
          <p className="text-2xl font-bold font-heading text-[#F6D186]">12 Hours</p>
          <p className="text-[11px] text-[#D0C5B4]/70">Lead time before appointment start</p>
        </div>

        <div className="bg-[#181F33] p-5 sm:p-6 rounded-2xl border border-[#27304A] shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#D0C5B4] uppercase font-semibold">Advance Window</span>
            <CalendarDays className="w-4 h-4 text-[#D8B56D]" />
          </div>
          <p className="text-2xl font-bold font-heading text-[#F6D186]">30 Days</p>
          <p className="text-[11px] text-[#D0C5B4]/70">Maximum booking horizon</p>
        </div>
      </div>

      {/* Weekly Hours Table */}
      <div className="bg-[#181F33] rounded-2xl border border-[#27304A] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#27304A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
              Weekly Recurring Working Hours (IST)
            </h2>
            <p className="text-xs text-[#D0C5B4]/70">
              Seekers will only see available slots within these verified working windows.
            </p>
          </div>
          <span className="text-[11px] text-[#D8B56D] font-semibold flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
            {isLive ? 'Supabase Live Sync' : 'Default Preset'}
          </span>
        </div>

        <div className="divide-y divide-[#27304A]/60">
          {days.map((item) => (
            <div
              key={item.dayName}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm hover:bg-[#27304A]/30 transition-colors"
            >
              <div className="w-28 sm:w-36 font-bold text-[#DBE1FD] flex items-center gap-2">
                <span>{item.dayName}</span>
                {item.weekday === 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#27304A] text-[#D0C5B4]">Sun</span>
                )}
              </div>

              <div className="flex-1 text-[#D0C5B4]">
                {item.active ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#DBE1FD]">
                      {formatTime12h(item.startTime)} – {formatTime12h(item.endTime)}
                    </span>
                    {item.hasBreak && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-[#27304A]/70 text-[#D8B56D] border border-[#27304A]">
                        Midday Break: {formatTime12h(item.breakStart)} – {formatTime12h(item.breakEnd)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-[#D0C5B4]/50 italic">Closed (No bookable slots)</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.active && (
                  <button
                    onClick={() => setEditingDay({ ...item })}
                    className="px-3 py-1 rounded-lg bg-[#27304A] hover:bg-[#344062] text-[#F6D186] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Edit Hours
                  </button>
                )}

                <button
                  onClick={() => toggleDay(item)}
                  disabled={savingDay === item.weekday}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    savingDay === item.weekday ? 'opacity-50' : ''
                  } ${
                    item.active
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25'
                      : 'bg-[#27304A] text-[#D0C5B4]/60 hover:text-[#D0C5B4] border border-transparent'
                  }`}
                >
                  {item.active ? 'Active' : 'Closed'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sacred Holidays & Blackout Exceptions */}
      <div className="bg-[#181F33] rounded-2xl border border-[#27304A] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#27304A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
                Sacred Holidays &amp; Blackout Dates
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#D8B56D]/15 text-[#F6D186] font-semibold border border-[#D8B56D]/30">
                {exceptions.length} Active
              </span>
            </div>
            <p className="text-xs text-[#D0C5B4]/70 mt-0.5">
              Block bookings for eclipses (Grahan), sacred pilgrimages, festivals, or personal retreats.
            </p>
          </div>

          <button
            onClick={() => setIsAddExceptionOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Add Blackout Date</span>
          </button>
        </div>

        {exceptions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#D0C5B4]/60 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-[#D0C5B4]/40" />
            <p>No upcoming blackout dates configured.</p>
            <p className="text-[11px] text-[#D0C5B4]/40">
              Click &quot;Add Blackout Date&quot; above to block reservations for eclipses or festivals.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#27304A]/60">
            {exceptions.map((exc) => (
              <div
                key={exc.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#27304A]/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#DBE1FD] text-sm">
                      {exc.reason || 'Sacred Blackout'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
                      {exc.kind}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#D0C5B4]">
                    <Calendar className="w-3.5 h-3.5 text-[#D8B56D]" />
                    <span>
                      {exc.date_from === exc.date_to
                        ? exc.date_from
                        : `${exc.date_from} → ${exc.date_to}`}
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleDeleteException(exc.id)}
                    className="p-2 rounded-lg bg-red-600/15 text-red-400 hover:bg-red-600/30 transition-colors cursor-pointer"
                    title="Delete Exception"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Edit Day Hours */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D8B56D]" />
                <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                  Configure {editingDay.dayName} Hours
                </h3>
              </div>
              <button
                onClick={() => setEditingDay(null)}
                className="p-1 text-[#D0C5B4] hover:text-[#DBE1FD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Working Hours */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#DBE1FD] uppercase tracking-wider">
                  Consultation Window (24h format)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-[#D0C5B4] block mb-1">Start Time</span>
                    <input
                      type="time"
                      value={editingDay.startTime}
                      onChange={(e) =>
                        setEditingDay({ ...editingDay, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#141B2F] border border-[#27304A] text-[#DBE1FD] font-mono focus:border-[#D8B56D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#D0C5B4] block mb-1">End Time</span>
                    <input
                      type="time"
                      value={editingDay.endTime}
                      onChange={(e) =>
                        setEditingDay({ ...editingDay, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#141B2F] border border-[#27304A] text-[#DBE1FD] font-mono focus:border-[#D8B56D] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Midday Break */}
              <div className="space-y-2 pt-2 border-t border-[#27304A]/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#DBE1FD] uppercase tracking-wider">
                    Midday Puja / Sadhana Break
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDay.hasBreak}
                      onChange={(e) =>
                        setEditingDay({ ...editingDay, hasBreak: e.target.checked })
                      }
                      className="accent-[#D8B56D]"
                    />
                    <span className="text-xs text-[#D0C5B4]">Enable Break</span>
                  </label>
                </div>

                {editingDay.hasBreak && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] text-[#D0C5B4] block mb-1">Break Start</span>
                      <input
                        type="time"
                        value={editingDay.breakStart}
                        onChange={(e) =>
                          setEditingDay({ ...editingDay, breakStart: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#141B2F] border border-[#27304A] text-[#DBE1FD] font-mono focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#D0C5B4] block mb-1">Break End</span>
                      <input
                        type="time"
                        value={editingDay.breakEnd}
                        onChange={(e) =>
                          setEditingDay({ ...editingDay, breakEnd: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#141B2F] border border-[#27304A] text-[#DBE1FD] font-mono focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27304A]">
              <button
                type="button"
                onClick={() => setEditingDay(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#D0C5B4] hover:bg-[#27304A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDaySchedule}
                disabled={savingDay !== null}
                className="px-5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Working Hours</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Blackout Date */}
      {isAddExceptionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleAddException}
            className="bg-[#181F33] border border-[#27304A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-xs sm:text-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D8B56D]" />
                <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                  Add Sacred Blackout / Holiday
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExceptionOpen(false)}
                className="p-1 text-[#D0C5B4] hover:text-[#DBE1FD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] uppercase tracking-wider mb-1.5">
                  Reason / Sacred Occasion
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surya Grahan (Solar Eclipse), Maha Shivratri Sadhana, Sanctuary Retreat"
                  value={newExcReason}
                  onChange={(e) => setNewExcReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] placeholder-[#D0C5B4]/50 focus:border-[#D8B56D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#DBE1FD] uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExcDateFrom}
                    onChange={(e) => setNewExcDateFrom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#DBE1FD] uppercase tracking-wider mb-1.5">
                    End Date (Inclusive)
                  </label>
                  <input
                    type="date"
                    value={newExcDateTo}
                    placeholder="Same as start"
                    onChange={(e) => setNewExcDateTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] uppercase tracking-wider mb-1.5">
                  Classification
                </label>
                <select
                  value={newExcKind}
                  onChange={(e) => setNewExcKind(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#F6D186] font-semibold focus:border-[#D8B56D] focus:outline-none"
                >
                  <option value="holiday">Sacred Festival / Holiday (Full Day)</option>
                  <option value="blocked">Sanctuary Maintenance / Blackout</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27304A]">
              <button
                type="button"
                onClick={() => setIsAddExceptionOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#D0C5B4] hover:bg-[#27304A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingException}
                className="px-5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{savingException ? 'Registering...' : 'Add Blackout Date'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
