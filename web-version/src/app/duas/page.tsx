'use client';

import React, { useState } from 'react';
import {
  Heart,
  Search,
  Sunrise,
  Clock,
  Compass,
  Shield,
  Utensils,
  Plane,
  Users,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { DUA_CATEGORIES, DUAS } from '@/data/duas';
import { AZKAR_LIST } from '@/data/azkar';
import { toBengaliDigits } from '@/lib/utils';
import { DuaItem, ZikrItem } from '@/lib/types';

export default function DuasPage() {
  const [activeTab, setActiveTab] = useState<'duas' | 'azkar'>('duas');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Azkar counters state
  const [azkarCounts, setAzkarCounts] = useState<Record<string, number>>({});
  const [azkarFilter, setAzkarFilter] = useState<'ALL' | 'MORNING' | 'EVENING' | 'GENERAL'>('ALL');

  const handleCopy = (dua: DuaItem) => {
    if (typeof navigator !== 'undefined') {
      const text = `${dua.titleBn}\n\n${dua.arabic}\n\nউচ্চারণ: ${dua.transliteration}\n\nঅনুবাদ: ${dua.translationBn}\n\nউৎস: ${dua.reference}`;
      navigator.clipboard.writeText(text);
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleIncrementAzkar = (id: string, target: number) => {
    setAzkarCounts((prev) => {
      const current = prev[id] || 0;
      return {
        ...prev,
        [id]: current >= target ? 0 : current + 1,
      };
    });
  };

  const handleResetAzkar = (id: string) => {
    setAzkarCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const filteredDuas = DUAS.filter((d) => {
    const matchesCat = selectedCategory === 'all' || d.categorySlug === selectedCategory;
    const matchesSearch =
      d.titleBn.includes(searchTerm) ||
      d.translationBn.includes(searchTerm) ||
      d.transliteration.includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  const filteredAzkar = AZKAR_LIST.filter((z) => {
    const matchesFilter = azkarFilter === 'ALL' || z.timeOfDay === azkarFilter;
    const matchesSearch =
      z.titleBn.includes(searchTerm) ||
      z.translationBn.includes(searchTerm) ||
      z.transliteration.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5" />
          <span>সহিহ মাসনূন দোয়া ও জিকির</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          দোয়া ও দৈনন্দিন জিকির
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          পবিত্র কুরআন ও সহিহ হাদিস বর্ণিত দৈনন্দিন জীবনের সকল দোয়া এবং সকাল-সন্ধ্যার হেফাজতের জিকির।
        </p>
      </div>

      {/* Main Mode Tabs: Duas vs Azkar */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('duas')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'duas'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            মাসনূন দোয়া সমূহ ({toBengaliDigits(DUAS.length)})
          </button>
          <button
            onClick={() => setActiveTab('azkar')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'azkar'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            সকাল ও সন্ধ্যার জিকির ({toBengaliDigits(AZKAR_LIST.length)})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-lg mx-auto">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="দোয়া বা বিষয়ের নাম দিয়ে খুঁজুন (যেমন: ক্ষমা, ঘুম, খাবার)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden transition shadow-xs"
        />
      </div>

      {/* DUAS VIEW */}
      {activeTab === 'duas' && (
        <div className="space-y-6">
          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              সকল ক্যাটাগরি
            </button>
            {DUA_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {cat.nameBn}
                </button>
              );
            })}
          </div>

          {/* Duas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDuas.map((dua) => {
              const isCopied = copiedId === dua.id;

              return (
                <article
                  key={dua.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:border-emerald-200 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Title & Copy */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="font-bold text-gray-900 text-base leading-snug">
                        {dua.titleBn}
                      </h3>
                      <button
                        onClick={() => handleCopy(dua)}
                        className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer shrink-0"
                        title="অনুলিপি করুন"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-right font-arabic text-xl sm:text-2xl text-emerald-950 leading-loose mb-4">
                      {dua.arabic}
                    </div>

                    {/* Transliteration & Meaning */}
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p className="text-gray-600 leading-relaxed">
                        <strong className="text-amber-800 block text-[11px] uppercase tracking-wider mb-0.5">
                          উচ্চারণ:
                        </strong>
                        {dua.transliteration}
                      </p>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        <strong className="text-emerald-800 block text-[11px] uppercase tracking-wider mb-0.5">
                          অনুবাদ:
                        </strong>
                        {dua.translationBn}
                      </p>
                    </div>
                  </div>

                  {/* Reference Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                    <span>{dua.reference}</span>
                    <span className="text-emerald-700 font-semibold">{dua.source}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* AZKAR VIEW */}
      {activeTab === 'azkar' && (
        <div className="space-y-6">
          {/* Azkar Filters */}
          <div className="flex items-center space-x-2">
            {[
              { id: 'ALL', label: 'সব জিকির' },
              { id: 'MORNING', label: 'সকালের জিকির' },
              { id: 'EVENING', label: 'সন্ধ্যার জিকির' },
              { id: 'GENERAL', label: 'সার্বক্ষণিক জিকির' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAzkarFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  azkarFilter === f.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Azkar List with Interactive Click Counter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAzkar.map((zikr) => {
              const currentCount = azkarCounts[zikr.id] || 0;
              const isFinished = currentCount >= zikr.countTarget;

              return (
                <article
                  key={zikr.id}
                  className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between ${
                    isFinished ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-gray-100 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-base">
                        {zikr.titleBn}
                      </h3>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-100">
                        লক্ষ্য: {toBengaliDigits(zikr.countTarget)} বার
                      </span>
                    </div>

                    <div className="text-right font-arabic text-xl sm:text-2xl text-emerald-950 leading-loose mb-4">
                      {zikr.arabic}
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <p className="text-gray-600 leading-relaxed">
                        <strong className="text-amber-800 block text-[11px] mb-0.5">
                          উচ্চারণ:
                        </strong>
                        {zikr.transliteration}
                      </p>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        <strong className="text-emerald-800 block text-[11px] mb-0.5">
                          অনুবাদ:
                        </strong>
                        {zikr.translationBn}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Counter Footer */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{zikr.reference}</span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleResetAzkar(zikr.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                        title="রিসেট"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleIncrementAzkar(zikr.id, zikr.countTarget)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                          isFinished
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <span>
                          {toBengaliDigits(currentCount)} / {toBengaliDigits(zikr.countTarget)}
                        </span>
                        {isFinished && <Check className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
