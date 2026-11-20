'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  User,
  ShieldCheck,
  Check,
  Loader2,
  RefreshCw,
  X,
  ExternalLink,
  Send,
  Sparkles,
  Download,
  Scroll,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { adminQuickMessages } from '@/lib/notifications/notificationService';
import { siteConfig } from '@/config/site';
import { downloadCsvFile } from '@/lib/export/csvExport';

interface AppointmentRecord {
  id: string;
  reference: string;
  dateTime: string;
  clientName: string;
  phone: string;
  service: string;
  mode: 'Video' | 'Phone' | 'In-Person';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  dakshina: number;
  dakshinaStatus: 'Paid' | 'Unpaid (Offline)';
  isLive?: boolean;
}

const fallbackAppointments: AppointmentRecord[] = [
  {
    id: 'apt-demo-1',
    reference: 'AST-82F9A1',
    dateTime: 'Today, 10:00 AM IST',
    clientName: 'Rahul Sharma',
    phone: '+91 98201 12345',
    service: 'General Kundali Consultation',
    mode: 'Video',
    status: 'Confirmed',
    dakshina: 1000,
    dakshinaStatus: 'Paid',
    isLive: false,
  },
  {
    id: 'apt-demo-2',
    reference: 'AST-94B2C3',
    dateTime: 'Today, 11:30 AM IST',
    clientName: 'Priya Mukherjee',
    phone: '+91 98192 34567',
    service: 'Career Guidance Reading',
    mode: 'Phone',
    status: 'Pending',
    dakshina: 1000,
    dakshinaStatus: 'Unpaid (Offline)',
    isLive: false,
  },
  {
    id: 'apt-demo-3',
    reference: 'AST-11E7D4',
    dateTime: 'Tomorrow, 03:00 PM IST',
    clientName: 'Amit Kulkarni',
    phone: '+91 94220 56789',
    service: 'Marriage & Kundali Milan',
    mode: 'Video',
    status: 'Confirmed',
    dakshina: 1000,
    dakshinaStatus: 'Paid',
    isLive: false,
  },
  {
    id: 'apt-demo-4',
    reference: 'AST-55G8H2',
    dateTime: '16 Jan 2025, 10:00 AM IST',
    clientName: 'Sneha Patil',
    phone: '+91 98230 78901',
    service: 'Vastu Shastra Consultation',
    mode: 'In-Person',
    status: 'Pending',
    dakshina: 1500,
    dakshinaStatus: 'Unpaid (Offline)',
    isLive: false,
  },
];

