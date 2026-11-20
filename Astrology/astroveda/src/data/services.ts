export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  filterGroup: 'life' | 'relationship' | 'spatial' | 'reports';
  badge: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  duration: number; // minutes
  deliveryLabel?: string;
  price: number; // INR
  modes: ('video' | 'phone' | 'in_person')[];
  whatToPrepare: string[];
  faqIds: string[];
}

export const allServices: ServiceDetail[] = [
  {
    id: 'svc-1',
    slug: 'general-consultation',
    title: 'General Consultation',
    category: 'Vedic Reading',
    filterGroup: 'life',
    badge: 'Comprehensive',
    image: '/images/service-general-clean.jpg',
    shortDescription: 'Get guidance on various aspects of life including career, health, finance and relationships.',
    fullDescription: 'A complete Vedic horoscope analysis based on ancient Parashari principles. We examine your Janam Kundli, Navamsha (D9) chart, current Vimshottari Mahadasha/Antardasha, and ongoing planetary transits (Gochar). You will receive comprehensive clarity on upcoming life cycles, potential hurdles, and practical astrological remedies including mantras and gemstone recommendations.',
    duration: 60,
    price: 1000,
    modes: ['video', 'phone', 'in_person'],
    whatToPrepare: [
      'Exact Date, Time, and Place of Birth',
      'List of 3 to 5 specific life questions or dilemmas',
      'Notebook and pen to jot down personalized guidance and remedial notes',
    ],
    faqIds: ['faq-1', 'faq-2', 'faq-3'],
  },
  {
    id: 'svc-2',
    slug: 'career-guidance',
    title: 'Career Guidance',
    category: 'Career & Growth',
    filterGroup: 'life',
    badge: '10th House Karma',
    image: '/images/service-career.png',
    shortDescription: 'Find the right career path and make confident decisions for professional growth.',
    fullDescription: 'Detailed evaluation of the 10th house (Karma Bhava), Dashamsha (D10) divisional chart, and Saturn/Jupiter influences on your professional trajectory. Identify whether employment, entrepreneurship, or government service is most aligned with your cosmic strengths. Understand ideal timing for job switches, promotions, and relocation.',
    duration: 60,
    price: 1000,
    modes: ['video', 'phone'],
    whatToPrepare: [
      'Exact Birth Details (Date, Time, City)',
      'Current job profile, industry, and educational background',
      'Specific career decisions or pending offers you wish to evaluate',
    ],
    faqIds: ['faq-1', 'faq-2'],
  },
  {
    id: 'svc-3',
    slug: 'marriage-compatibility',
    title: 'Marriage & Compatibility',
    category: 'Relationships',
    filterGroup: 'relationship',
    badge: 'Guna Milan 36 Koota',
    image: '/images/service-marriage.png',
    shortDescription: 'Analyze compatibility and get guidance for a harmonious relationship.',
    fullDescription: 'In-depth Ashtakoot Guna Milan (36-point system) combined with planetary matching of 7th house, Venus, Jupiter, and Mars placements. We thoroughly examine Manglik Dosha, Nadi Dosha, Bhakoot Dosha, and their genuine cancellations. If married, we provide guidance for resolving friction and cultivating long-term marital bliss.',
    duration: 60,
    price: 1000,
    modes: ['video', 'phone', 'in_person'],
    whatToPrepare: [
      'Birth details (Date, Time, Place) for both partners',
      'Any known family background or marriage-timing concerns',
    ],
    faqIds: ['faq-1', 'faq-2'],
  },
  {
    id: 'svc-4',
    slug: 'health-guidance',
    title: 'Health Guidance',
    category: 'Wellness',
    filterGroup: 'life',
    badge: 'Ayur-Jyotish',
    image: '/images/service-health.png',
    shortDescription: 'Understand health challenges and get astrological remedies.',
    fullDescription: 'Assessment of the 6th, 8th, and 12th houses, Moon placement, and the Ascendant lord to pinpoint potential physical vulnerabilities and mental stress factors. Vedic remedies emphasize non-invasive lifestyle alignment, Ayurvedic planetary correlations, auspicious gemstone usage, and soothing planetary chants.',
    duration: 60,
    price: 1000,
    modes: ['video', 'phone'],
    whatToPrepare: [
      'Birth chart details (Date, Time, City)',
      'General areas of chronic physical strain or recurring stress patterns',
    ],
    faqIds: ['faq-1', 'faq-3'],
  },
  {
    id: 'svc-5',
    slug: 'business-finance',
    title: 'Business & Finance',
    category: 'Finance',
    filterGroup: 'life',
    badge: 'Dhanyoga & Labha',
    image: '/images/service-business.png',
    shortDescription: 'Get insights for business growth and financial stability.',
    fullDescription: 'Examination of the 2nd (Dhana), 11th (Labha), 9th (Bhagya), and 7th (Partnerships) houses. Discover auspicious Muhurat periods for launching ventures, entering contracts, capital investments, and expanding trade. Practical remedies to clear financial blockages and enhance prosperity flow.',
    duration: 60,
    price: 1000,
    modes: ['video', 'phone', 'in_person'],
    whatToPrepare: [
      'Founder or key decision maker’s birth details',
      'Company incorporation date (if applicable)',
      'Key investment decisions or business dilemmas',
    ],
    faqIds: ['faq-1', 'faq-2'],
  },
  {
    id: 'svc-6',
    slug: 'vastu-consultation',
    title: 'Vastu Consultation',
    category: 'Vastu Shastra',
    filterGroup: 'spatial',
    badge: 'Vastu Purusha',
    image: '/images/service-vastu.png',
    shortDescription: 'Improve positivity and harmony in your home or office.',
    fullDescription: 'Traditional Vedic Vastu Shastra consultation designed to harmonize the 5 primordial elements (Pancha Bhoota) and 16 directional zones of your living or workspace. We focus on practical, non-destructive remedial remedies (energy neutralizers, directional balances, elemental corrections) without requiring heavy structural demolition.',
    duration: 60,
    price: 1500,
    modes: ['video', 'in_person'],
    whatToPrepare: [
      'Floor plan or directional sketch of the premises',
      'Compass-marked North direction',
      'Specific issues experienced in the space (financial stagnation, health, arguments)',
    ],
    faqIds: ['faq-1', 'faq-2'],
  },
  {
    id: 'svc-7',
    slug: 'numerology',
    title: 'Numerology',
    category: 'Numerology',
    filterGroup: 'reports',
    badge: 'Mulank & Bhagyank',
    image: '/images/service-numerology.png',
    shortDescription: 'Discover the power of numbers and their influence in your life.',
    fullDescription: 'Comprehensive Vedic and Chaldean numerology analysis. Calculate your Mulank (Driver number), Bhagyank (Destiny number), and Name vibration frequency. Determine auspicious numbers, favorable dates, lucky colors, and signature adjustments for career acceleration and personal harmony.',
    duration: 60,
    price: 1000,
    modes: ['video', 'phone'],
    whatToPrepare: [
      'Full legal name as spelled on official documents',
      'Date of birth',
      'Current professional title or business brand name',
    ],
    faqIds: ['faq-1', 'faq-2'],
  },
  {
    id: 'svc-8',
    slug: 'personalized-report',
    title: 'Personalized Report',
    category: 'In-Depth Report',
    filterGroup: 'reports',
    badge: 'Complete Janampatri',
    image: '/images/service-report.png',
    shortDescription: 'Detailed written analysis with remedies.',
    fullDescription: 'A meticulously hand-crafted 25+ page Vedic astrology dossier authored directly by the astrologer. Includes natal chart diagram, planetary strength tables (Shadbala), Vimshottari Mahadasha timeline with 5-year outlook, annual transit analysis, and a customized remedial protocol.',
    duration: 180,
    deliveryLabel: '3-5 days',
    price: 2500,
    modes: ['phone', 'video'],
    whatToPrepare: [
      'Exact Birth Details (Date, Time, City of Birth)',
      'Specific life focus areas for comprehensive report write-up',
    ],
    faqIds: ['faq-1', 'faq-3'],
  },
];
