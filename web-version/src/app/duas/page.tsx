'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Search,
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { DUA_CATEGORIES, DUAS } from '@/data/duas';
import { AZKAR_LIST } from '@/data/azkar';
import { toBengaliDigits } from '@/lib/utils';
import { DuaItem } from '@/lib/types';

export default function DuasPage() {
  const [activeTab, setActiveTab] = useState<'duas' | 'azkar'>('duas');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
    const q = searchTerm.trim().toLowerCase();
    const matchesCat = selectedCategory === 'all' || d.categorySlug === selectedCategory;
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (d.titleBn.toLowerCase().includes(q) ||
        d.translationBn.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q))
    );
  });

  const filteredAzkar = AZKAR_LIST.filter((z) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesFilter = azkarFilter === 'ALL' || z.timeOfDay === azkarFilter;
    if (!q) return matchesFilter;
    return (
      matchesFilter &&
      (z.titleBn.toLowerCase().includes(q) ||
        z.translationBn.toLowerCase().includes(q) ||
        z.transliteration.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 pb-24">
      {/* 1. Header Card (matching Android app) */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#E6DFD3] text-[#2C2523] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-[#2C2523]">দোয়া ও যিকির</h1>
            <p className="text-[11px] text-[#6E615D] font-medium">সহিহ হাদিস ভিত্তিক দৈনন্দিন আমল</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
          <Heart className="w-4 h-4 fill-[#D97706]" />
        </div>
      </div>

      {/* 2. Mode Switch: Duas vs Azkar */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white p-1 rounded-2xl border border-[#E6DFD3] shadow-2xs">
          <button
            onClick={() => setActiveTab('duas')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'duas'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#6E615D] hover:text-[#2C2523]'
            }`}
          >
            মাসনূন দোয়া ({toBengaliDigits(DUAS.length)})
          </button>
          <button
            onClick={() => setActiveTab('azkar')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'azkar'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#6E615D] hover:text-[#2C2523]'
            }`}
          >
            সকাল-সন্ধ্যার যিকির ({toBengaliDigits(AZKAR_LIST.length)})
          </button>
        </div>
      </div>

      {/* 3. Search Field */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D7E7A]" />
        <input
          type="text"
          placeholder="দোয়া বা বিষয়ের নাম দিয়ে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6DFD3] rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#047857] transition text-[#2C2523]"
        />
      </div>

      {/* DUAS VIEW */}
      {activeTab === 'duas' && (
        <div className="space-y-3">
          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'bg-white text-[#6E615D] hover:bg-[#FAF8F3] border border-[#E6DFD3]'
              }`}
            >
              সব
            </button>
            {DUA_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#047857] text-white shadow-2xs'
                      : 'bg-white text-[#6E615D] hover:bg-[#FAF8F3] border border-[#E6DFD3]'
                  }`}
                >
                  {cat.nameBn}
                </button>
              );
            })}
          </div>

          {/* Duas List */}
          <div className="space-y-3">
            {filteredDuas.map((dua) => {
              const isCopied = copiedId === dua.id;

              return (
                <article
                  key={dua.id}
                  className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-base text-[#2C2523]">
                      {dua.titleBn}
                    </h2>
                    <button
                      onClick={() => handleCopy(dua)}
                      className="p-1.5 text-[#6E615D] hover:text-[#047857] hover:bg-[#ECFDF5] rounded-xl transition cursor-pointer shrink-0"
                      title="অনুলিপি"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-[#047857]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="py-2 text-right font-arabic text-2xl text-[#047857] leading-loose">
                    {dua.arabic}
                  </div>

                  {/* Pronunciation & Translation Strips */}
                  <div className="space-y-2">
                    <div className="bg-[#F5EFE4] rounded-2xl p-3 border border-[#E6DFD3]/60">
                      <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider block mb-0.5">
                        উচ্চারণ
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-[#2C2523] leading-relaxed">
                        {dua.transliteration}
                      </p>
                    </div>

                    <div className="bg-[#FAF7EE] rounded-2xl p-3 border border-[#E6DFD3]/60">
                      <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block mb-0.5">
                        অনুবাদ
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-[#2C2523] leading-relaxed">
                        {dua.translationBn}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-[#8D7E7A] flex items-center justify-between border-t border-[#E6DFD3]/60">
                    <span>{dua.reference}</span>
                    <span className="font-bold text-[#047857]">{dua.source}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* AZKAR VIEW */}
      {activeTab === 'azkar' && (
        <div className="space-y-3">
          {/* Azkar Filters */}
          <div className="flex items-center space-x-2">
            {[
              { id: 'ALL', label: 'সব' },
              { id: 'MORNING', label: 'সকাল' },
              { id: 'EVENING', label: 'সন্ধ্যা' },
              { id: 'GENERAL', label: 'সার্বক্ষণিক' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAzkarFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  azkarFilter === f.id
                    ? 'bg-[#047857] text-white shadow-2xs'
                    : 'bg-white text-[#6E615D] border border-[#E6DFD3] hover:bg-[#FAF8F3]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Azkar List */}
          <div className="space-y-3">
            {filteredAzkar.map((zikr) => {
              const currentCount = azkarCounts[zikr.id] || 0;
              const isFinished = currentCount >= zikr.countTarget;

              return (
                <article
                  key={zikr.id}
                  className={`bg-white rounded-3xl p-5 border transition ${
                    isFinished
                      ? 'border-[#047857] ring-1 ring-[#047857]/30 shadow-xs'
                      : 'border-[#E6DFD3] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-sm sm:text-base text-[#2C2523]">
                      {zikr.titleBn}
                    </h2>
                    <span className="px-2 py-0.5 bg-[#FAF8F3] text-[#047857] text-[11px] font-bold rounded-lg border border-[#E6DFD3]">
                      লক্ষ্য: {toBengaliDigits(zikr.countTarget)} বার
                    </span>
                  </div>

                  <div className="py-2 text-right font-arabic text-2xl text-[#047857] leading-loose">
                    {zikr.arabic}
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#F5EFE4] rounded-2xl p-3 border border-[#E6DFD3]/60 text-xs sm:text-sm font-medium text-[#2C2523]">
                      {zikr.transliteration}
                    </div>
                    <div className="bg-[#FAF7EE] rounded-2xl p-3 border border-[#E6DFD3]/60 text-xs sm:text-sm font-bold text-[#2C2523]">
                      {zikr.translationBn}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E6DFD3]/60 flex items-center justify-between mt-3">
                    <span className="text-[11px] text-[#8D7E7A]">{zikr.reference}</span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleResetAzkar(zikr.id)}
                        className="p-1.5 text-[#8D7E7A] hover:text-[#2C2523] rounded-lg hover:bg-[#FAF8F3] transition"
                        title="রিসেট"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleIncrementAzkar(zikr.id, zikr.countTarget)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition cursor-pointer ${
                          isFinished
                            ? 'bg-[#047857] text-white'
                            : 'bg-[#ECFDF5] text-[#047857] border border-[#047857]/30'
                        }`}
                      >
                        <span>
                          {toBengaliDigits(currentCount)} / {toBengaliDigits(zikr.countTarget)}
                        </span>
                        {isFinished && <Check className="w-3 h-3" />}
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
