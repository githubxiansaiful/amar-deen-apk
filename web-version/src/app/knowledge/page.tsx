'use client';

import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { KNOWLEDGE_TOPICS } from '@/data/knowledge';

const CATEGORIES = [
  { id: 'all', label: 'সকল বিষয়' },
  { id: 'salah', label: 'সালাত ও নামাজ' },
  { id: 'sawm', label: 'সাওম ও রোজা' },
  { id: 'sunnah', label: 'দৈনন্দিন সুন্নাত' },
  { id: 'manners', label: 'ইসলামিক শিষ্টাচার' },
  { id: 'zakat', label: 'যাকাত ও সদকা' },
];

export default function KnowledgePage() {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(KNOWLEDGE_TOPICS[0].id);

  const filtered = KNOWLEDGE_TOPICS.filter(
    (t) => selectedCat === 'all' || t.category === selectedCat
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>দ্বীনি জ্ঞান ও ফিকহুল ইসলাম</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          ইসলামিক জ্ঞান ও মৌলিক শিক্ষা
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          নামাজের ফরজ-ওয়াজিব, রোজার নিয়ম, সুন্নাত আমল এবং দৈনন্দিন জীবনের প্রামাণ্য ইসলামিক বিধান।
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Topics Accordion List */}
      <div className="space-y-4">
        {filtered.map((topic) => {
          const isExpanded = expandedId === topic.id;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden transition"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    {topic.titleBn}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">{topic.summaryBn}</p>
                </div>

                <div className="p-2 rounded-full bg-emerald-50 text-emerald-800 shrink-0 ml-4">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/50 space-y-4 text-xs sm:text-sm text-gray-700 animate-in fade-in duration-200">
                  <ul className="space-y-2.5">
                    {topic.points.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-gray-200 text-[11px] text-gray-400">
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
