'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  BookOpen,
  Pin,
  Trash2,
  Check,
  RefreshCw,
  MessageCircle,
  X,
  Radio,
  Share2,
  Tags,
  Globe,
  Edit2,
  Save,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface SacredBulletin {
  id: string;
  type: 'bulletin' | 'article';
  title: string;
  category: string;
  date: string;
  content: string;
  pinned: boolean;
  active: boolean;
  author: string;
  readTime?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  translations: {
    en: string;
    hi: string;
    mr: string;
  };
}

export default function ContentAdminPage() {
  const [activeTab, setActiveTab] = useState<'bulletins' | 'articles' | 'categories'>('bulletins');
  const [bulletins, setBulletins] = useState<SacredBulletin[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Bulletin Modal
  const [isNewBulletinOpen, setIsNewBulletinOpen] = useState(false);
  const [bulletinTitle, setBulletinTitle] = useState('');
  const [bulletinCategory, setBulletinCategory] = useState('Panchang Alert');
  const [bulletinContent, setBulletinContent] = useState('');
  const [bulletinPinned, setBulletinPinned] = useState(false);
  const [submittingBulletin, setSubmittingBulletin] = useState(false);

  // Other Category Custom Inputs (Bulletin)
  const [isCustomBulletinCategory, setIsCustomBulletinCategory] = useState(false);
  const [customBulletinCatEn, setCustomBulletinCatEn] = useState('');
  const [customBulletinCatHi, setCustomBulletinCatHi] = useState('');
  const [customBulletinCatMr, setCustomBulletinCatMr] = useState('');

  // New Article Modal
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('Planetary Transits');
  const [articleReadTime, setArticleReadTime] = useState('5 min read');
  const [articleContent, setArticleContent] = useState('');
  const [submittingArticle, setSubmittingArticle] = useState(false);

  // Other Category Custom Inputs (Article)
  const [isCustomArticleCategory, setIsCustomArticleCategory] = useState(false);
  const [customArticleCatEn, setCustomArticleCatEn] = useState('');
  const [customArticleCatHi, setCustomArticleCatHi] = useState('');
  const [customArticleCatMr, setCustomArticleCatMr] = useState('');

  // Standalone Add Category Modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatHi, setNewCatHi] = useState('');
  const [newCatMr, setNewCatMr] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Status Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const [contentRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/content'),
        fetch('/api/admin/categories'),
      ]);

      const contentData = await contentRes.json();
      const categoriesData = await categoriesRes.json();

      if (contentData.bulletins) setBulletins(contentData.bulletins);
      if (contentData.standardArticles) setArticles(contentData.standardArticles);
      if (categoriesData.categories) {
        setCategories(categoriesData.categories);
        if (categoriesData.categories.length > 0) {
          setBulletinCategory(categoriesData.categories[0].name);
          setArticleCategory(categoriesData.categories[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to fetch content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Helper: Save custom category if "Other" was selected
  const saveCustomCategoryIfNeeded = async (
    enName: string,
    hiName: string,
    mrName: string
  ): Promise<string> => {
    const trimmedEn = enName.trim();
    if (!trimmedEn) return 'General Guidance';

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedEn,
          en: trimmedEn,
          hi: hiName.trim() || trimmedEn,
          mr: mrName.trim() || trimmedEn,
        }),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) => [...prev, data.category]);
        return data.category.name;
      }
    } catch (err) {
      console.error('Failed to register category:', err);
    }
    return trimmedEn;
  };

  // 1. Post New Bulletin
  const handleCreateBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingBulletin(true);

      let finalCategory = bulletinCategory;
      if (isCustomBulletinCategory) {
        finalCategory = await saveCustomCategoryIfNeeded(
          customBulletinCatEn,
          customBulletinCatHi,
          customBulletinCatMr
        );
      }

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bulletin',
          title: bulletinTitle,
          category: finalCategory,
          content: bulletinContent,
          pinned: bulletinPinned,
          author: siteConfig.astrologer.name,
        }),
      });
      const data = await res.json();

      if (data.success && data.item) {
        setBulletins((prev) => [data.item, ...prev]);
        setIsNewBulletinOpen(false);
        setBulletinTitle('');
        setBulletinContent('');
        setBulletinPinned(false);
        setIsCustomBulletinCategory(false);
        setCustomBulletinCatEn('');
        setCustomBulletinCatHi('');
        setCustomBulletinCatMr('');
        showToast('Sacred Bulletin posted with multilingual category!');
      } else {
        alert(data.error || 'Failed to post bulletin');
      }
    } catch (err: any) {
      alert('Error creating bulletin: ' + err.message);
    } finally {
      setSubmittingBulletin(false);
    }
  };

  // 2. Post New Blog Article
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingArticle(true);

      let finalCategory = articleCategory;
      if (isCustomArticleCategory) {
        finalCategory = await saveCustomCategoryIfNeeded(
          customArticleCatEn,
          customArticleCatHi,
          customArticleCatMr
        );
      }

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'article',
          title: articleTitle,
          category: finalCategory,
          content: articleContent,
          readTime: articleReadTime,
          pinned: false,
          author: siteConfig.astrologer.name,
        }),
      });
      const data = await res.json();

      if (data.success && data.item) {
        setBulletins((prev) => [data.item, ...prev]);
        setIsNewArticleOpen(false);
        setArticleTitle('');
        setArticleContent('');
        setIsCustomArticleCategory(false);
        setCustomArticleCatEn('');
        setCustomArticleCatHi('');
        setCustomArticleCatMr('');
        showToast('New Astrological Article published!');
      } else {
        alert(data.error || 'Failed to publish article');
      }
    } catch (err: any) {
      alert('Error publishing article: ' + err.message);
    } finally {
      setSubmittingArticle(false);
    }
  };

  // 3. Standalone Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingCategory(true);
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName,
          en: newCatName,
          hi: newCatHi || newCatName,
          mr: newCatMr || newCatName,
        }),
      });
      const data = await res.json();

      if (data.success && data.category) {
        setCategories((prev) => [...prev, data.category]);
        setIsAddCategoryOpen(false);
        setNewCatName('');
        setNewCatHi('');
        setNewCatMr('');
        showToast(`Category "${data.category.name}" added in English, Hindi, and Marathi!`);
      } else {
        alert(data.error || 'Failed to add category');
      }
    } catch (err: any) {
      alert('Error adding category: ' + err.message);
    } finally {
      setSavingCategory(false);
    }
  };

  // 4. Toggle Pin
  const togglePin = async (item: SacredBulletin) => {
    const nextPin = !item.pinned;
    setBulletins((prev) =>
      prev.map((b) => (b.id === item.id ? { ...b, pinned: nextPin } : b))
    );

    try {
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, pinned: nextPin }),
      });
      showToast(nextPin ? 'Bulletin pinned to top of site' : 'Bulletin unpinned');
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  // 5. Toggle Active
  const toggleActive = async (item: SacredBulletin) => {
    const nextActive = !item.active;
    setBulletins((prev) =>
      prev.map((b) => (b.id === item.id ? { ...b, active: nextActive } : b))
    );

    try {
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, active: nextActive }),
      });
      showToast(nextActive ? 'Published to website' : 'Unpublished from website');
    } catch (err) {
      console.error('Failed to toggle active:', err);
    }
  };

  // 6. Delete Bulletin
  const handleDeleteBulletin = async (id: string) => {
    if (!confirm('Remove this bulletin permanently?')) return;
    try {
      const res = await fetch(`/api/admin/content?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBulletins((prev) => prev.filter((b) => b.id !== id));
        showToast('Bulletin deleted');
      }
    } catch (err) {
      alert('Error deleting');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#27304A] border border-[#D8B56D]/60 text-[#F6D186] text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#27304A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold mb-2">
            <span>GURUJI&apos;S EDITORIAL &amp; BLOG HUB</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
            Content, Bulletins &amp; Categories
          </h1>
          <p className="text-xs text-[#D0C5B4] mt-0.5">
            Post daily panchang alerts, festival advisories, transit warnings, and manage multilingual categories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsNewBulletinOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-red-700" />
            <span>Post Sacred Bulletin</span>
          </button>

          <button
            onClick={() => setIsNewArticleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#27304A] hover:bg-[#344062] border border-[#D8B56D]/30 text-[#F6D186] font-bold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Blog Article</span>
          </button>

          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141B2F] hover:bg-[#27304A] border border-[#27304A] text-[#DBE1FD] font-semibold text-xs transition-colors cursor-pointer"
          >
            <Tags className="w-3.5 h-3.5 text-[#D8B56D]" />
            <span>+ Add Category</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#27304A] overflow-x-auto">
        <button
          onClick={() => setActiveTab('bulletins')}
          className={`pb-3 px-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'bulletins'
              ? 'border-[#D8B56D] text-[#F6D186]'
              : 'border-transparent text-[#D0C5B4] hover:text-[#DBE1FD]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Guruji&apos;s Daily Bulletins ({bulletins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 px-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'articles'
              ? 'border-[#D8B56D] text-[#F6D186]'
              : 'border-transparent text-[#D0C5B4] hover:text-[#DBE1FD]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vedic Articles Library ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-[#D8B56D] text-[#F6D186]'
              : 'border-transparent text-[#D0C5B4] hover:text-[#DBE1FD]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Multilingual Category Directory ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: GURUJI'S SACRED BULLETINS */}
      {activeTab === 'bulletins' && (
        <div className="bg-[#181F33] rounded-2xl border border-[#27304A] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#27304A] flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
                Live Sacred Bulletins
              </h2>
              <p className="text-xs text-[#D0C5B4]/70">
                These alerts appear immediately at the top of the blog and homepage updates feed.
              </p>
            </div>
            <button
              onClick={loadContent}
              disabled={loading}
              className="p-1.5 rounded-lg bg-[#27304A] text-[#D8B56D] hover:bg-[#344062] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="divide-y divide-[#27304A]/60">
            {bulletins.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-[#27304A]/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/30">
                      {item.category}
                    </span>
                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8B56D]/20 text-[#F6D186] border border-[#D8B56D]/40">
                        <Pin className="w-3 h-3 text-[#D8B56D]" /> Pinned to Top
                      </span>
                    )}
                    <span className="text-[11px] text-[#D0C5B4]/60">• {item.date}</span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[#DBE1FD]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#D0C5B4] leading-relaxed max-w-3xl">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => togglePin(item)}
                    className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      item.pinned
                        ? 'bg-[#D8B56D] text-[#10172B]'
                        : 'bg-[#27304A] text-[#D0C5B4] hover:text-[#DBE1FD]'
                    }`}
                    title={item.pinned ? 'Unpin from Top' : 'Pin to Top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      item.active
                        ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                        : 'bg-[#27304A] text-[#D0C5B4]/60'
                    }`}
                  >
                    {item.active ? 'Published' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => handleDeleteBulletin(item.id)}
                    className="p-2 rounded-lg bg-red-600/15 text-red-400 hover:bg-red-600/30 transition-colors cursor-pointer"
                    title="Delete Bulletin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ARTICLES LIBRARY */}
      {activeTab === 'articles' && (
        <div className="bg-[#181F33] rounded-2xl p-6 border border-[#27304A] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
            <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
              Published Astrological Articles ({articles.length})
            </h2>
            <span className="text-xs text-[#D8B56D] font-semibold">Classical Parashari Insights</span>
          </div>

          <div className="divide-y divide-[#27304A]/60">
            {articles.map((art) => (
              <div
                key={art.slug}
                className="py-4 flex items-center justify-between text-xs sm:text-sm hover:bg-[#27304A]/30 transition-colors px-2 rounded-lg"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#F6D186] uppercase tracking-wider">
                    {art.category} • {art.date}
                  </span>
                  <h4 className="font-heading text-base font-bold text-[#DBE1FD] mt-0.5">
                    {art.title}
                  </h4>
                  <p className="text-xs text-[#D0C5B4]/70 mt-1 max-w-2xl line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
                <span className="text-xs font-semibold text-green-400 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 whitespace-nowrap">
                  Published
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MULTILINGUAL CATEGORIES DIRECTORY */}
      {activeTab === 'categories' && (
        <div className="bg-[#181F33] rounded-2xl border border-[#27304A] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#27304A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#DBE1FD]">
                Multilingual Category Directory ({categories.length})
              </h2>
              <p className="text-xs text-[#D0C5B4]/70">
                Categories automatically display in the seeker&apos;s active language (English, Hindi, Marathi).
              </p>
            </div>

            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer w-fit"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Category</span>
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#141B2F] text-[#D0C5B4] uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Identifier</th>
                  <th className="py-3 px-4">English (Default)</th>
                  <th className="py-3 px-4">Hindi (हिंदी)</th>
                  <th className="py-3 px-4">Marathi (मराठी)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27304A]/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#27304A]/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#D8B56D]">
                      {cat.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#DBE1FD]">
                      {cat.translations.en || cat.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#F6D186] font-medium">
                      {cat.translations.hi || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[#F6D186] font-medium">
                      {cat.translations.mr || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: POST SACRED BULLETIN WITH "OTHER" CATEGORY */}
      {isNewBulletinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleCreateBulletin}
            className="bg-[#181F33] border border-[#27304A] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs sm:text-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                  Post Sacred Bulletin / Daily Vani
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBulletinOpen(false)}
                className="p-1 text-[#D0C5B4] hover:text-[#DBE1FD] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Bulletin Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surya Grahan Alert & Sadhana Guidelines"
                  value={bulletinTitle}
                  onChange={(e) => setBulletinTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>

              {/* Category Dropdown with "Other / Add Custom" */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                    Classification Category
                  </label>
                  <select
                    value={isCustomBulletinCategory ? '__other__' : bulletinCategory}
                    onChange={(e) => {
                      if (e.target.value === '__other__') {
                        setIsCustomBulletinCategory(true);
                      } else {
                        setIsCustomBulletinCategory(false);
                        setBulletinCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#F6D186] font-semibold focus:outline-none focus:border-[#D8B56D]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.translations.hi})
                      </option>
                    ))}
                    <option value="__other__">➕ Other / Add Custom Category...</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 self-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulletinPinned}
                      onChange={(e) => setBulletinPinned(e.target.checked)}
                      className="accent-[#D8B56D]"
                    />
                    <span className="text-xs text-[#DBE1FD] font-semibold">
                      Pin to Top of Website
                    </span>
                  </label>
                </div>
              </div>

              {/* Dynamic Multilingual Inputs if "Other" Selected */}
              {isCustomBulletinCategory && (
                <div className="p-3.5 rounded-xl bg-[#141B2F] border border-[#D8B56D]/40 space-y-2.5 animate-fadeIn">
                  <span className="text-[11px] font-bold text-[#F6D186] flex items-center gap-1.5">
                    <Tags className="w-3.5 h-3.5 text-[#D8B56D]" /> Define Custom Multilingual Category
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#D0C5B4] block mb-0.5">English Name</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Navratri Special"
                        value={customBulletinCatEn}
                        onChange={(e) => setCustomBulletinCatEn(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#181F33] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D0C5B4] block mb-0.5">Hindi (हिंदी)</span>
                      <input
                        type="text"
                        placeholder="e.g. नवरात्रि विशेष"
                        value={customBulletinCatHi}
                        onChange={(e) => setCustomBulletinCatHi(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#181F33] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D0C5B4] block mb-0.5">Marathi (मराठी)</span>
                      <input
                        type="text"
                        placeholder="e.g. नवरात्री विशेष"
                        value={customBulletinCatMr}
                        onChange={(e) => setCustomBulletinCatMr(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#181F33] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Guruji&apos;s Message / Guidance Content
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Enter the auspicious guidance, auspicious timings, or transit remedies..."
                  value={bulletinContent}
                  onChange={(e) => setBulletinContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27304A]">
              <button
                type="button"
                onClick={() => setIsNewBulletinOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#D0C5B4] hover:bg-[#27304A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingBulletin}
                className="px-5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer"
              >
                {submittingBulletin ? 'Posting...' : 'Publish Bulletin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: CREATE BLOG ARTICLE WITH "OTHER" CATEGORY */}
      {isNewArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleCreateArticle}
            className="bg-[#181F33] border border-[#27304A] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-xs sm:text-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D8B56D]" />
                <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                  Publish In-Depth Vedic Article
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewArticleOpen(false)}
                className="p-1 text-[#D0C5B4] hover:text-[#DBE1FD] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navamsha D9 Chart: Secrets of Marital Destiny"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>

              {/* Category Dropdown with "Other" */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                    Vedic Category
                  </label>
                  <select
                    value={isCustomArticleCategory ? '__other__' : articleCategory}
                    onChange={(e) => {
                      if (e.target.value === '__other__') {
                        setIsCustomArticleCategory(true);
                      } else {
                        setIsCustomArticleCategory(false);
                        setArticleCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#F6D186] font-semibold focus:outline-none focus:border-[#D8B56D]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.translations.hi})
                      </option>
                    ))}
                    <option value="__other__">➕ Other / Add Custom Category...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={articleReadTime}
                    onChange={(e) => setArticleReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                  />
                </div>
              </div>

              {/* Dynamic Multilingual Inputs if "Other" Selected */}
              {isCustomArticleCategory && (
                <div className="p-3.5 rounded-xl bg-[#141B2F] border border-[#D8B56D]/40 space-y-2.5 animate-fadeIn">
                  <span className="text-[11px] font-bold text-[#F6D186] flex items-center gap-1.5">
                    <Tags className="w-3.5 h-3.5 text-[#D8B56D]" /> Define Custom Multilingual Category
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#D0C5B4] block mb-0.5">English Name</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vastu Dosh Remedies"
                        value={customArticleCatEn}
                        onChange={(e) => setCustomArticleCatEn(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#181F33] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D0C5B4] block mb-0.5">Hindi (हिंदी)</span>
                      <input
                        type="text"
                        placeholder="e.g. वास्तु दोष निवारण"
                        value={customArticleCatHi}
                        onChange={(e) => setCustomArticleCatHi(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#181F33] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D0C5B4] block mb-0.5">Marathi (मराठी)</span>
                      <input
                        type="text"
                        placeholder="e.g. वास्तू दोष उपाय"
                        value={customArticleCatMr}
                        onChange={(e) => setCustomArticleCatMr(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#181F33] border border-[#27304A] text-xs text-[#DBE1FD] focus:border-[#D8B56D] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Article Markdown / Body Content
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write the full astrological analysis, sage references, and practical remedies..."
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] font-mono focus:outline-none focus:border-[#D8B56D]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27304A]">
              <button
                type="button"
                onClick={() => setIsNewArticleOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#D0C5B4] hover:bg-[#27304A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingArticle}
                className="px-5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer"
              >
                {submittingArticle ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: STANDALONE ADD CATEGORY */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleAddCategory}
            className="bg-[#181F33] border border-[#27304A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs sm:text-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#27304A]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D8B56D]" />
                <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                  Add Multilingual Category
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-1 text-[#D0C5B4] hover:text-[#DBE1FD] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Category Name (English / Primary)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gemstone Recommendations"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Hindi Label (हिंदी)
                </label>
                <input
                  type="text"
                  placeholder="e.g. रत्न परामर्श व उपाय"
                  value={newCatHi}
                  onChange={(e) => setNewCatHi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#DBE1FD] mb-1">
                  Marathi Label (मराठी)
                </label>
                <input
                  type="text"
                  placeholder="e.g. रत्न सल्ला व उपाय"
                  value={newCatMr}
                  onChange={(e) => setNewCatMr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2F] border border-[#27304A] text-xs text-[#DBE1FD] focus:outline-none focus:border-[#D8B56D]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27304A]">
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#D0C5B4] hover:bg-[#27304A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingCategory}
                className="px-5 py-2 rounded-xl bg-[#D8B56D] hover:bg-[#F6D186] text-[#10172B] font-bold text-xs transition-colors cursor-pointer"
              >
                {savingCategory ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
