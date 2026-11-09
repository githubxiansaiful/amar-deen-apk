'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Settings,
  MapPin,
  Compass,
  Sparkles,
  BookOpen,
  Moon,
  Calendar,
  Award,
  Bookmark,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  getStoredCity,
  setStoredCity,
  getStoredMadhab,
  setStoredMadhab,
  getStoredCalcMethod,
  setStoredCalcMethod,
} from '@/lib/storage';
import { CityOption, MadhabOption, CalculationMethodOption } from '@/lib/types';
import { DEFAULT_CITY } from '@/data/cities';
import CitySelectorModal from '@/components/CitySelectorModal';
import SectionHeader from '@/components/SectionHeader';

const CALC_METHODS: { id: CalculationMethodOption; nameBn: string; descBn: string }[] = [
  {
    id: 'KARACHI',
    nameBn: 'ইসলামিক ইউনিভার্সিটি করাচি (Karachi)',
    descBn: 'বাংলাদেশ ও ভারতীয় উপমহাদেশে সর্বাধিক প্রচলিত।',
  },
  {
    id: 'MUSLIM_WORLD_LEAGUE',
    nameBn: 'মুসলিম ওয়ার্ল্ড লীগ (Muslim World League)',
    descBn: 'আন্তর্জাতিক ইসলামিক সংস্থা ও ইউরোপে প্রচলিত।',
  },
  {
    id: 'UMM_AL_QURA',
    nameBn: 'উম্মুল কুরা মক্কা মুকাররমা (Umm al-Qura)',
    descBn: 'সৌদি আরব ও উপসাগরীয় দেশসমূহে অনুসৃত।',
  },
  {
    id: 'EGYPTIAN',
    nameBn: 'মিশরীয় জরিপ কর্তৃপক্ষ (Egyptian Survey)',
    descBn: 'মিশর ও উত্তর আফ্রিকায় অনুসৃত মানদণ্ড।',
  },
  {
    id: 'DUBAI',
    nameBn: 'দুবাই ইসলামিক কর্তৃপক্ষ (Dubai)',
    descBn: 'সংযুক্ত আরব আমিরাত অনুসৃত মানদণ্ড।',
  },
];

