'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Scroll,
  Save,
  Printer,
  ArrowLeft,
  MessageCircle,
  Star,
  Flame,
  Gem,
  Calendar,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface RemedyDossierForm {
  reference: string;
  seekerName: string;
  phone: string;
  service: string;
  consultationDate: string;

  primaryPlanet: string;
  primaryDasha: string;
  ascendant: string;
  moonSign: string;

  mantra: string;
  mantraCount: string;
  mantraDays: string;

  fastingDay: string;
  fastingGuidance: string;
  daan: string;
  daanDay: string;

  gemstone: string;
  gemstoneFingers: string;
  gemstoneDay: string;
  rudrakshaBeads: string;

  muhurtas: string;
  gurujiMessage: string;
  shastraQuote: string;
  shastraQuoteSource: string;
}

const emptyForm = (): RemedyDossierForm => ({
  reference: '',
  seekerName: '',
  phone: '',
  service: '',
  consultationDate: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
  primaryPlanet: '',
  primaryDasha: '',
  ascendant: '',
  moonSign: '',
  mantra: '',
  mantraCount: '108 times daily',
  mantraDays: '',
  fastingDay: '',
  fastingGuidance: '',
  daan: '',
  daanDay: '',
  gemstone: '',
  gemstoneFingers: 'Ring finger, right hand',
  gemstoneDay: '',
  rudrakshaBeads: '',
  muhurtas: '',
  gurujiMessage: '',
  shastraQuote: '',
  shastraQuoteSource: '',
});

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  hint?: string;
}

