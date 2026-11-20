'use client';

import { useState } from 'react';
import { testimonialsList } from '@/data/testimonials';
import { MessageSquare, Star, CheckCircle } from 'lucide-react';

export default function TestimonialsAdminPage() {
  const [reviews] = useState(testimonialsList);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-[#27304A]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-semibold mb-2">
          <span>VERIFIED SEEKER TESTIMONIALS</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
          Testimonials Approval
        </h1>
        <p className="text-xs text-[#D0C5B4] mt-0.5">
          Only genuine, consented customer reviews can be approved for publication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-[#181F33] rounded-2xl p-6 border border-[#27304A] shadow-sm space-y-4 hover:border-[#D8B56D]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#DBE1FD]">{r.name}</span>
              <span className="text-xs font-semibold text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/25">
                <CheckCircle className="h-3 w-3" /> Consented
              </span>
            </div>

            <div className="flex items-center gap-1 text-[#F6D186]">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[#F6D186] text-[#F6D186]" />
              ))}
            </div>

            <p className="text-xs text-[#D0C5B4] italic leading-relaxed font-body">
              &ldquo;{r.quote}&rdquo;
            </p>

            <div className="text-[11px] text-[#D0C5B4]/60 pt-2 border-t border-[#27304A]">
              Location: {r.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
