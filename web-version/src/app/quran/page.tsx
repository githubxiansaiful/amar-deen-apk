'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Bookmark, ChevronRight } from 'lucide-react';
import { SurahMeta } from '@/lib/types';
import { toBengaliDigits } from '@/lib/utils';
import { getStoredBookmark, QuranBookmark } from '@/lib/storage';

export default function QuranListPage() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'Meccan' | 'Medinan'>('ALL');
  const [bookmark, setBookmark] = useState<QuranBookmark | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/quran/surahs.json')
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load surahs', err);
        setLoading(false);
      });

    setBookmark(getStoredBookmark());
  }, []);

  const filtered = surahs.filter((s) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesFilter = filterType === 'ALL' || s.revelationType === filterType;
    if (!q) return matchesFilter;

    const matchesSearch =
      s.number.toString() === q ||
      s.bengaliName.toLowerCase().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 pb-24">
      {/* 1. Header Banner Card (matching Android app QuranListScreen) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs space-y-3">
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#E6DFD3] text-xs font-bold text-[#047857]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>আল-কুরআনুল কারীম</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-[#2C2523] tracking-tight">
          পবিত্র কুরআনুল কারীম
        </h1>
        <p className="text-xs sm:text-sm text-[#6E615D] font-medium leading-relaxed">
          সহজ সরল বাংলা উচ্চারণ ও অর্থ সহ ১১৪টি পূর্ণাঙ্গ সূরা।
        </p>

        {/* Search Field */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D7E7A]" />
          <input
            type="text"
            placeholder="সূরার নাম বা নম্বর দিয়ে খুঁজুন (যেমন: ১, বাকারা)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-[#E6DFD3] rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#047857] transition text-[#2C2523]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 pt-1">
          {[
            { id: 'ALL', label: `সব (${toBengaliDigits(114)})` },
            { id: 'Meccan', label: 'মাক্কী' },
            { id: 'Medinan', label: 'মাদানী' },
          ].map((tab) => {
            const isSelected = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#047857] text-white shadow-2xs'
                    : 'bg-[#FAF8F3] text-[#6E615D] border border-[#E6DFD3] hover:bg-[#F3EFE6]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Last Read Bookmark Card (if present) */}
      {bookmark && (
        <div className="bg-[#ECFDF5] border border-[#047857]/30 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#047857] text-white flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#047857]">
                সর্বশেষ পঠিত স্থান
              </div>
              <div className="text-sm font-bold text-[#2C2523]">
                সূরা {bookmark.surahNameBn} • আয়াত {toBengaliDigits(bookmark.ayahNumber)}
              </div>
            </div>
          </div>

          <Link
            href={`/quran/${bookmark.surahNumber}#ayah-${bookmark.ayahNumber}`}
            className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1"
          >
            <span>পড়ুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Surahs List */}
      <div className="space-y-2.5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-18 bg-white rounded-2xl border border-[#E6DFD3] animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8D7E7A] bg-white rounded-3xl border border-[#E6DFD3]">
            কোনো সূরা পাওয়া যায়নি।
          </div>
        ) : (
          filtered.map((surah) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E6DFD3] hover:border-[#047857]/40 shadow-xs hover:shadow-xs transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                {/* Number Badge */}
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E6DFD3] text-[#2C2523] font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-[#047857] group-hover:text-white transition">
                  {toBengaliDigits(surah.number)}
                </div>

                {/* Name & Ayah Count */}
                <div>
                  <h2 className="text-base font-bold text-[#2C2523] group-hover:text-[#047857] transition leading-tight">
                    {surah.bengaliName}
                  </h2>
                  <p className="text-[11px] text-[#6E615D] mt-0.5 font-medium">
                    {toBengaliDigits(surah.numberOfAyahs)} টি আয়াত •{' '}
                    {surah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                  </p>
                </div>
              </div>

              {/* Arabic Calligraphy Name */}
              <div className="font-arabic text-2xl text-[#2C2523] group-hover:text-[#047857] transition">
                {surah.name}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
