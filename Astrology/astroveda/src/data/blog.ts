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
    image: '/images/article-navagraha.png',
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
    image: '/images/service-marriage.png',
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
    image: '/images/service-business.png',
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
    image: '/images/article-rudraksha.png',
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
    image: '/images/article-vastu.png',
    keyInsight: '"Your physical dwelling is an externalized extension of your subtle body. When the space breathes, the mind settles."',
  },
];

