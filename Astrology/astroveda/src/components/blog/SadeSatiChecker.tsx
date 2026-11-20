'use client';

import { useState } from 'react';

export default function SadeSatiChecker() {
  const [selectedRashi, setSelectedRashi] = useState('');

  const rashiData: Record<string, { status: string; phase: string; desc: string }> = {
    makar: {
      status: 'Active (Final Setting Phase)',
      phase: '3rd Phase (Setting)',
      desc: 'Saturn is transiting your 2nd house from the Moon. Focus on consolidation, speech moderation, and mindful financial stewardship. The most demanding karmic trials are subsiding.',
    },
    kumbha: {
      status: 'Active (Peak Janma Shani)',
      phase: '2nd Phase (Peak Core)',
      desc: 'Saturn is transiting directly over your natal Moon sign. Cultivate rigorous emotional detachment, physical discipline, and patient perseverance. Deep spiritual restructuring is underway.',
    },
    meen: {
      status: 'Active (Rising Phase)',
      phase: '1st Phase (Rising)',
      desc: 'Saturn is transiting your 12th house from the Moon. You may encounter heightened expenses, spiritual contemplation, and lifestyle shifts. Practice nightly meditation and ethical charity.',
    },
    mesha: {
      status: 'Inactive',
      phase: 'Approaching Shani Kantaka in future cycles',
      desc: 'You are currently not undergoing the 7.5-year Sade Sati cycle. Focus on building professional mastery and maintaining daily dharmic discipline.',
    },
    other: {
      status: 'Inactive',
      phase: 'Free of Sade Sati',
      desc: 'Your natal Moon sign is currently free from the primary 7.5-year Saturn transit cycle. Maintain auspicious karma and righteous conduct.',
    },
  };

  return (
    <div className="bg-[#141B2F] border border-[#27304A] p-5 rounded-xl flex flex-col gap-3 text-on-surface shadow-xs">
      <div>
        <span className="text-[10px] text-gold-accent uppercase tracking-widest font-bold">
          Interactive Utility
        </span>
        <h4 className="font-heading text-lg font-bold text-on-surface mt-0.5">
          Are You in Sade Sati?
        </h4>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Check your Janma Rashi (Moon Sign) against Saturn’s transit in Kumbha (Aquarius).
        </p>
      </div>

      <div className="pt-1 flex flex-col gap-2">
        <select
          value={selectedRashi}
          onChange={(e) => setSelectedRashi(e.target.value)}
          aria-label="Select Janma Rashi"
          className="w-full bg-[#181F33] border border-[#27304A] text-on-surface text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-gold-accent cursor-pointer"
        >
          <option value="">Select your Janma Rashi</option>
          <option value="makar">Makara (Capricorn) — 3rd Phase</option>
          <option value="kumbha">Kumbha (Aquarius) — Peak Phase</option>
          <option value="meen">Meena (Pisces) — 1st Phase</option>
          <option value="mesha">Mesha (Aries) — Approaching</option>
          <option value="other">Other Moon Signs (Inactive)</option>
        </select>

        {selectedRashi && (
          <div className="p-3.5 rounded-lg bg-[#181F33] border border-gold-accent/30 text-xs text-on-surface space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gold-accent">
                {rashiData[selectedRashi].phase}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-accent/15 text-gold-accent font-semibold">
                {rashiData[selectedRashi].status}
              </span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              {rashiData[selectedRashi].desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

