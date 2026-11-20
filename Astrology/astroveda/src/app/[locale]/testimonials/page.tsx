import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Star, Quote, ShieldCheck, Sparkles, Calendar } from 'lucide-react';
import { testimonialsList } from '@/data/testimonials';

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('testimonials');

  const localizedQuotes: Record<string, Record<string, { quote: string; service: string; location: string }>> = {
    hi: {
      't-1': {
        quote: 'आचार्य जी द्वारा मेरी जन्म कुंडली का विश्लेषण अत्यंत सटीक था। करियर में बदलाव के समय उन्होंने जो मार्गदर्शन दिया, उससे मुझे अभूतपूर्व सफलता मिली।',
        service: 'करियर एवं व्यापार उन्नति',
        location: 'पुणे, महाराष्ट्र',
      },
      't-2': {
        quote: 'विवाह में हो रहे विलंब को लेकर हम बहुत चिंतित थे। शास्त्रीय उपायों और शांत परामर्श ने हमारे परिवार को सकारात्मक संबल प्रदान किया।',
        service: 'विवाह एवं गुण मिलान',
        location: 'मुंबई, महाराष्ट्र',
      },
      't-3': {
        quote: 'एस्ट्रोवेद का दृष्टिकोण पूरी तरह वैज्ञानिक और प्रामाणिक है। कोई अंधविश्वास नहीं, केवल वैदिक सिद्धांतों का शुद्ध मार्गदर्शन।',
        service: 'सामान्य कुंडली विश्लेषण',
        location: 'नई दिल्ली',
      },
      't-4': {
        quote: 'हमारे नए घर के लिए वास्तु परामर्श से परिवार में अद्भुत सुख-शांति का वातावरण बना। उपाय अत्यंत सरल और बिना तोड़-फोड़ के थे।',
        service: 'वास्तु शास्त्र एवं गृह ऊर्जा',
        location: 'नागपुर, महाराष्ट्र',
      },
      't-5': {
        quote: 'मैंने व्यापार विस्तार के लिए परामर्श लिया। दशम और एकादश भाव के विश्लेषण से मुझे सही समय की प्रतीक्षा करने का स्पष्ट विवेक मिला।',
        service: 'व्यापार एवं धन योग',
        location: 'बेंगलुरु, कर्नाटक',
      },
      't-6': {
        quote: 'मांगलिक दोष को लेकर भय पैदा करने के बजाय, आचार्य जी ने पूरे तार्किक व आध्यात्मिक रूप से स्थिति समझाई। अत्यंत आभारी हूँ।',
        service: 'विवाह एवं गुण मिलान',
        location: 'ठाणे, महाराष्ट्र',
      },
    },
    mr: {
      't-1': {
        quote: 'आचार्यजींनी केलेले पत्रिका विश्लेषण अतिशय अचूक होते. करिअरमधील बदलाच्या वेळी दिलेल्या शास्त्रीय सल्ल्यामुळे मला मोठे यश मिळाले.',
        service: 'करिअर आणि व्यवसाय प्रगती',
        location: 'पुणे, महाराष्ट्र',
      },
      't-2': {
        quote: 'विवाहाला होणाऱ्या विलंबाबद्दल आम्ही खूप काळजीत होतो. शास्त्रीय उपाय आणि शांत मार्गदर्शनाने आमच्या कुटुंबाला मोठा मानसिक आधार दिला.',
        service: 'विवाह आणि गुणमिलन',
        location: 'मुंबई, महाराष्ट्र',
      },
      't-3': {
        quote: 'एस्ट्रोवेदची पद्धत पूर्णपणे प्रामाणिक आणि शास्त्रीय आहे. कोणतीही अंधश्रद्धा नाही, केवळ शुद्ध वैदिक तत्त्वांवर आधारित अचूक मार्गदर्शन.',
        service: 'सामान्य पत्रिका मार्गदर्शन',
        location: 'नवी दिल्ली',
      },
      't-4': {
        quote: 'आमच्या नवीन घरासाठी घेतलेल्या वास्तु मार्गदर्शनाने कुटुंबात सकारात्मक ऊर्जा आणि शांतता निर्माण केली. उपाय अतिशय साधे होते.',
        service: 'वास्तुशास्त्र आणि घरगुती ऊर्जा',
        location: 'नागपूर, महाराष्ट्र',
      },
      't-5': {
        quote: 'व्यवसाय वाढीच्या वेळेबाबत मी सल्ला घेतला. १० व्या आणि ११ व्या स्थानाच्या विश्लेषणाने मला योग्य वेळेची अचूक जाणीव करून दिली.',
        service: 'व्यवसाय आणि अर्थसमृद्धी',
        location: 'बंगळुरू, कर्नाटक',
      },
      't-6': {
        quote: 'मांगलिक दोषाची भीती दाखवण्याऐवजी, ग्रहांची खरी स्थिती तार्किक आणि आध्यात्मिक दृष्टीने समजावून सांगितली. मनापासून धन्यवाद.',
        service: 'विवाह आणि गुणमिलन',
        location: 'ठाणे, महाराष्ट्र',
      },
    },
  };

  const extraTestimonials = [
    {
      id: 't-4',
      name: 'Sunita D.',
      location: 'Nagpur, Maharashtra',
      rating: 5,
      service: 'Vastu Shastra & Harmony',
      quote: 'The Vastu Shastra consultation for our new home brought an immediate positive transformation in family peace and health. The remedies were simple, practical, and non-invasive.',
    },
    {
      id: 't-5',
      name: 'Anand V.',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      service: 'Career & Business Growth',
      quote: 'I consulted for business expansion timing. The analysis of my 10th and 11th houses gave me the exact clarity to wait for the auspicious period. Very thankful for the guidance!',
    },
    {
      id: 't-6',
      name: 'Meera J.',
      location: 'Thane, Maharashtra',
      rating: 5,
      service: 'Marriage Compatibility',
      quote: 'Unlike many astrologers who create fear around Manglik dosha, MyGuruji explained the placements with profound logic and peaceful spiritual remedies. Highly recommended.',
    },
  ];

  const fullTestimonials = [...testimonialsList, ...extraTestimonials];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EA] text-[#10172B]">
      {/* 1. Top Celestial Midnight Banner */}
      <section className="relative w-full bg-[#10172B] text-white pt-28 sm:pt-34 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#D8B56D]/15 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#27304A]/40 via-[#10172B] to-[#0B1326] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-[#F6D186]" />
            <span>{t('bannerBadge')}</span>
            <Sparkles className="h-3 w-3 text-[#F6D186]" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#F6D186] tracking-tight">
            {t('title')}
          </h1>

          <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-xl mx-auto font-body leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 2. Testimonials Grid */}
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {fullTestimonials.map((item) => {
              const loc = localizedQuotes[locale]?.[item.id];
              const quote = loc?.quote || item.quote;
              const service = loc?.service || item.service;
              const location = loc?.location || item.location;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D8B56D]/30 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-[#D8B56D]/20 group-hover:text-[#D8B56D]/40 transition-colors" />

                  <div>
                    <div className="flex items-center gap-1 text-[#F6D186] mb-3">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#D8B56D] text-[#D8B56D]" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[#10172B]/85 leading-relaxed font-body italic mb-6">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#10172B]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#10172B] text-[#F6D186] border border-[#D8B56D]/30 flex items-center justify-center font-bold text-sm shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#10172B]">{item.name}</h4>
                        <p className="text-[11px] text-[#544D42]">{location}</p>
                      </div>
                    </div>

                    {service && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] bg-[#F7F3EA] px-2.5 py-1 rounded-md border border-[#D8B56D]/20">
                        {service}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy Note */}
          <div className="mt-12 p-6 rounded-2xl bg-white border border-[#D8B56D]/30 text-center max-w-2xl mx-auto text-xs text-[#544D42] shadow-xs">
            <ShieldCheck className="h-5 w-5 text-[#D8B56D] mx-auto mb-2" />
            <p className="leading-relaxed font-body">
              {t('privacyNote')}
            </p>
          </div>

          {/* Consultation CTA Banner */}
          <div className="mt-14 max-w-4xl mx-auto p-8 rounded-2xl bg-[#10172B] text-white border border-[#D8B56D]/30 text-center space-y-4 shadow-xl">
            <h3 className="font-heading text-2xl sm:text-3xl text-[#F6D186] font-bold">
              {t('ctaTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-lg mx-auto font-body">
              {t('ctaDesc')}
            </p>
            <div className="pt-2">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold shadow-lg shadow-[#D62839]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t('bookConsultationBtn')}</span>
                <Calendar className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
