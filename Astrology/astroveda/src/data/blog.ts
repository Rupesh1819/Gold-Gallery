export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Planetary Transits' | 'Chart Interpretation' | 'Vedic Philosophy' | 'Vastu & Space';
  categoryPill: string;
  publishDate: string;
  readTime: string;
  author: string;
  authorRole: string;
  abstract: string;
  featured: boolean;
  image: string;
  keyInsight?: string;
}

export const allBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'understanding-shani-sade-sati',
    title: 'Understanding the Impact of Shani Sade Sati: A Karmic Perspective, Not a Curse',
    category: 'Planetary Transits',
    categoryPill: 'Shani Gochara',
    publishDate: '18 Jan 2025',
    readTime: '7 min read',
    author: 'Omkar Ransing Guruji',
    authorRole: 'Chief Daivajna • Vedic Astrologer',
    abstract: 'Dismantling widespread superstitions and elucidating the 7.5-year planetary passage of Saturn through the authentic lens of Sage Parashara, classical Jyotisha principles, and spiritual fortitude.',
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw6pHwcCNSu1LGwJv_Veg-_lKo_zPRILDSr7X4a327oiPbdOI9rj9T11aciZOoqoZiu-NPOOglRkfSoY-sEDo4Vf0rmrsT5duxoofVNtztsyfqwLq81jduPijRaReUm08uOKwzwYTcZaSVZ6FzCDO1hCE-2Y92Yhu4XlimA6Wmo9IMROK_r0lG-v9wKBfjWl8MAheBFUN_uC6q_SsuP2r9d676HXjtE2PV1zynndS9',
    keyInsight: '"Sade Sati harms only that which is fragile and untruthful within your ego. When met with discipline, it imparts enduring sovereignty."',
  },
  {
    id: 'post-2',
    slug: 'navamsha-d9-marriage-destiny',
    title: 'The Navamsha (D9) Secret: Why Your Birth Chart Is Only Half The Truth',
    category: 'Chart Interpretation',
    categoryPill: 'Divisional Charts',
    publishDate: '12 Jan 2025',
    readTime: '6 min read',
    author: 'Omkar Ransing Guruji',
    authorRole: 'Chief Daivajna • Vedic Astrologer',
    abstract: 'In Vedic Jyotish, the Rashi chart (D1) represents the seed, but the Navamsha (D9) reveals the fruit. Learn how marital destiny, inner fortitude, and post-30 fortunes unfold.',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuGwDog5TNfXH9Qxg_ZhuJc6BZX0MSIqEeHkxFmElSROodyuePsBlunrXCsjQZhGbPAIGpBJuypgNg1osDKDJtxMd5dJKm1QLCsvPq44kQPLT6ocgPEeR1fvZ2OsJqyaUhTAInMv2blo_5puwUq_bz2CNzG-az29JFopKWgWncETUvqETtJ8oMHS56DyjYp0OuxmZNU-gqViOkwKwwRgs-odfjbiBrZhVbUAo2MPOR',
    keyInsight: '"D1 is the promise made at birth; D9 is what you actually harvest after facing life\'s trials."',
  },
  {
    id: 'post-3',
    slug: 'guru-gochara-taurus',
    title: 'Guru in Vrishabha: Unlocking Spiritual Wisdom and Enduring Wealth',
    category: 'Planetary Transits',
    categoryPill: 'Brihaspati Gochar',
    publishDate: '05 Jan 2025',
    readTime: '5 min read',
    author: 'Omkar Ransing Guruji',
    authorRole: 'Chief Daivajna • Vedic Astrologer',
    abstract: 'Jupiter\'s transit across Venusian Taurus anchors divine intellect into concrete material stability. Discover which Moon signs benefit most from this expansive grace.',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx-cUeG8D98p9-hKlHlIXGtBmtCv7s3Uh1BwhH9QTWLs7OcrCpUBe5JV5_NAzu_dgqYkVVVOcvvlUveUchfAElLtdQ49-SxZomvGrfhHq8YMLqEXCMMyEv8ta6RWtHljZNcXPiXEQhOAWHrdMKRacGN2rAZLVOz0rRmyBo8N5mixv28yccqgaBPJ96iLE37wn20MQdtiTAqGcgxaplNbXSDpJPgHDZ1CmP5ACCKloK',
    keyInsight: '"When the Guru meets Prithvi tattva, knowledge ceases to be abstract and manifests as living abundance."',
  },
  {
    id: 'post-4',
    slug: 'rahu-ketu-karmic-axis',
    title: 'The Karmic Serpent: Demystifying the Rahu-Ketu Axis in 2025',
    category: 'Vedic Philosophy',
    categoryPill: 'Chhaya Grahas',
    publishDate: '28 Dec 2024',
    readTime: '8 min read',
    author: 'Omkar Ransing Guruji',
    authorRole: 'Chief Daivajna • Vedic Astrologer',
    abstract: 'The lunar nodes represent obsession (Rahu) and liberation (Ketu). Understanding their nodal shift between Pisces and Virgo provides clarity on your deepest instinctual cravings.',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC5orth4sCFasFRN8gFQF4RZTFN66OhNCMtpgphxH7UTmK9BkI49bopBoUd09EXWEfiye392KrXDF0YX0aozm06DOlSN0q0reh0ZIGZ2H99ZXeguCSEWBV446goyDFYGIXYjpe1-oG4CHTfynWUZMY6BMRlpR5cz9kt-knBoLuilf3vrbY8FykrsatHTDqMnGP_wlOd5DBnxfOBgh16BNRM-q4qJkCoJ9xELcEpKQX',
    keyInsight: '"Rahu shows where your hunger will test you; Ketu shows what you must learn to release gracefully."',
  },
  {
    id: 'post-5',
    slug: 'vastu-purusha-mandala',
    title: 'Vastu Purusha Mandala: Aligning Domestic Architecture with Cosmic Prana',
    category: 'Vastu & Space',
    categoryPill: 'Spatial Harmony',
    publishDate: '20 Dec 2024',
    readTime: '6 min read',
    author: 'Omkar Ransing Guruji',
    authorRole: 'Chief Daivajna • Vedic Astrologer',
    abstract: 'How the 16 compass directions and 5 primordial elements (Pancha Bhoota) shape psychological tranquility and family prosperity within domestic environments.',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsk8227DhCwrFxOKd60QSHANB3giehzE_lNkutO1aNARVvQHT-Ann3ccixxbj-_AJy9VtJfFoOfiZzYIhkKxR6X7gxoQOKb5DqyzDst2C4P3kbW2kC3ErYZ2Bq1RJ2UXWBJMQd0Gn7-LTkECp8Jk0_CADQie-C92Zxv7JZ5gbKlZCUFpmPOT3qRjQuu78OHoVsBLGBvQACnHvLScc3Mg9DbnvGNukNTHQewsZrSGe2',
    keyInsight: '"Your physical dwelling is an externalized extension of your subtle body. When the space breathes, the mind settles."',
  },
];

