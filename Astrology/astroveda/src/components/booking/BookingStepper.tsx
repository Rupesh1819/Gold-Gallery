'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { allServices, type ServiceDetail } from '@/data/services';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Video, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';

export function BookingStepper() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get('service');
  const t = useTranslations('booking');
  const tServices = useTranslations('services');

  // Active step: 1 (Select & Schedule), 3 (Details), 4 (Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [selectedService, setSelectedService] = useState<ServiceDetail>(
    allServices.find((s) => s.slug === preselectedSlug) || allServices[0]
  );
  const [selectedMode, setSelectedMode] = useState<'phone' | 'video' | 'in_person'>('video');
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate() + 1);
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM');

  // Customer Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState(locale === 'mr' ? 'Marathi' : locale === 'hi' ? 'Hindi' : 'English');
  const [questionArea, setQuestionArea] = useState('');
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timeSlots, setTimeSlots] = useState<string[]>([
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ]);

  // Dynamically fetch live slots from Supabase RPC via /api/slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(Math.min(Math.max(selectedDate, 1), 28)).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const res = await fetch(`/api/slots?service=${selectedService.slug}&date=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          if (data.slots && data.slots.length > 0) {
            setTimeSlots(data.slots);
            if (!data.slots.includes(selectedSlot)) {
              setSelectedSlot(data.slots[0]);
            }
          }
        }
      } catch (e) {
        // Fallback default slots preserved
      }
    };
    fetchSlots();
  }, [selectedService.slug, selectedDate]);

  const calendarDays = [
    null, null, null, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31,
  ];

  const handleNextToDetails = () => {
    setCurrentStep(3);
    const detailsElem = document.getElementById('customer-details-section');
    if (detailsElem) {
      detailsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = t('errName');
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || !/^\+?[0-9]{10,13}$/.test(cleanPhone)) {
      errs.phone = t('errPhone');
    }
    if (!consent) {
      errs.consent = t('errConsent');
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(Math.min(Math.max(selectedDate, 1), 28)).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: selectedService.slug,
          dateStr,
          timeSlot: selectedSlot,
          fullName: fullName.trim(),
          phone: cleanPhone,
          email: email.trim(),
          language: locale,
          mode: selectedMode,
          questionArea: questionArea.trim(),
          consent,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrors({ form: result.error || 'Failed to record booking request' });
        setIsSubmitting(false);
        return;
      }

      // Success: save management token in session storage and redirect to confirmation slip
      if (result.manageToken && typeof window !== 'undefined') {
        sessionStorage.setItem(`manage_token_${result.reference}`, result.manageToken);
      }
      router.push(`/book/confirmation/${result.reference}`);
    } catch (err: any) {
      setErrors({ form: 'Connection error while saving appointment request.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      
      {/* 1. Top Cosmic Breadcrumb & Context Header */}
      <section className="w-full bg-[#10172B] text-[#DBE1FD] pt-28 sm:pt-34 pb-12 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#D8B56D]/15">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27304A]/80 text-[#F6D186] text-xs font-semibold mb-3 border border-[#D8B56D]/20">
            <span className="text-[#D8B56D]">✦</span>
            <span>{t('bannerBadge')}</span>
            <span className="text-[#D8B56D]">✦</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#F6D186] tracking-tight font-serif">
            {t('bannerTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-xl mt-2 font-body">
            {t('bannerSubtitle')}
          </p>

          {/* 4-Step Horizontal Stepper */}
          <nav aria-label="Booking Progress" className="w-full max-w-3xl mt-8 sm:mt-10">
            <ol className="grid grid-cols-4 items-center relative">
              {/* Step 1 */}
              <li className="flex flex-col items-center text-center relative group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#27304A] text-[#F6D186] font-heading text-sm sm:text-xl flex items-center justify-center ring-2 ring-[#D8B56D] shadow-md z-10 font-bold">
                  1
                </div>
                <span className="text-[10px] sm:text-xs text-[#F6D186] mt-1.5 sm:mt-2 font-semibold">
                  {t('step1')}
                </span>
                <div className="absolute left-1/2 top-4 sm:top-5 w-full h-[2px] bg-[#D8B56D] -z-0" />
              </li>

              {/* Step 2 */}
              <li className="flex flex-col items-center text-center relative group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F6D186] text-[#402D00] font-heading text-sm sm:text-xl flex items-center justify-center font-bold ring-2 sm:ring-4 ring-[#F6D186]/20 shadow-lg z-10">
                  2
                </div>
                <span className="text-[10px] sm:text-xs text-[#F6D186] mt-1.5 sm:mt-2 font-semibold">
                  {t('step2')}
                </span>
                <div className={`absolute left-1/2 top-4 sm:top-5 w-full h-[2px] ${currentStep >= 3 ? 'bg-[#D8B56D]' : 'bg-[#2D344A]'} -z-0`} />
              </li>

              {/* Step 3 */}
              <li className="flex flex-col items-center text-center relative group">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-heading text-sm sm:text-xl flex items-center justify-center z-10 border border-[#998F80]/30 font-bold ${
                  currentStep >= 3 ? 'bg-[#F6D186] text-[#402D00]' : 'bg-[#22293E] text-[#D0C5B4]'
                }`}>
                  3
                </div>
                <span className="text-[10px] sm:text-xs text-[#D0C5B4] mt-1.5 sm:mt-2">
                  {t('step3')}
                </span>
                <div className="absolute left-1/2 top-4 sm:top-5 w-full h-[2px] bg-[#2D344A] -z-0" />
              </li>

              {/* Step 4 */}
              <li className="flex flex-col items-center text-center relative group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#22293E] text-[#D0C5B4] font-heading text-sm sm:text-xl flex items-center justify-center z-10 border border-[#998F80]/30 font-bold">
                  4
                </div>
                <span className="text-[10px] sm:text-xs text-[#D0C5B4] mt-1.5 sm:mt-2">
                  {t('step4')}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* 2. Interactive Consultation Sanctuary (Ivory Body Canvas) */}
      <section className="w-full bg-[#F7F3EA] text-[#10172B] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Honest Dakshina Policy Notice Pill */}
          <div className="p-4 rounded-xl bg-[#FFDF9F]/40 border border-[#D8B56D]/40 flex items-center justify-between flex-wrap gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#7A5A12]" />
              <span className="text-xs sm:text-sm text-[#5B4303] font-body">
                <strong>{t('dakshinaPolicyTitle')}</strong> {t('dakshinaPolicyText')}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A5A12] uppercase tracking-wider">
              <span>{t('timezone')}</span>
            </div>
          </div>

          {/* Main Two-Column Interactive Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (5 cols): Select Service */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_24px_rgba(16,23,43,0.06)] border border-[#4D4639]/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#10172B]/10">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl text-[#10172B] font-bold">
                    {t('selectServiceTitle')}
                  </h2>
                  <p className="text-xs text-[#10172B]/70 font-body">
                    {t('selectServiceDesc')}
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-[#D8B56D]" />
              </div>

              {/* Service Radio Cards Group */}
              <div className="space-y-3">
                {allServices.slice(0, 4).map((service) => {
                  const isSelected = selectedService.id === service.id;
                  const localizedTitle = tServices.has(`items.${service.slug}.title`)
                    ? tServices(`items.${service.slug}.title`)
                    : service.title;

                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`
                        relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border-2
                        ${isSelected
                          ? 'border-[#D62839] bg-[#D62839]/[0.03] shadow-xs'
                          : 'border-[#10172B]/15 hover:border-[#D8B56D] bg-[#F7F3EA]/30 hover:bg-[#F7F3EA]/60'}
                      `}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#27304A] flex items-center justify-center text-[#F6D186] shrink-0 border border-[#D8B56D]/30">
                          <svg className="w-6 h-6 text-[#F6D186]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="3" fill="#D8B56D" />
                            <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-heading text-base font-bold text-[#10172B] block leading-tight">
                            {localizedTitle}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#10172B]/75">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-[#7A5A12]" />
                              <span>{service.duration} {tServices('mins')}</span>
                            </span>
                            <span>•</span>
                            <span className="font-bold text-[#10172B]">₹{service.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#D62839]' : 'border-[#10172B]/30'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#D62839]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Preferred Mode of Session */}
              <div className="pt-4 border-t border-[#10172B]/10 space-y-2.5">
                <span className="text-xs font-bold text-[#10172B] uppercase tracking-wider block">
                  {t('preferredModeTitle')}
                </span>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMode('phone')}
                    className={`py-2 px-1.5 sm:px-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[48px] justify-center ${
                      selectedMode === 'phone'
                        ? 'border-[#D62839] bg-[#D62839]/5 text-[#D62839] font-bold'
                        : 'border-[#10172B]/20 text-[#10172B]/70 hover:border-[#D8B56D]'
                    }`}
                  >
                    <Phone className="h-4 w-4" />
                    <span className="text-[10px] sm:text-[11px]">{t('modePhone')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMode('video')}
                    className={`py-2 px-1.5 sm:px-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[48px] justify-center ${
                      selectedMode === 'video'
                        ? 'border-[#D62839] bg-[#D62839]/5 text-[#D62839] font-bold'
                        : 'border-[#10172B]/20 text-[#10172B]/70 hover:border-[#D8B56D]'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span className="text-[10px] sm:text-[11px]">{t('modeVideo')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMode('in_person')}
                    className={`py-2 px-1.5 sm:px-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[48px] justify-center ${
                      selectedMode === 'in_person'
                        ? 'border-[#D62839] bg-[#D62839]/5 text-[#D62839] font-bold'
                        : 'border-[#10172B]/20 text-[#10172B]/70 hover:border-[#D8B56D]'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="text-[10px] sm:text-[11px]">{t('modeChamber')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Select Date & Time (Calendar + Available Slots) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl shadow-[0_4px_24px_rgba(16,23,43,0.06)] border border-[#4D4639]/10 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#10172B]/10">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl text-[#10172B] font-bold">
                    {t('selectDateTimeTitle')}
                  </h2>
                  <p className="text-xs text-[#10172B]/70 font-body">
                    {t('selectDateTimeDesc')}
                  </p>
                </div>
                <CalendarIcon className="h-5 w-5 text-[#D8B56D]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Month Calendar Widget (7 cols) */}
                <div className="md:col-span-7 border border-[#10172B]/15 rounded-xl p-3 sm:p-4 bg-[#F7F3EA]/30">
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" aria-label="Previous Month" className="p-1.5 text-[#10172B]/60 hover:text-[#10172B] min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#10172B]/5 cursor-pointer">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-heading text-sm font-bold text-[#10172B]">
                      {t('monthYear')}
                    </span>
                    <button type="button" aria-label="Next Month" className="p-1.5 text-[#10172B]/60 hover:text-[#10172B] min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#10172B]/5 cursor-pointer">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Day Names Row */}
                  <div className="grid grid-cols-7 text-center text-[10px] sm:text-[11px] font-bold text-[#10172B]/60 mb-2">
                    <span>{t('daySun')}</span>
                    <span>{t('dayMon')}</span>
                    <span>{t('dayTue')}</span>
                    <span>{t('dayWed')}</span>
                    <span>{t('dayThu')}</span>
                    <span>{t('dayFri')}</span>
                    <span>{t('daySat')}</span>
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {calendarDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="h-8 w-8 sm:h-9 sm:w-9" />;
                      }
                      const isSelected = selectedDate === day;
                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          onClick={() => setSelectedDate(day)}
                          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center mx-auto transition-colors cursor-pointer min-h-[32px] min-w-[32px] ${
                            isSelected
                              ? 'bg-[#10172B] text-white font-bold shadow-xs'
                              : 'text-[#10172B]/80 hover:bg-[#D8B56D]/20'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Slots Grid (5 cols) */}
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-[#10172B] block">
                    {t('availableSlotsTitle')}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center
                            ${isSelected
                              ? 'bg-[#D62839] text-white shadow-xs'
                              : 'border border-[#10172B]/20 text-[#10172B]/80 hover:border-[#D8B56D] bg-white'}
                          `}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-[#10172B]/60 leading-tight pt-1">
                    {t('bufferNotice')}
                  </p>
                </div>

              </div>

              {/* Bottom Summary Bar & Red Next Step Button */}
              <div className="pt-4 border-t border-[#10172B]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#10172B]">
                  <div className="h-2 w-2 rounded-full bg-[#16A34A]" />
                  <span>
                    <strong>{selectedDate} {t('monthYear')} • {selectedSlot}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNextToDetails}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-xs font-bold text-white bg-[#D62839] hover:bg-[#B81F2F] transition-all shadow-md cursor-pointer"
                >
                  <span>{t('step3')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* 3. Customer Details & Consent Form */}
          <div id="customer-details-section" className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-[0_4px_24px_rgba(16,23,43,0.06)] border border-[#4D4639]/10 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#10172B]/10 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F6D186] text-[#402D00] flex items-center justify-center font-heading font-bold text-base">
                  3
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#10172B]">
                    {t('customerDetailsTitle')}
                  </h3>
                  <p className="text-xs text-[#10172B]/70">
                    {t('customerDetailsDesc')}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F7F3EA] border border-[#D8B56D]/30 text-[11px] font-semibold text-[#7A5A12]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>DPDP (2023) Encrypted</span>
              </div>
            </div>

            {errors.form && (
              <div className="p-4 rounded-xl bg-[#D62839]/10 border border-[#D62839]/30 flex items-center gap-2.5 text-xs text-[#D62839] font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1.5">
                    {t('fullNameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/30 text-sm focus:outline-none focus:border-[#D8B56D] min-h-[44px]"
                  />
                  {errors.fullName && <p className="text-[11px] text-[#D62839] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1.5">
                    {t('phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/30 text-sm focus:outline-none focus:border-[#D8B56D] min-h-[44px]"
                  />
                  {errors.phone && <p className="text-[11px] text-[#D62839] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1.5">
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul.sharma@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/30 text-sm focus:outline-none focus:border-[#D8B56D] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1.5">
                    {t('languageLabel')}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/30 text-sm focus:outline-none focus:border-[#D8B56D] min-h-[44px]"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1.5">
                    {t('questionLabel')}
                  </label>
                  <input
                    type="text"
                    value={questionArea}
                    onChange={(e) => setQuestionArea(e.target.value)}
                    placeholder="e.g. Upcoming career promotion or business timing"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/20 bg-[#F7F3EA]/30 text-sm focus:outline-none focus:border-[#D8B56D] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Consent Box */}
              <div className="p-4 rounded-xl bg-[#F7F3EA]/50 border border-[#D8B56D]/30 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="dpdp-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#10172B]/30 text-[#D62839] focus:ring-[#D8B56D] cursor-pointer"
                />
                <label htmlFor="dpdp-consent" className="text-xs text-[#10172B]/80 leading-relaxed cursor-pointer font-body">
                  {t('consentText')}
                </label>
              </div>
              {errors.consent && <p className="text-[11px] text-[#D62839]">{errors.consent}</p>}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs sm:text-sm font-bold shadow-xl transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
                >
                  <span>{isSubmitting ? t('submittingBtn') : t('confirmBookingBtn')}</span>
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </form>

          </div>

        </div>
      </section>

    </div>
  );
}
