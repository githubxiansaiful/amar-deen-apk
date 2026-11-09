'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Check, Lightbulb } from 'lucide-react';
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
            <h1 className="text-lg font-black text-[#2C2523]">উমরাহ নির্দেশিকা</h1>
            <p className="text-[11px] text-[#6E615D] font-medium">৫টি ধারাবাহিক আমল ও ট্রাভেল চেকলিস্ট</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white p-1 rounded-2xl border border-[#E6DFD3] shadow-2xs">
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#6E615D] hover:text-[#2C2523]'
            }`}
          >
            উমরার ৫টি ধাপ
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-[#047857] text-white shadow-xs'
                : 'text-[#6E615D] hover:text-[#2C2523]'
            }`}
          >
            চেকলিস্ট ({toBengaliDigits(completedCount)}/{toBengaliDigits(UMRAH_CHECKLIST.length)})
          </button>
        </div>
      </div>

      {/* 3. Steps View */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          {UMRAH_STEPS.map((step) => (
            <article
              key={step.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs space-y-3"
            >
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#2C2523]">
                  {step.titleBn}
                </h2>
                <span className="text-[11px] text-[#D97706] font-bold mt-0.5 block">
                  {step.subtitleBn}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#2C2523] leading-relaxed">
                {step.descBn}
              </p>

              {step.duas && step.duas.length > 0 && (
                <div className="space-y-2 pt-1">
                  {step.duas.map((d, i) => (
                    <div
                      key={i}
                      className="bg-[#ECFDF5] rounded-2xl p-4 border border-[#047857]/20 space-y-2"
                    >
                      <div className="text-right font-arabic text-2xl text-[#047857] leading-loose">
                        {d.arabic}
                      </div>
                      <div className="text-xs text-[#2C2523]">
                        <strong className="text-[#D97706] block text-[10px] uppercase mb-0.5">
                          উচ্চারণ:
                        </strong>
                        {d.pronunciationBn}
                      </div>
                      <div className="text-xs text-[#2C2523]">
                        <strong className="text-[#047857] block text-[10px] uppercase mb-0.5">
                          অর্থ:
                        </strong>
                        {d.meaningBn}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step.tips && step.tips.length > 0 && (
                <div className="bg-[#FFFBEB] rounded-2xl p-3.5 border border-[#FDE68A] text-xs text-[#2C2523] space-y-1">
                  <div className="font-bold flex items-center space-x-1.5 text-[#D97706] mb-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>বিশেষ পরামর্শ:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[#6E615D]">
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

      {/* 4. Checklist View */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]/60">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#2C2523]">
                উমরাহ যাত্রার সামগ্রী তালিকা
              </h2>
              <p className="text-[11px] text-[#8D7E7A]">ব্যাগে নেওয়া জিনিসে টিক দিন</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#ECFDF5] text-[#047857] rounded-xl border border-[#047857]/20">
              {toBengaliDigits(completedCount)} / {toBengaliDigits(UMRAH_CHECKLIST.length)}
            </span>
          </div>

          <div className="divide-y divide-[#E6DFD3]/60">
            {UMRAH_CHECKLIST.map((item) => {
              const isChecked = Boolean(checklistState[item.id]);

              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className="w-full py-3 flex items-center justify-between text-left hover:bg-[#FAF8F3] rounded-xl px-2 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        isChecked
                          ? 'bg-[#047857] border-[#047857] text-white'
                          : 'border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs sm:text-sm ${
                        isChecked ? 'line-through text-[#8D7E7A]' : 'text-[#2C2523] font-medium'
                      }`}
                    >
                      {item.titleBn}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#8D7E7A] bg-[#FAF8F3] px-2 py-0.5 rounded-md border border-[#E6DFD3]">
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