function InputField({ label, value, onChange, placeholder, hint }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold uppercase tracking-widest text-[#D8B56D]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] placeholder-[#D0C5B4]/40 focus:border-[#D8B56D] focus:outline-none transition-colors"
      />
      {hint && <p className="text-[10px] text-[#D0C5B4]/60">{hint}</p>}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: TextareaFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold uppercase tracking-widest text-[#D8B56D]">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] placeholder-[#D0C5B4]/40 focus:border-[#D8B56D] focus:outline-none transition-colors resize-none"
      />
    </div>
  );
}

function RemedyDossierInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref') || '';

  const [form, setForm] = useState<RemedyDossierForm>(() => {
    const f = emptyForm();
    f.reference = reference;
    return f;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isPrintReady, setIsPrintReady] = useState(false);

  // Fetch existing dossier if any
  useEffect(() => {
    if (!reference) return;
    fetch(`/api/admin/remedy?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.dossier) {
          setForm((prev) => ({ ...prev, ...data.dossier }));
        }
      })
      .catch(() => {});
  }, [reference]);

  const set = (key: keyof RemedyDossierForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/admin/remedy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaveStatus('saved');
        setIsPrintReady(true);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppDossierUrl = () => {
    const lines = [
      `🙏 *Namaste ${form.seekerName}*,`,
      ``,
      `Here is your sacred *Jyotish Remedy Dossier* from your ${form.service} consultation with *${siteConfig.astrologer.name}*.`,
      `📜 *Reference*: ${form.reference}`,
      ``,
      form.primaryDasha ? `🪐 *Dasha*: ${form.primaryDasha}` : '',
      form.ascendant ? `♈ *Lagna (Ascendant)*: ${form.ascendant}` : '',
      form.moonSign ? `🌙 *Moon Sign*: ${form.moonSign}` : '',
      ``,
      form.mantra ? `🕉️ *Mantra Sadhana*: ${form.mantra} — ${form.mantraCount}${form.mantraDays ? ` on ${form.mantraDays}` : ''}` : '',
      form.fastingDay ? `🌿 *Vrat (Fasting)*: ${form.fastingDay}${form.fastingGuidance ? ` — ${form.fastingGuidance}` : ''}` : '',
      form.daan ? `🪔 *Daan*: ${form.daan}${form.daanDay ? ` on ${form.daanDay}` : ''}` : '',
      form.gemstone ? `💎 *Gemstone*: ${form.gemstone}${form.gemstoneFingers ? ` — ${form.gemstoneFingers}${form.gemstoneDay ? `, ${form.gemstoneDay}` : ''}` : ''}` : '',
      form.rudrakshaBeads ? `📿 *Rudraksha*: ${form.rudrakshaBeads}` : '',
      form.muhurtas ? `📅 *Auspicious Muhurtas*:\n${form.muhurtas}` : '',
      ``,
      form.gurujiMessage ? `✨ *Guruji's Blessings*:\n${form.gurujiMessage}` : '',
      form.shastraQuote ? `📖 _"${form.shastraQuote}"_${form.shastraQuoteSource ? `\n— ${form.shastraQuoteSource}` : ''}` : '',
      ``,
      `With divine blessings,`,
      `*${siteConfig.astrologer.name}*`,
      `${siteConfig.name}`,
    ]
      .filter((l) => l !== undefined && l !== null)
      .join('\n');

    const targetPhone = (form.phone || '').replace(/[^0-9]/g, '');
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(lines)}`;
  };

  return (
    <>
      {/* ======== PRINT STYLES ======== */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-container {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .print-dossier {
            background: #fff !important;
            color: #1a1a1a !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
        .print-only { display: none; }
      `}</style>

      <div className="min-h-screen bg-[#10172B] text-[#F7F3EA] pb-16">
        {/* ======== ADMIN EDITOR (screen only) ======== */}
        <div className="no-print max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#27304A]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-[#27304A] text-[#D0C5B4] hover:text-[#F6D186] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[10px] font-bold tracking-wider mb-1">
                  <Scroll className="w-3 h-3" />
                  <span>JYOTISH REMEDY DOSSIER</span>
                </div>
                <h1 className="font-heading text-2xl font-bold text-[#F6D186]">
                  Create Remedy Dossier
                </h1>
                {form.seekerName && (
                  <p className="text-xs text-[#D0C5B4] mt-0.5">
                    for <strong className="text-[#DBE1FD]">{form.seekerName}</strong> • {form.reference}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-all cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Dossier</span>
              </button>

              {isPrintReady && (
                <>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181F33] hover:bg-[#27304A] border border-[#27304A] text-[#DBE1FD] font-bold text-xs transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D8B56D]" />
                    <span>Print / Save PDF</span>
                  </button>
                  <a
                    href={getWhatsAppDossierUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-xs transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Save Status */}
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Dossier saved successfully. You can now print or send via WhatsApp.
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" /> Could not save. Please try again.
            </div>
          )}

          {/* === SECTION: Seeker & Consultation Details === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D8B56D]" /> Seeker & Consultation Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Reference Token" value={form.reference} onChange={set('reference')} placeholder="AST-XXXXXX" />
              <InputField label="Seeker Name" value={form.seekerName} onChange={set('seekerName')} placeholder="Seeker's full name" />
              <InputField label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="+91 98000 00000" />
              <InputField label="Service / Consultation Type" value={form.service} onChange={set('service')} placeholder="General Kundali Consultation" />
              <InputField label="Consultation Date" value={form.consultationDate} onChange={set('consultationDate')} placeholder="18 Nov 2026" />
            </div>
          </div>

          {/* === SECTION: Jyotish Analysis === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D8B56D]" /> Jyotish Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Primary Planet (Karaka)" value={form.primaryPlanet} onChange={set('primaryPlanet')} placeholder="e.g. Shani (Saturn)" />
              <InputField label="Current Dasha / Antardasha" value={form.primaryDasha} onChange={set('primaryDasha')} placeholder="e.g. Shani Mahadasha – Guru Antardasha" />
              <InputField label="Lagna (Ascendant)" value={form.ascendant} onChange={set('ascendant')} placeholder="e.g. Vrishabha (Taurus)" />
              <InputField label="Moon Sign (Rashi)" value={form.moonSign} onChange={set('moonSign')} placeholder="e.g. Karka (Cancer)" />
            </div>
          </div>

          {/* === SECTION: Mantra Sadhana === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#D8B56D]" /> Mantra Sadhana (Chanting Practice)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Prescribed Mantra" value={form.mantra} onChange={set('mantra')} placeholder="e.g. Om Namah Shivaya / Maha Mrityunjaya" />
              <InputField label="Daily Japa Count" value={form.mantraCount} onChange={set('mantraCount')} placeholder="e.g. 108 times daily" />
              <InputField
                label="Recommended Days"
                value={form.mantraDays}
                onChange={set('mantraDays')}
                placeholder="e.g. Monday & Saturday"
                hint="Leave blank for daily practice"
              />
            </div>
          </div>

          {/* === SECTION: Vrat & Daan === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D8B56D]" /> Vrat (Fasting) & Daan (Charitable Giving)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Fasting Day" value={form.fastingDay} onChange={set('fastingDay')} placeholder="e.g. Every Saturday / Pradosh Vrat" />
              <InputField label="Fasting Guidance" value={form.fastingGuidance} onChange={set('fastingGuidance')} placeholder="e.g. Consume only fruits and milk" />
              <InputField label="Daan (Donation)" value={form.daan} onChange={set('daan')} placeholder="e.g. Black sesame and mustard oil to Shani temple" />
              <InputField label="Daan Day" value={form.daanDay} onChange={set('daanDay')} placeholder="e.g. Saturday before sunset" />
            </div>
          </div>

          {/* === SECTION: Gemstone & Rudraksha === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#D8B56D]" /> Gemstone & Rudraksha Guidance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Recommended Gemstone" value={form.gemstone} onChange={set('gemstone')} placeholder="e.g. Blue Sapphire (Neelam)" />
              <InputField label="Wearing Finger & Hand" value={form.gemstoneFingers} onChange={set('gemstoneFingers')} placeholder="e.g. Middle finger, right hand" />
              <InputField label="Auspicious Wearing Day" value={form.gemstoneDay} onChange={set('gemstoneDay')} placeholder="e.g. Saturday morning after bath" />
              <InputField label="Rudraksha Beads" value={form.rudrakshaBeads} onChange={set('rudrakshaBeads')} placeholder="e.g. 14 Mukhi Rudraksha" />
            </div>
          </div>

          {/* === SECTION: Upcoming Muhurtas === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D8B56D]" /> Auspicious Muhurtas (Upcoming Favorable Dates)
            </h2>
            <TextareaField
              label="Upcoming Muhurtas"
              value={form.muhurtas}
              onChange={set('muhurtas')}
              rows={4}
              placeholder={'e.g.\n• 25 Nov 2026 – Auspicious for new ventures (Shubha Muhurta)\n• 7 Dec 2026 – Pradosh Vrat, favorable for Shiva worship\n• 14 Dec 2026 – Auspicious for travel (Chandra in Rohini)'}
            />
          </div>

          {/* === SECTION: Guruji's Blessings === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D8B56D]" /> Guruji's Personal Message & Blessings
            </h2>
            <TextareaField
              label="Guruji's Blessings & Personal Message"
              value={form.gurujiMessage}
              onChange={set('gurujiMessage')}
              rows={5}
              placeholder="Enter Guruji's personal message, closing blessings, or specific personalized guidance for this seeker..."
            />
          </div>

          {/* === SECTION: Shastra Vachana === */}
          <div className="bg-[#181F33] border border-[#27304A] rounded-2xl p-5 space-y-4">
            <h2 className="font-heading text-base font-bold text-[#F6D186] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D8B56D]" /> Shastra Vachana (Sanskrit / Scripture Quote)
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <TextareaField
                label="Sanskrit / Scripture Quote"
                value={form.shastraQuote}
                onChange={set('shastraQuote')}
                rows={2}
                placeholder="e.g. ॥ सर्वे भवन्तु सुखिनः। सर्वे सन्तु निरामयाः॥"
              />
              <InputField label="Source" value={form.shastraQuoteSource} onChange={set('shastraQuoteSource')} placeholder="e.g. Brihat Parashara Hora Shastra, Ch.4 / Bhagavad Gita 18.66" />
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex justify-end gap-3 pt-2 border-t border-[#27304A]">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-sm transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving…' : 'Save Dossier'}</span>
            </button>
          </div>
        </div>

        {/* ======== PRINT-ONLY BRANDED DOSSIER ======== */}
        <div className="print-only print-container p-8">
          <div className="print-dossier max-w-[800px] mx-auto font-serif text-[#1a1a1a]" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #D8B56D', paddingBottom: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#B8860B', textTransform: 'uppercase', marginBottom: '6px' }}>
                ॐ — JYOTISH VIDYA — ॐ
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#10172B', margin: '0 0 4px 0', letterSpacing: '1px' }}>
                {siteConfig.name}
              </h1>
              <div style={{ fontSize: '12px', color: '#5a4a2f', marginBottom: '6px' }}>
                {siteConfig.astrologer.title} · {siteConfig.astrologer.lineage}
              </div>
              <div style={{ fontSize: '11px', color: '#7a6a4a' }}>
                {siteConfig.contact.address.fullText} · {siteConfig.contact.phone}
              </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', letterSpacing: '3px', color: '#B8860B', fontWeight: 'bold', textTransform: 'uppercase' }}>
                ✦ Sattvic Remedy Dossier ✦
              </h2>
              <p style={{ fontSize: '12px', color: '#5a4a2f', marginTop: '4px' }}>
                Prepared with Vedic precision by {siteConfig.astrologer.name}
              </p>
            </div>

            {/* Seeker Info Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '12px' }}>
              <tbody>
                {[
                  ['Seeker Name', form.seekerName],
                  ['Reference Token', form.reference],
                  ['Service', form.service],
                  ['Consultation Date', form.consultationDate],
                  form.ascendant ? ['Lagna (Ascendant)', form.ascendant] : null,
                  form.moonSign ? ['Moon Sign (Rashi)', form.moonSign] : null,
                  form.primaryDasha ? ['Active Dasha / Antardasha', form.primaryDasha] : null,
                  form.primaryPlanet ? ['Primary Karaka Planet', form.primaryPlanet] : null,
                ]
                  .filter((x): x is string[] => x !== null)
                  .map(([label, value], i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#faf7f0' : '#fff' }}>
                      <td style={{ padding: '6px 10px', fontWeight: 'bold', color: '#5a4a2f', width: '40%', border: '1px solid #e8d8b0' }}>
                        {label}
                      </td>
                      <td style={{ padding: '6px 10px', color: '#1a1a1a', border: '1px solid #e8d8b0' }}>{value as string}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Remedy Sections */}
            {[
              {
                title: '🕉️ Mantra Sadhana',
                show: !!form.mantra,
                rows: [
                  ['Prescribed Mantra', form.mantra],
                  ['Daily Japa Count', form.mantraCount],
                  form.mantraDays ? ['Recommended Days', form.mantraDays] : null,
                ],
              },
              {
                title: '🌿 Vrat (Fasting) & Daan',
                show: !!(form.fastingDay || form.daan),
                rows: [
                  form.fastingDay ? ['Fasting Day', form.fastingDay] : null,
                  form.fastingGuidance ? ['Fasting Guidance', form.fastingGuidance] : null,
                  form.daan ? ['Daan (Donation)', form.daan] : null,
                  form.daanDay ? ['Daan Day', form.daanDay] : null,
                ],
              },
              {
                title: '💎 Gemstone & Rudraksha',
                show: !!(form.gemstone || form.rudrakshaBeads),
                rows: [
                  form.gemstone ? ['Recommended Gemstone', form.gemstone] : null,
                  form.gemstoneFingers ? ['Wearing Finger', form.gemstoneFingers] : null,
                  form.gemstoneDay ? ['Auspicious Wearing Day', form.gemstoneDay] : null,
                  form.rudrakshaBeads ? ['Rudraksha', form.rudrakshaBeads] : null,
                ],
              },
            ]
              .filter((s) => s.show)
              .map((section, si) => (
                <div key={si} style={{ marginBottom: '20px' }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#10172B',
                      borderBottom: '1px solid #D8B56D',
                      paddingBottom: '4px',
                      marginBottom: '10px',
                    }}
                  >
                    {section.title}
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <tbody>
                      {section.rows
                        .filter(Boolean)
                        .map((row, ri) => (
                          <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? '#faf7f0' : '#fff' }}>
                            <td style={{ padding: '6px 10px', fontWeight: 'bold', color: '#5a4a2f', width: '40%', border: '1px solid #e8d8b0' }}>
                              {(row as string[])[0]}
                            </td>
                            <td style={{ padding: '6px 10px', color: '#1a1a1a', border: '1px solid #e8d8b0' }}>{(row as string[])[1]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ))}

            {/* Muhurtas */}
            {form.muhurtas && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#10172B', borderBottom: '1px solid #D8B56D', paddingBottom: '4px', marginBottom: '10px' }}>
                  📅 Auspicious Muhurtas
                </h3>
                <div style={{ backgroundColor: '#faf7f0', padding: '12px', borderRadius: '6px', fontSize: '12px', border: '1px solid #e8d8b0', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {form.muhurtas}
                </div>
              </div>
            )}

            {/* Guruji's Message */}
            {form.gurujiMessage && (
              <div style={{ marginBottom: '20px', backgroundColor: '#fdf6e3', border: '1px solid #D8B56D', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#10172B', marginBottom: '8px' }}>
                  ✨ Guruji's Blessings & Personal Message
                </h3>
                <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#1a1a1a', whiteSpace: 'pre-wrap' }}>{form.gurujiMessage}</p>
              </div>
            )}

            {/* Shastra Quote */}
            {form.shastraQuote && (
              <div style={{ marginBottom: '20px', textAlign: 'center', borderTop: '1px solid #D8B56D', borderBottom: '1px solid #D8B56D', padding: '16px' }}>
                <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#10172B', lineHeight: '1.8' }}>
                  &ldquo;{form.shastraQuote}&rdquo;
                </p>
                {form.shastraQuoteSource && (
                  <p style={{ fontSize: '11px', color: '#7a6a4a', marginTop: '6px' }}>— {form.shastraQuoteSource}</p>
                )}
              </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #D8B56D', fontSize: '11px', color: '#7a6a4a' }}>
              <p style={{ fontWeight: 'bold', fontSize: '13px', color: '#10172B' }}>
                {siteConfig.astrologer.name}
              </p>
              <p>{siteConfig.astrologer.title}</p>
              <p style={{ marginTop: '6px' }}>
                {siteConfig.contact.address.fullText} · {siteConfig.contact.phone}
              </p>
              <p style={{ marginTop: '10px', fontSize: '10px', letterSpacing: '2px', color: '#B8860B' }}>
                ॥ ॐ तत् सत् ॥
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RemedyDossierPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#10172B] flex items-center justify-center">
        <div className="text-[#D8B56D] text-sm animate-pulse">Loading Remedy Dossier…</div>
      </div>
    }>
      <RemedyDossierInner />
    </Suspense>
  );
}
