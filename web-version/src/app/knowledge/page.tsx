'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { KNOWLEDGE_TOPICS } from '@/data/knowledge';

const CATEGORIES = [
  { id: 'all', label: 'সব' },
  { id: 'salah', label: 'সালাত' },
  { id: 'sawm', label: 'সাওম' },
  { id: 'sunnah', label: 'সুন্নাত' },
  { id: 'manners', label: 'শিষ্টাচার' },
  { id: 'zakat', label: 'যাকাত' },
];

export default function KnowledgePage() {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(KNOWLEDGE_TOPICS[0].id);

  const filtered = KNOWLEDGE_TOPICS.filter(
    (t) => selectedCat === 'all' || t.category === selectedCat
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 pb-24">
      {/* 1. Header Card matching Android app */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#E6DFD3] text-[#2C2523] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-[#2C2523]">ইসলামিক জ্ঞান ও শিক্ষা</h1>
            <p className="text-[11px] text-[#6E615D] font-medium">নামাজ, রোজা, সুন্নাত ও যাকাতের বিধান</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
          <Award className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Category Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-[#047857] text-white shadow-2xs'
                : 'bg-white text-[#6E615D] hover:bg-[#FAF8F3] border border-[#E6DFD3]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Topics Accordion */}
      <div className="space-y-3">
        {filtered.map((topic) => {
          const isExpanded = expandedId === topic.id;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-3xl border border-[#E6DFD3] shadow-xs overflow-hidden transition"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#FAF8F3] transition cursor-pointer"
              >
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#2C2523]">
                    {topic.titleBn}
                  </h2>
                  <p className="text-[11px] text-[#6E615D] mt-0.5">{topic.summaryBn}</p>
                </div>

                <div className="p-1.5 rounded-full bg-[#FAF8F3] text-[#2C2523] shrink-0 ml-3 border border-[#E6DFD3]">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-[#E6DFD3]/60 bg-[#FAF8F3]/50 space-y-3 text-xs sm:text-sm text-[#2C2523] animate-in fade-in duration-150">
                  <ul className="space-y-2">
                    {topic.points.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-[#E6DFD3]/60 text-[11px] text-[#8D7E7A]">
                    রেফারেন্স: {topic.reference}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
