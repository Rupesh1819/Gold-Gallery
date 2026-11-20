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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADRCKm3vKJPifLHpBzr-MgtGIO2vZqTFWMQZGXoKljfyDAonw9Z3-WOPRu4BU6TMpHXYYSYO32cGhT2rY6_XCukxBfTfqKj-ajPgLg5yjRqICzQZMMW1SnYD2vhG2H6vKxHqGkh8ffdYQZsZQ8C6mWkMUZe8tqctTcQqB363bjlBP1WQAzuSS0yfpAaxPXKdWcPGm5pHd26jYfT2s80R8HQZMbWDztWJpvu41XUkyq',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuGwDog5TNfXH9Qxg_ZhuJc6BZX0MSIqEeHkxFmElSROodyuePsBlunrXCsjQZhGbPAIGpBJuypgNg1osDKDJtxMd5dJKm1QLCsvPq44kQPLT6ocgPEeR1fvZ2OsJqyaUhTAInMv2blo_5puwUq_bz2CNzG-az29JFopKWgWncETUvqETtJ8oMHS56DyjYp0OuxmZNU-gqViOkwKwwRgs-odfjbiBrZhVbUAo2MPOR',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZVuGQnXWv-VabYYUd6r0r6i6SzmfwCd-dY234-iLll-WtXzFiMxfxziP3HyaILbx-UFXnqTOzx6zh1If9SB9f6XNI405CCHL4igl4N2g-8k53M16gG1Jnwh7534u0jk9tIyciR9fwEBSbp9GSJDUQ-TdXjzStI-y18LaDCf8ett5nr4F43lU8oha7r-3uEEKoH0tVQGh3vJ5eNeNVUWO7_eEuvrPu81iPH09yohwC',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx-cUeG8D98p9-hKlHlIXGtBmtCv7s3Uh1BwhH9QTWLs7OcrCpUBe5JV5_NAzu_dgqYkVVVOcvvlUveUchfAElLtdQ49-SxZomvGrfhHq8YMLqEXCMMyEv8ta6RWtHljZNcXPiXEQhOAWHrdMKRacGN2rAZLVOz0rRmyBo8N5mixv28yccqgaBPJ96iLE37wn20MQdtiTAqGcgxaplNbXSDpJPgHDZ1CmP5ACCKloK',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsk8227DhCwrFxOKd60QSHANB3giehzE_lNkutO1aNARVvQHT-Ann3ccixxbj-_AJy9VtJfFoOfiZzYIhkKxR6X7gxoQOKb5DqyzDst2C4P3kbW2kC3ErYZ2Bq1RJ2UXWBJMQd0Gn7-LTkECp8Jk0_CADQie-C92Zxv7JZ5gbKlZCUFpmPOT3qRjQuu78OHoVsBLGBvQACnHvLScc3Mg9DbnvGNukNTHQewsZrSGe2',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC5orth4sCFasFRN8gFQF4RZTFN66OhNCMtpgphxH7UTmK9BkI49bopBoUd09EXWEfiye392KrXDF0YX0aozm06DOlSN0q0reh0ZIGZ2H99ZXeguCSEWBV446goyDFYGIXYjpe1-oG4CHTfynWUZMY6BMRlpR5cz9kt-knBoLuilf3vrbY8FykrsatHTDqMnGP_wlOd5DBnxfOBgh16BNRM-q4qJkCoJ9xELcEpKQX',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaBGwDyoI3CnRO3BWrUV7GcBlpKJUoYXka_Q4KzzGWt4bMQzkPu68GVdlhRazh4nMGZvbuJ5urmMyhk09blF6IH08U-QloPKbrENfsPs9wqCnnJTujpDvDfJ1Y4E4S_nq6ieCzR1jNrf5iZ9CEhX8UA-Lwfzid-2FSW6EgQKHJ5pe-j-fwq7ltlxhsaTA8RU4cghJqJkh9YeH6QYi8vsVp4iSAdOIe_G1fYJV1kcNh',
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
