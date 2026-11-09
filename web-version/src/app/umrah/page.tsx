'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckSquare, Square, Check, BookOpen, Lightbulb } from 'lucide-react';
import { UMRAH_STEPS, UMRAH_CHECKLIST } from '@/data/umrah';
import { getStoredUmrahChecklist, toggleStoredUmrahChecklist } from '@/lib/storage';
import { toBengaliDigits } from '@/lib/utils';

export default function UmrahPage() {
  const [activeTab, setActiveTab] = useState<'steps' | 'checklist'>('steps');
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecklistState(getStoredUmrahChecklist());
  }, []);

  const handleToggleChecklist = (id: string) => {
    const updated = toggleStoredUmrahChecklist(id);
    setChecklistState(updated);
  };

  const completedCount = Object.values(checklistState).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>পবিত্র উমরাহ ও হজ নির্দেশিকা</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          সহজ উমরাহ গাইডলাইন
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          রাসূলুল্লাহ ﷺ এর সুন্নাত অনুযায়ী উমরার ৫টি ধারাবাহিক আমল, প্রয়োজনীয় দোয়া ও ট্রাভেল চেকলিস্ট।
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            উমরার ৫টি মূল ধাপ
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            প্রয়োজনীয় মালামালের চেকলিস্ট ({toBengaliDigits(completedCount)}/{toBengaliDigits(UMRAH_CHECKLIST.length)})
          </button>
        </div>
      </div>

      {/* STEPS VIEW */}
      {activeTab === 'steps' && (
        <div className="space-y-6">
          {UMRAH_STEPS.map((step) => (
            <article
              key={step.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4"
            >
              {/* Step Header */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  {step.titleBn}
                </h2>
                <div className="text-xs text-amber-700 font-semibold mt-0.5">
                  {step.subtitleBn}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {step.descBn}
              </p>

              {/* Duas for this step */}
              {step.duas && step.duas.length > 0 && (
                <div className="space-y-3 pt-2">
                  {step.duas.map((d, i) => (
                    <div
                      key={i}
                      className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 space-y-2"
                    >
                      <div className="text-right font-arabic text-xl sm:text-2xl text-emerald-950 leading-loose">
                        {d.arabic}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong className="text-amber-800 block text-[11px] mb-0.5">
                          উচ্চারণ:
                        </strong>
                        {d.pronunciationBn}
                      </div>
                      <div className="text-xs text-gray-900 font-medium">
                        <strong className="text-emerald-800 block text-[11px] mb-0.5">
                          অর্থ:
                        </strong>
                        {d.meaningBn}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips for this step */}
              {step.tips && step.tips.length > 0 && (
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 text-xs text-amber-950 space-y-1.5">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-900 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>বিশেষ সতর্কতা ও পরামর্শ:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {step.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* CHECKLIST VIEW */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                উমরাহ যাত্রার সামগ্রী তালিকা
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                আপনার ব্যাগে নেওয়া সামগ্রীগুলোতে টিক চিহ্ন দিন
              </p>
            </div>
            <div className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
              {toBengaliDigits(completedCount)} / {toBengaliDigits(UMRAH_CHECKLIST.length)} সম্পন্ন
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {UMRAH_CHECKLIST.map((item) => {
              const isChecked = Boolean(checklistState[item.id]);

              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className="w-full py-3.5 flex items-center justify-between text-left hover:bg-gray-50 rounded-xl px-2 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-sm ${
                        isChecked ? 'line-through text-gray-400 font-normal' : 'text-gray-800 font-medium'
                      }`}
                    >
                      {item.titleBn}
                    </span>
                  </div>

                  <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                    {item.categoryBn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