export default function AppointmentsAdminPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(fallbackAppointments);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Quick WhatsApp Modal State
  const [activeWhatsAppApt, setActiveWhatsAppApt] = useState<AppointmentRecord | null>(null);
  const [meetLinkInput, setMeetLinkInput] = useState('https://meet.google.com/new');

  const fetchLiveAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/appointments');
      if (res.ok) {
        const json = await res.json();
        if (json.appointments && json.appointments.length > 0) {
          const mapped: AppointmentRecord[] = json.appointments.map((a: any) => {
            const d = new Date(a.starts_at);
            const dateStr = d.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Kolkata',
            });
            const timeStr = d.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Asia/Kolkata',
            });

            const mode: 'Video' | 'Phone' | 'In-Person' =
              a.consultation_mode === 'in_person'
                ? 'In-Person'
                : a.consultation_mode === 'phone'
                ? 'Phone'
                : 'Video';

            const statusMap: Record<string, AppointmentRecord['status']> = {
              pending: 'Pending',
              confirmed: 'Confirmed',
              completed: 'Completed',
              cancelled: 'Cancelled',
            };

            const serviceTitle =
              a.services?.service_translations?.[0]?.title ||
              a.services?.slug
                ?.split('-')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ') ||
              'Astrology Consultation';

            return {
              id: a.id,
              reference: a.reference,
              dateTime: `${dateStr}, ${timeStr} IST`,
              clientName: a.customer_name || a.customers?.full_name || 'Valued Seeker',
              phone: a.customers?.phone_e164 || '+91 98000 00000',
              service: serviceTitle,
              mode,
              status: statusMap[a.status] || 'Pending',
              dakshina: Number(a.price_inr_snapshot || a.services?.price_inr || 1000),
              dakshinaStatus: a.payment_status === 'paid' ? 'Paid' : 'Unpaid (Offline)',
              isLive: true,
            };
          });

          setAppointments(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to load live appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAppointments();
  }, []);

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, newStatus: AppointmentRecord['status']) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return;

    // Optimistic update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    if (apt.isLive) {
      try {
        setIsUpdating(id);
        const serverStatusMap: Record<AppointmentRecord['status'], string> = {
          Pending: 'pending',
          Confirmed: 'confirmed',
          Completed: 'completed',
          Cancelled: 'cancelled',
        };

        await fetch('/api/admin/appointments', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            status: serverStatusMap[newStatus],
          }),
        });
      } catch (e) {
        console.error('Failed to update status on server:', e);
      } finally {
        setIsUpdating(null);
      }
    }
  };

  const toggleDakshina = async (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return;

    const nextPaymentStatus = apt.dakshinaStatus === 'Paid' ? 'unpaid' : 'paid';
    const nextUiStatus: 'Paid' | 'Unpaid (Offline)' =
      nextPaymentStatus === 'paid' ? 'Paid' : 'Unpaid (Offline)';

    // Optimistic update
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              dakshinaStatus: nextUiStatus,
              status: nextPaymentStatus === 'paid' ? 'Completed' : a.status,
            }
          : a
      )
    );

    if (apt.isLive) {
      try {
        setIsUpdating(id);
        await fetch('/api/admin/appointments', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            payment_status: nextPaymentStatus,
            payment_amount_inr: apt.dakshina,
            payment_method: 'upi_direct',
          }),
        });
      } catch (e) {
        console.error('Failed to toggle dakshina status on server:', e);
      } finally {
        setIsUpdating(null);
      }
    }
  };

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  const exportAppointmentsCsv = () => {
    const headers = [
      'Reference Token',
      'Date & Time (IST)',
      'Seeker Name',
      'Mobile Number',
      'Service Title',
      'Mode',
      'Booking Status',
      'Dakshina (INR)',
      'Dakshina Payment Status',
    ];

    const rows = filtered.map((apt) => [
      apt.reference,
      apt.dateTime,
      apt.clientName,
      apt.phone,
      apt.service,
      apt.mode,
      apt.status,
      apt.dakshina,
      apt.dakshinaStatus,
    ]);

    downloadCsvFile('myguruji_appointments_export', headers, rows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#27304A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold mb-2">
            <span>DAIVAJNA CONSULTATION REGISTRY</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
            Appointment Management
          </h1>
          <p className="text-xs text-[#D0C5B4] mt-0.5">
            Manage upcoming consultations, trigger 1-click WhatsApp templates, and record offline Dakshina settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAppointmentsCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141B2F] hover:bg-[#27304A] text-xs font-semibold text-[#DBE1FD] border border-[#27304A] transition-all cursor-pointer"
            title="Download CSV for Excel / Google Sheets"
          >
            <Download className="h-3.5 w-3.5 text-[#D8B56D]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchLiveAppointments}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#27304A] hover:bg-[#344062] text-xs font-semibold text-[#F6D186] border border-[#D8B56D]/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#D8B56D]' : ''}`} />
            <span>Refresh Live</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#181F33] rounded-2xl p-4 sm:p-5 border border-[#27304A] shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D0C5B4]/60" />
          <input
            type="text"
            placeholder="Search by Seeker Name, Mobile (+91), or AST- reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] placeholder-[#D0C5B4]/50 focus:outline-none focus:border-[#D8B56D]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#27304A] text-xs font-semibold text-[#F6D186] bg-[#141B2F] focus:outline-none focus:border-[#D8B56D]"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="pending">Pending Approval</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Registry Table */}
      <div className="bg-[#181F33] rounded-2xl border border-[#27304A] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#27304A] flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
            Consultation Appointments ({filtered.length})
          </h2>
          <span className="text-[11px] text-[#D8B56D] font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Supabase Live Sync
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#141B2F] text-[#D0C5B4] uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Ref &amp; Date</th>
                <th className="py-3 px-4">Seeker</th>
                <th className="py-3 px-4">Service &amp; Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dakshina Fee</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27304A]/60">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#27304A]/30 transition-colors">
                  {/* Reference & Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] text-[#D8B56D] font-bold block">
                      {apt.reference}
                    </span>
                    <span className="text-xs text-[#DBE1FD] flex items-center gap-1.5 mt-0.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#D8B56D]" /> {apt.dateTime}
                    </span>
                  </td>

                  {/* Seeker */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#DBE1FD] block">
                      {apt.clientName}
                    </span>
                    <span className="text-[11px] text-[#D0C5B4]">
                      {apt.phone}
                    </span>
                  </td>

                  {/* Service & Mode */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-[#27304A]/80 text-[11px] text-[#DBE1FD] font-medium border border-[#27304A] block w-fit">
                      {apt.service}
                    </span>
                    <span className="text-[10px] text-[#D0C5B4] flex items-center gap-1 mt-1">
                      {apt.mode === 'Video' ? <Video className="w-3 h-3 text-[#D8B56D]" /> : <Phone className="w-3 h-3 text-[#D8B56D]" />}
                      {apt.mode} Consultation
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {apt.status === 'Confirmed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[11px] font-bold border border-green-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Confirmed
                      </span>
                    )}
                    {apt.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Pending Approval
                      </span>
                    )}
                    {apt.status === 'Completed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[11px] font-bold border border-blue-500/30">
                        Completed
                      </span>
                    )}
                    {apt.status === 'Cancelled' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[11px] font-bold border border-red-500/30">
                        Cancelled
                      </span>
                    )}
                  </td>

                  {/* Dakshina */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#F6D186] block">
                      ₹{apt.dakshina.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => toggleDakshina(apt.id)}
                      disabled={isUpdating === apt.id}
                      className={`text-[10px] cursor-pointer mt-0.5 font-semibold transition-opacity ${
                        isUpdating === apt.id ? 'opacity-50' : ''
                      } ${
                        apt.dakshinaStatus === 'Paid'
                          ? 'text-green-400 hover:underline'
                          : 'text-[#ffb3b1] hover:underline'
                      }`}
                    >
                      {apt.dakshinaStatus}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'Confirmed')}
                          disabled={isUpdating === apt.id}
                          className="px-2.5 py-1 rounded-lg bg-[#D8B56D] text-[#10172B] font-bold hover:bg-[#F6D186] transition-colors text-[11px] cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'Completed')}
                          disabled={isUpdating === apt.id}
                          className="px-2.5 py-1 rounded-lg bg-green-600/30 border border-green-500/40 text-green-300 font-bold hover:bg-green-600/50 transition-colors text-[11px] cursor-pointer"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'Cancelled')}
                          disabled={isUpdating === apt.id}
                          className="px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300 font-bold hover:bg-red-600/40 transition-colors text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Quick WhatsApp Action Launcher */}
                      <button
                        onClick={() => setActiveWhatsAppApt(apt)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-[11px] font-semibold transition-colors cursor-pointer"
                        title="WhatsApp Dispatcher"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      {/* Remedy Dossier – shown for Completed consultations */}
                      {apt.status === 'Completed' && (
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/appointments/remedy?ref=${encodeURIComponent(apt.reference)}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D8B56D]/15 hover:bg-[#D8B56D]/25 border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Create Remedy Dossier"
                        >
                          <Scroll className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Dossier</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WHATSAPP ACTION MODAL */}
      {activeWhatsAppApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 text-xs sm:text-sm">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#25D366]/15 text-[#25D366]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                    WhatsApp Message Dispatcher
                  </h3>
                  <p className="text-[11px] text-[#D0C5B4]/70">
                    Recipient: <strong className="text-[#DBE1FD]">{activeWhatsAppApt.clientName}</strong> ({activeWhatsAppApt.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveWhatsAppApt(null)}
                className="p-1 text-[#D0C5B4] hover:text-[#DBE1FD] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Actions Grid */}
            <div className="space-y-3.5">
              {/* Option 1: Send Video Call Link */}
              <div className="bg-[#141B2F] p-4 rounded-xl border border-[#27304A] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#DBE1FD] flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#D8B56D]" />
                    <span>Send Video Meeting Link</span>
                  </span>
                  <span className="text-[10px] text-[#D8B56D] font-mono">Google Meet</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={meetLinkInput}
                    onChange={(e) => setMeetLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#181F33] border border-[#27304A] text-xs text-[#DBE1FD] font-mono focus:border-[#D8B56D] focus:outline-none"
                  />
                  <a
                    href={`https://wa.me/${cleanPhone(activeWhatsAppApt.phone)}?text=${adminQuickMessages.sendMeetingLink(
                      activeWhatsAppApt.clientName,
                      activeWhatsAppApt.service,
                      meetLinkInput
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-[#10172B] font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Coordinates</span>
                  </a>
                </div>
              </div>

              {/* Option 2: Send Session Reminder */}
              <div className="bg-[#141B2F] p-4 rounded-xl border border-[#27304A] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#DBE1FD] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D8B56D]" />
                    <span>Consultation Reminder</span>
                  </span>
                  <p className="text-[11px] text-[#D0C5B4]/70">
                    Reminds seeker of today&apos;s slot ({activeWhatsAppApt.dateTime}) &amp; having birth chart handy.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${cleanPhone(activeWhatsAppApt.phone)}?text=${adminQuickMessages.sendReminder(
                    activeWhatsAppApt.clientName,
                    activeWhatsAppApt.dateTime
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-[#10172B] font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reminder</span>
                </a>
              </div>

              {/* Option 3: Request Dakshina */}
              <div className="bg-[#141B2F] p-4 rounded-xl border border-[#27304A] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#DBE1FD] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D8B56D]" />
                    <span>Dakshina Settlement Request</span>
                  </span>
                  <p className="text-[11px] text-[#D0C5B4]/70">
                    Sends post-session gratitude note with ₹{activeWhatsAppApt.dakshina} Dakshina UPI details.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${cleanPhone(activeWhatsAppApt.phone)}?text=${adminQuickMessages.requestDakshina(
                    activeWhatsAppApt.clientName,
                    activeWhatsAppApt.dakshina,
                    activeWhatsAppApt.reference
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-[#10172B] font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Dakshina</span>
                </a>
              </div>

              {/* Option 4: Direct Clean WhatsApp Chat */}
              <div className="bg-[#141B2F]/60 p-3.5 rounded-xl border border-[#27304A]/60 flex items-center justify-between">
                <span className="text-xs text-[#D0C5B4]">Need to chat freely without templates?</span>
                <a
                  href={`https://wa.me/${cleanPhone(activeWhatsAppApt.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#27304A] hover:bg-[#344062] text-[#DBE1FD] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3 text-[#D8B56D]" />
                  <span>Open Direct Chat</span>
                </a>
              </div>

              {/* Option 5: Create Remedy Dossier */}
              {activeWhatsAppApt.status === 'Completed' && (
                <div className="bg-[#D8B56D]/10 p-3.5 rounded-xl border border-[#D8B56D]/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#F6D186] flex items-center gap-1.5">
                      <Scroll className="w-4 h-4 text-[#D8B56D]" />
                      <span>Create Remedy Dossier</span>
                    </span>
                    <p className="text-[11px] text-[#D0C5B4]/70">
                      Build a personalized Jyotish remedy dossier with Mantra, Daan, Gemstone & Muhurtas — then send via WhatsApp or print as PDF.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveWhatsAppApt(null);
                      router.push(
                        `/admin/appointments/remedy?ref=${encodeURIComponent(activeWhatsAppApt.reference)}`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors whitespace-nowrap cursor-pointer ml-4"
                  >
                    <Scroll className="w-3.5 h-3.5" />
                    <span>Open Editor</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#27304A] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveWhatsAppApt(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#D0C5B4] hover:bg-[#27304A] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
