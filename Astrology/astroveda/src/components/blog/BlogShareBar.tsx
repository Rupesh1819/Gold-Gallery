'use client';

import { MessageCircle, Copy } from 'lucide-react';

export default function BlogShareBar({ title }: { title: string }) {
  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#141B2F] border border-[#27304A] p-4 rounded-xl shadow-xs flex items-center justify-between">
      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
        Share Insight
      </span>
      <div className="flex items-center gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-[#181F33] border border-[#27304A] flex items-center justify-center text-on-surface hover:text-gold-accent hover:border-gold-accent transition-all cursor-pointer"
          title="Share via WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
        <button
          onClick={handleCopy}
          className="w-8 h-8 rounded-full bg-[#181F33] border border-[#27304A] flex items-center justify-center text-on-surface hover:text-gold-accent hover:border-gold-accent transition-all cursor-pointer"
          title="Copy Article Link"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

