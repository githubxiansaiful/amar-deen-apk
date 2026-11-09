'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sunrise, Sunset, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RAMADAN_DUAS } from '@/data/ramadan';
import { calculatePrayerSchedule } from '@/lib/prayer';
import { getStoredCity, setStoredCity, getStoredMadhab, getStoredCalcMethod } from '@/lib/storage';
import { CityOption, DayPrayerSchedule } from '@/lib/types';
import { DEFAULT_CITY } from '@/data/cities';
import CitySelectorModal from '@/components/CitySelectorModal';
import SectionHeader from '@/components/SectionHeader';

export default function RamadanPage() {
  const [city, setCity] = useState<CityOption>(DEFAULT_CITY);
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    const activeCity = getStoredCity();
    const madhab = getStoredMadhab();
    const method = getStoredCalcMethod();
    setCity(activeCity);
    setSchedule(calculatePrayerSchedule(activeCity, method, madhab));
  }, []);

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
            <h1 className="text-lg font-black text-[#2C2523]">রমজান ও সিয়াম</h1>
            <p className="text-[11px] text-[#6E615D] font-medium">সেহরি, ইফতার ও রোজার বিধিবিধান</p>
          </div>
        </div>

        <button
          onClick={() => setIsCityModalOpen(true)}
          className="px-3 py-1.5 bg-[#FAF8F3] border border-[#E6DFD3] rounded-xl text-xs font-bold text-[#047857] hover:bg-[#F3EFE6] transition cursor-pointer"
        >
          📍 {city.nameBn} ⌵
        </button>
      </div>

      {/* 2. Sahri & Iftar Cards */}
      {schedule && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E6DFD3] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#6E615D]">আজকের সেহরি শেষ</span>
              <Sunrise className="w-4 h-4 text-[#047857]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#047857]">
              {schedule.sahurEndTimeFormatted}
            </div>
            <span className="text-[10px] text-[#8D7E7A] mt-1">ফজরের ৫ মিনিট পূর্বে</span>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E6DFD3] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#6E615D]">আজকের ইফতারের সময়</span>
              <Sunset className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#D97706]">
              {schedule.iftarTimeFormatted}
            </div>
            <span className="text-[10px] text-[#8D7E7A] mt-1">মাগরিব ওয়াক্ত শুরু</span>
          </div>
        </div>
      )}

      {/* 3. Ramadan Duas */}
      <div className="pt-2">
        <SectionHeader
          title="রমজানের জরুরি দোয়া"
          accentColor="#047857"
          subtitle="নিয়ত, ইফতার ও কদরের আমল"
        />

        <div className="mt-2 space-y-3">
          {RAMADAN_DUAS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm sm:text-base text-[#2C2523]">{item.titleBn}</h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#FAF8F3] text-[#047857] border border-[#E6DFD3]">
                  {item.occasionBn}
                </span>
              </div>

              <div className="py-1 text-right font-arabic text-2xl text-[#047857] leading-loose">
                {item.arabic}
              </div>

              <div className="space-y-2">
                <div className="bg-[#F5EFE4] rounded-2xl p-3 border border-[#E6DFD3]/60 text-xs sm:text-sm font-medium text-[#2C2523]">
                  {item.pronunciationBn}
                </div>
                <div className="bg-[#FAF7EE] rounded-2xl p-3 border border-[#E6DFD3]/60 text-xs sm:text-sm font-bold text-[#2C2523]">
                  {item.meaningBn}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E6DFD3]/60 text-[11px] text-[#8D7E7A]">
                {item.reference}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Rules of Sawm */}
      <div className="pt-2">
        <SectionHeader
          title="সিয়ামের গুরুত্বপূর্ণ মাসয়ালা"
          accentColor="#D97706"
        />

        <div className="mt-2 space-y-3">
          <div className="bg-[#FFF5F5] rounded-3xl p-5 border border-[#FED7D7] space-y-2 text-xs">
            <div className="font-bold text-[#C53030] flex items-center space-x-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-[#E53E3E]" />
              <span>যেসব কারণে রোজা ভেঙে যায় (কাজা/কাফফারা)</span>
            </div>
            <ul className="text-[#2C2523] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>ইচ্ছাকৃতভাবে খাবার, পানীয় বা ওষুধ সেবন করা।</li>
              <li>রোজা অবস্থায় ইচ্ছাকৃত স্ত্রী সহবাস করা (কাফফারা ওয়াজিব)।</li>
              <li>মুখ ভরে ইচ্ছাকৃত বমি করা।</li>
              <li>নাক বা মুখ দিয়ে পাকস্থলীতে কোনো পুষ্টিকর খাদ্যবস্তু প্রবেশ করানো।</li>
              <li>ধূমপান বা ইচ্ছাকৃত তামাকজাত বাষ্প গ্রহণ করা।</li>
            </ul>
          </div>

          <div className="bg-[#ECFDF5] rounded-3xl p-5 border border-[#047857]/20 space-y-2 text-xs">
            <div className="font-bold text-[#047857] flex items-center space-x-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#047857]" />
              <span>যেসব কারণে রোজা ভাঙে না (ভুল ধারণা নিরসন)</span>
            </div>
            <ul className="text-[#2C2523] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>ভুলবশত কিছু খেয়ে বা পান করে ফেলা (মনে পড়া মাত্রই বন্ধ করতে হবে)।</li>
              <li>চোখে ড্রপ, সুরমা বা আতর/সুগন্ধি ব্যবহার করা।</li>
              <li>অনিচ্ছাকৃত ধোঁয়া, ধুলাবালি বা মশা-মাছি গলায় ঢুকে যাওয়া।</li>
              <li>ইনজেকশন বা প্রয়োজনীয় জরুরি স্যালাইন গ্রহণ করা (খাদ্য বিকল্প না হলে)।</li>
              <li>অতিরিক্ত গরমে গোসল করা, মাথায় পানি ঢালা এবং মিসওয়াক করা।</li>
            </ul>
          </div>
        </div>
      </div>

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={(newCity) => {
          setCity(newCity);
          setStoredCity(newCity.id);
          const madhab = getStoredMadhab();
          const method = getStoredCalcMethod();
          setSchedule(calculatePrayerSchedule(newCity, method, madhab));
        }}
      />
    </div>
  );
}
