'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Bookmark, ChevronRight, Sparkles } from 'lucide-react';
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
    // Load surahs from public folder
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
    const matchesSearch =
      s.bengaliName.includes(searchTerm) ||
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.includes(searchTerm) ||
      s.number.toString() === searchTerm.trim();

    if (!matchesSearch) return false;
    if (filterType === 'ALL') return true;
    return s.revelationType === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>আল-কুরআনুল কারীম</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          পবিত্র কুরআনুল কারীম
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          সহজ ও সাবলীল বাংলা উচ্চারণ, নির্ভরযোগ্য বাংলা অনুবাদ এবং মিশারি আল-আফাসির সুললিত অডিও তেলাওয়াত সহ ১১৪টি পূর্ণাঙ্গ সূরা।
        </p>
      </div>

      {/* Resume Last Read Bookmark Banner */}
      {bookmark && (
        <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-400 text-emerald-950 rounded-2xl shadow-sm">
              <Bookmark className="w-6 h-6 fill-emerald-950" />
            </div>
            <div>
              <div className="text-xs text-emerald-200">সর্বশেষ পঠিত স্থান</div>
              <div className="text-lg font-bold text-white">
                সূরা {bookmark.surahNameBn} • আয়াত {toBengaliDigits(bookmark.ayahNumber)}
              </div>
            </div>
          </div>

          <Link
            href={`/quran/${bookmark.surahNumber}#ayah-${bookmark.ayahNumber}`}
            className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-emerald-50 text-emerald-900 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm"
          >
            <span>পড়া শুরু করুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="সূরার নাম বা নম্বর খুঁজুন (যেমন: ফাতিহা, ১৮, কাহফ)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden transition shadow-xs"
          />
        </div>

        {/* Makki / Madani Filter Tabs */}
        <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl transition ${
              filterType === 'ALL'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            সব ({toBengaliDigits(114)})
          </button>
          <button
            onClick={() => setFilterType('Meccan')}
            className={`px-4 py-2 rounded-xl transition ${
              filterType === 'Meccan'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            মাক্কী
          </button>
          <button
            onClick={() => setFilterType('Medinan')}
            className={`px-4 py-2 rounded-xl transition ${
              filterType === 'Medinan'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            মাদানী
          </button>
        </div>
      </div>

      {/* Surah Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500">
          কোনো সূরা পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((surah) => {
            const isMeccan = surah.revelationType === 'Meccan';

            return (
              <Link
                key={surah.number}
                href={`/quran/${surah.number}`}
                className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                {/* Left: Number & Bengali Name */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-sm border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition">
                    {toBengaliDigits(surah.number)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition">
                      {surah.bengaliName}
                    </h3>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {surah.englishName} • {toBengaliDigits(surah.numberOfAyahs)} আয়াত
                    </div>
                  </div>
                </div>

                {/* Right: Arabic Calligraphy & Badge */}
                <div className="text-right">
                  <div className="font-arabic text-xl text-emerald-900 group-hover:text-emerald-700 transition">
                    {surah.name}
                  </div>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      isMeccan
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-teal-50 text-teal-800'
                    }`}
                  >
                    {isMeccan ? 'মাক্কী' : 'মাদানী'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