export default function SettingsPage() {
  const [city, setCity] = useState<CityOption>(DEFAULT_CITY);
  const [madhab, setMadhab] = useState<MadhabOption>('HANAFI');
  const [calcMethod, setCalcMethod] = useState<CalculationMethodOption>('KARACHI');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setCity(getStoredCity());
    setMadhab(getStoredMadhab());
    setCalcMethod(getStoredCalcMethod());
  }, []);

  const handleMadhabChange = (m: MadhabOption) => {
    setMadhab(m);
    setStoredMadhab(m);
    triggerNotice();
  };

  const handleMethodChange = (method: CalculationMethodOption) => {
    setCalcMethod(method);
    setStoredCalcMethod(method);
    triggerNotice();
  };

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 pb-24">
      {/* 1. Header Card (matching Android app MoreScreen) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#E6DFD3] shadow-xs shrink-0">
            <Image
              src="/app_icon.png"
              alt="আমার দ্বীন"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#2C2523] leading-tight">
              আমার দ্বীন
            </h1>
            <p className="text-xs text-[#6E615D] font-medium mt-0.5">
              Amar Deen • সংস্করণ ১.০.১ (মুক্ত ও বিজ্ঞাপনহীন)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCityModalOpen(true)}
          className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#E6DFD3] rounded-xl text-xs font-bold text-[#047857] transition cursor-pointer"
        >
          📍 {city.nameBn} ⌵
        </button>
      </div>

      {savedNotice && (
        <div className="bg-[#047857] text-white px-4 py-2 rounded-2xl text-xs font-bold text-center shadow-xs animate-in fade-in duration-150">
          ✓ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!
        </div>
      )}

      {/* 2. ইবাদত ও প্রাত্যহিক আমল */}
      <div className="pt-2">
        <SectionHeader
          title="ইবাদত ও প্রাত্যহিক আমল"
          accentColor="#047857"
          subtitle="নামাজ, কিবলা, তাসবিহ ও যিকির"
        />
        <div className="mt-2 bg-white rounded-3xl border border-[#E6DFD3] shadow-xs overflow-hidden divide-y divide-[#E6DFD3]/60">
          <Link
            href="/prayer"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">নামাজের সময়সূচি</div>
                <div className="text-[11px] text-[#6E615D]">আজকের ওয়াক্ত, নিষিদ্ধ সময় ও নফল সালাত</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>

          <Link
            href="/tasbih"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">ডিজিটাল তাসবিহ</div>
                <div className="text-[11px] text-[#6E615D]">সহজ ট্যাপ কাউন্টার ও প্রিসেট যিকির</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>

          <Link
            href="/qibla"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">কিবলা কম্পাস</div>
                <div className="text-[11px] text-[#6E615D]">নির্ভুল কাবার দিকদর্শন ও ভৌগোলিক কোণ</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>

          <Link
            href="/duas"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">মাসনূন দোয়া ও যিকির</div>
                <div className="text-[11px] text-[#6E615D]">সকাল-সন্ধ্যার হেফাজত ও দৈনন্দিন দোয়া</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>
        </div>
      </div>

      {/* 3. কুরআন ও শিক্ষা */}
      <div className="pt-2">
        <SectionHeader
          title="কুরআন ও শিক্ষা"
          accentColor="#D97706"
          subtitle="পবিত্র কুরআন ও মৌলিক জ্ঞান"
        />
        <div className="mt-2 bg-white rounded-3xl border border-[#E6DFD3] shadow-xs overflow-hidden divide-y divide-[#E6DFD3]/60">
          <Link
            href="/quran"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">পবিত্র কুরআনুল কারীম</div>
                <div className="text-[11px] text-[#6E615D]">১১৪টি পূর্ণাঙ্গ সূরা, বাংলা উচ্চারণ ও অর্থ</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>

          <Link
            href="/knowledge"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">ইসলামিক জ্ঞান ও শিক্ষা</div>
                <div className="text-[11px] text-[#6E615D]">নামাজের ১৪ ফরজ, ওয়াজিব ও সুন্নাত বিধান</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>

          <Link
            href="/ramadan"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">রমজান ও সিয়াম</div>
                <div className="text-[11px] text-[#6E615D]">সেহরি, ইফতার ও রোজার বিধিবিধান</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>

          <Link
            href="/umrah"
            className="p-4 flex items-center justify-between hover:bg-[#FAF8F3] transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#2C2523]">সহজ উমরাহ গাইড</div>
                <div className="text-[11px] text-[#6E615D]">উমরার ৫ ধাপ ও ট্রাভেল চেকলিস্ট</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8D7E7A]" />
          </Link>
        </div>
      </div>

      {/* 4. মাযহাব ও হিসাব পদ্ধতি সেটিংস */}
      <div className="pt-2">
        <SectionHeader
          title="হিসাব পদ্ধতি ও মাযহাব"
          accentColor="#047857"
          subtitle="নামাজের নির্ভুল গণনার নিয়ম"
        />

        <div className="mt-2 space-y-3">
          {/* Madhab Choice */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#2C2523] block">
              আসরের ওয়াক্ত (মাযহাব নির্বাচন):
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleMadhabChange('HANAFI')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                  madhab === 'HANAFI'
                    ? 'border-[#047857] bg-[#ECFDF5] font-bold text-[#047857]'
                    : 'border-[#E6DFD3] bg-[#FAF8F3] text-[#6E615D]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">হানাফি (Hanafi)</div>
                  <div className="text-[10px] text-[#8D7E7A]">ছায়া দ্বিগুণ</div>
                </div>
                {madhab === 'HANAFI' && <Check className="w-4 h-4 text-[#047857]" />}
              </button>

              <button
                onClick={() => handleMadhabChange('SHAFI')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                  madhab === 'SHAFI'
                    ? 'border-[#047857] bg-[#ECFDF5] font-bold text-[#047857]'
                    : 'border-[#E6DFD3] bg-[#FAF8F3] text-[#6E615D]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">শাফেঈ / জমহুর</div>
                  <div className="text-[10px] text-[#8D7E7A]">ছায়া একগুণ</div>
                </div>
                {madhab === 'SHAFI' && <Check className="w-4 h-4 text-[#047857]" />}
              </button>
            </div>
          </div>

          {/* Calc Method Choice */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#2C2523] block">
              হিসাব পদ্ধতি (Calculation Method):
            </span>

            <div className="space-y-1.5">
              {CALC_METHODS.map((m) => {
                const isSelected = calcMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleMethodChange(m.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#047857] bg-[#ECFDF5] font-bold text-[#047857]'
                        : 'border-[#E6DFD3] bg-[#FAF8F3] text-[#6E615D] hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{m.nameBn}</div>
                      <div className="text-[10px] text-[#8D7E7A]">{m.descBn}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#047857]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. App Info & Links */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#047857]">
          <ShieldCheck className="w-4 h-4" />
          <span>সম্পূর্ণ নিরাপদ, অফলাইন বান্ধব ও বিজ্ঞাপনমুক্ত</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
          <a
            href="https://github.com/githubxiansaiful/amar-deen-apk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#E6DFD3] text-[#2C2523] hover:bg-[#F3EFE6] transition flex items-center space-x-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-[#8D7E7A]" />
          </a>

          <a
            href="https://githubxiansaiful.github.io/amar-deen-apk/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#E6DFD3] text-[#2C2523] hover:bg-[#F3EFE6] transition flex items-center space-x-1"
          >
            <span>গোপনীয়তা নীতি</span>
            <ExternalLink className="w-3 h-3 text-[#8D7E7A]" />
          </a>
        </div>
      </div>

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={(newCity) => {
          setCity(newCity);
          setStoredCity(newCity.id);
          triggerNotice();
        }}
      />
    </div>
  );
}
