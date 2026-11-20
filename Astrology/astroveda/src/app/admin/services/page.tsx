'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, Edit3, Save, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  duration_minutes: number;
  buffer_minutes: number;
  price_inr: number;
  is_active: boolean;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Edit form state
  const [editPrice, setEditPrice] = useState(1000);
  const [editDuration, setEditDuration] = useState(60);
  const [editBuffer, setEditBuffer] = useState(15);
  const [editActive, setEditActive] = useState(true);

  const fetchLiveServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const json = await res.json();
        if (json.services) {
          const mapped: ServiceItem[] = json.services.map((s: any) => {
            const englishTranslation = s.service_translations?.find((t: any) => t.locale === 'en') || s.service_translations?.[0];
            return {
              id: s.id,
              slug: s.slug,
              title: englishTranslation?.title || s.slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              shortDescription: englishTranslation?.short_description || 'Authentic Vedic consultation guidance.',
              duration_minutes: s.duration_minutes || 60,
              buffer_minutes: s.buffer_minutes || 15,
              price_inr: Number(s.price_inr || 1000),
              is_active: s.is_active ?? true,
            };
          });
          setServices(mapped);
        }
      }
    } catch (e) {
      console.error('Failed to load services:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveServices();
  }, []);

  const openEditModal = (svc: ServiceItem) => {
    setEditingService(svc);
    setEditPrice(svc.price_inr);
    setEditDuration(svc.duration_minutes);
    setEditBuffer(svc.buffer_minutes);
    setEditActive(svc.is_active);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingService.id,
          price_inr: editPrice,
          duration_minutes: editDuration,
          buffer_minutes: editBuffer,
          is_active: editActive,
        }),
      });

      if (res.ok) {
        // Update local state
        setServices((prev) =>
          prev.map((s) =>
            s.id === editingService.id
              ? {
                  ...s,
                  price_inr: editPrice,
                  duration_minutes: editDuration,
                  buffer_minutes: editBuffer,
                  is_active: editActive,
                }
              : s
          )
        );
        setEditingService(null);
      }
    } catch (err) {
      console.error('Failed to save service updates:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceActive = async (svc: ServiceItem) => {
    const nextState = !svc.is_active;
    // Optimistic update
    setServices((prev) =>
      prev.map((s) => (s.id === svc.id ? { ...s, is_active: nextState } : s))
    );

    try {
      await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: svc.id,
          is_active: nextState,
        }),
      });
    } catch (e) {
      console.error('Failed to toggle status:', e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#27304A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold mb-2">
            <span>JYOTISH DISCIPLINE &amp; DAKSHINA CMS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
            Consultation Services &amp; Pricing
          </h1>
          <p className="text-xs text-[#D0C5B4] mt-0.5">
            Modify consultation Dakshina fees, duration, and buffer intervals directly in PostgreSQL database.
          </p>
        </div>

        <button
          onClick={fetchLiveServices}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#27304A] hover:bg-[#344062] text-xs font-semibold text-[#F6D186] border border-[#D8B56D]/30 transition-all cursor-pointer w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#D8B56D]' : ''}`} />
          <span>Refresh Services</span>
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-[#F6D186] gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xs">Loading live services from Supabase...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`bg-[#181F33] rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition-colors ${
                svc.is_active
                  ? 'border-[#27304A] hover:border-[#D8B56D]/50'
                  : 'border-red-900/30 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B56D] bg-[#27304A] px-2.5 py-0.5 rounded-full border border-[#D8B56D]/20">
                    {svc.slug}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleServiceActive(svc)}
                    className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                      svc.is_active
                        ? 'text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                        : 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                    }`}
                  >
                    {svc.is_active ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#DBE1FD] mb-1.5">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#D0C5B4] line-clamp-2 leading-relaxed mb-4 font-body">
                  {svc.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-[#27304A] flex items-center justify-between text-xs">
                <div>
                  <span className="flex items-center gap-1 text-[#D0C5B4]">
                    <Clock className="h-3.5 w-3.5 text-[#D8B56D]" /> {svc.duration_minutes}m (+{svc.buffer_minutes}m buffer)
                  </span>
                  <span className="text-lg font-bold font-heading text-[#F6D186] block mt-0.5">
                    ₹{svc.price_inr.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openEditModal(svc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27304A] hover:bg-[#D8B56D] text-[#F6D186] hover:text-[#10172B] font-semibold text-xs border border-[#D8B56D]/30 transition-all cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Fee</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Service Modal */}
      <Modal
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        title={`Edit Service: ${editingService?.title}`}
      >
        <form onSubmit={handleSaveService} className="space-y-4 text-xs text-[#10172B]">
          <p className="text-xs text-[#10172B]/70 font-body">
            Update the consultation Dakshina fee, session duration, and buffer interval. Changes apply immediately to all new bookings.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold mb-1">Dakshina Fee (₹ INR)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/40 text-xs font-bold text-[#10172B] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="15"
                step="15"
                value={editDuration}
                onChange={(e) => setEditDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/40 text-xs font-bold text-[#10172B] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Buffer Spacing (Mins)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={editBuffer}
                onChange={(e) => setEditBuffer(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/40 text-xs font-bold text-[#10172B] focus:outline-none focus:border-[#D8B56D]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Public Availability</label>
              <select
                value={editActive ? 'active' : 'disabled'}
                onChange={(e) => setEditActive(e.target.value === 'active')}
                className="w-full px-3 py-2 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/40 text-xs font-bold text-[#10172B] focus:outline-none focus:border-[#D8B56D]"
              >
                <option value="active">Active (Bookable)</option>
                <option value="disabled">Disabled (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#10172B]/10">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setEditingService(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={saving}
              className="bg-[#D62839] hover:bg-[#B81F2F] text-white font-bold"
            >
              {saving ? 'Saving to Database...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
