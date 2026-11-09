'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  MapPin,
  Compass,
  ShieldCheck,
  Download,
  ExternalLink,
  Check,
  Info,
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

const CALC_METHODS: { id: CalculationMethodOption; nameBn: string; descBn: string }[] = [
  {
    id: 'KARACHI',
    nameBn: 'ইসলামিক ইউনিভার্সিটি করাচি (Karachi)',
    descBn: 'বাংলাদেশ, ভারত ও পাকিস্তানে বহুল প্রচলিত ও অনুমোদিত মান।',
  },
  {
    id: 'MUSLIM_WORLD_LEAGUE',
    nameBn: 'মুসলিম ওয়ার্ল্ড লীগ (Muslim World League)',
    descBn: 'ইউরোপ ও আন্তর্জাতিক ইসলামিক সংস্থাসমূহের মান।',
  },
  {
    id: 'UMM_AL_QURA',
    nameBn: 'উম্মুল কুরা মক্কা মুকাররমা (Umm al-Qura)',
    descBn: 'সৌদি আরব ও মধ্যপ্রাচ্যে অনুসৃত মানদণ্ড।',
  },
  {
    id: 'EGYPTIAN',
    nameBn: 'মিশরীয় জরিপ কর্তৃপক্ষ (Egyptian Survey)',
    descBn: 'মিশর ও উত্তর আফ্রিকার দেশসমূহে অনুসৃত।',
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>সেটিংস ও পছন্দসমূহ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          অ্যাপ সেটিংস
        </h1>
        <p className="text-sm text-gray-600">
          নামাজের হিসাব পদ্ধতি, মাযহাব এবং ভৌগোলিক অবস্থান নির্ধারণ করুন।
        </p>
      </div>

      {/* Save Notification Toast */}
      {savedNotice && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold text-center shadow-md animate-in fade-in duration-200">
          ✓ সেটিংস সফলভাবে সংরক্ষিত হয়েছে এবং সময়ের হিসাব হালনাগাদ করা হয়েছে!
        </div>
      )}

      {/* City Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>ভৌগোলিক জেলা ও শহর</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সঠিক সূর্যোদয়, সূর্যাস্ত ও নামাজের ওয়াক্তের জন্য আপনার জেলা নির্বাচন করুন
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div>
            <div className="font-bold text-gray-900 text-base">{city.nameBn}</div>
            <div className="text-xs text-gray-500">
              {city.nameEn} • {city.country}
            </div>
          </div>

          <button
            onClick={() => setIsCityModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            পরিবর্তন করুন
          </button>
        </div>
      </div>

      {/* Madhab Selection */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>মাযহাব ও আসরের সময় নির্ধারণ</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            হানাফি মতে বস্তুর ছায়া দ্বিগুণ হলে আসর শুরু হয়; শাফেঈ/জমহুর মতে একগুণ হলে শুরু হয়
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleMadhabChange('HANAFI')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              madhab === 'HANAFI'
                ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div>
              <div className="text-sm font-bold">হানাফি (Hanafi)</div>
              <div className="text-xs text-gray-500 font-normal mt-0.5">
                বাংলাদেশে সর্বাধিক প্রচলিত (ছায়া দ্বিগুণ)
              </div>
            </div>
            {madhab === 'HANAFI' && <Check className="w-5 h-5 text-emerald-600" />}
          </button>

          <button
            onClick={() => handleMadhabChange('SHAFI')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
              madhab === 'SHAFI'
                ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div>
              <div className="text-sm font-bold">শাফেঈ / জমহুর (Shafi / Hanbali)</div>
              <div className="text-xs text-gray-500 font-normal mt-0.5">
                মালিকি ও হাম্বলী সহ সাধারণ মান (ছায়া একগুণ)
              </div>
            </div>
            {madhab === 'SHAFI' && <Check className="w-5 h-5 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Calculation Method Selection */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <Info className="w-5 h-5 text-emerald-600" />
            <span>নামাজের হিসাব পদ্ধতি (Calculation Method)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ফজর ও ইশার কোণ নির্ধারণের জন্য স্বীকৃত আন্তর্জাতিক পদ্ধতি
          </p>
        </div>

        <div className="space-y-2">
          {CALC_METHODS.map((method) => {
            const isSelected = calcMethod === method.id;

            return (
              <button
                key={method.id}
                onClick={() => handleMethodChange(method.id)}
                className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{method.nameBn}</div>
                  <div className="text-xs text-gray-500 font-normal mt-0.5">
                    {method.descBn}
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* App Info & Links */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-900 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>আমার দ্বীন (Amar Deen) সংস্করণ ১.০.১</span>
        </div>
        <p className="text-xs text-emerald-200 leading-relaxed">
          সম্পূর্ণ উন্মুক্ত, বিশুদ্ধ ও বিজ্ঞাপনমুক্ত ইসলামিক প্ল্যাটফর্ম। কুরআন, সহিহ হাদিস ও নির্ভুল গণনার সমন্বয়ে গঠিত।
        </p>

        <div className="flex flex-wrap gap-3 pt-2 text-xs">
          <a
            href="https://github.com/githubxiansaiful/amar-deen-apk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 rounded-xl transition"
          >
            <span>GitHub রিপোজিটরি</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://githubxiansaiful.github.io/amar-deen-apk/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 rounded-xl transition"
          >
            <span>গোপনীয়তা নীতি</span>
            <ExternalLink className="w-3.5 h-3.5" />
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
