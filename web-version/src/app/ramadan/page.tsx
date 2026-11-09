'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sunset, Sunrise, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { RAMADAN_DUAS } from '@/data/ramadan';
import { calculatePrayerSchedule } from '@/lib/prayer';
import { getStoredCity, getStoredMadhab, getStoredCalcMethod } from '@/lib/storage';
import { CityOption, DayPrayerSchedule } from '@/lib/types';
import { DEFAULT_CITY } from '@/data/cities';
import CitySelectorModal from '@/components/CitySelectorModal';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold">
          <Moon className="w-3.5 h-3.5" />
          <span>পবিত্র মাহে রমজান ও সিয়াম সাধনা</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          রমজান ও সিয়াম নির্দেশিকা
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          সেহরি ও ইফতারের সঠিক সময়, রোজার মাসনূন দোয়া এবং সিয়াম শুদ্ধ রাখার জরুরি মাসয়ালা-মাসায়েল।
        </p>
      </div>

      {/* Sahri & Iftar Card */}
      {schedule && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-emerald-950 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                আজকের সেহরি শেষ সময় ({city.nameBn})
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 my-1">
                {schedule.sahurEndTimeFormatted}
              </div>
              <p className="text-xs text-emerald-200">
                সতর্কতামূলক সেহরি শেষ (ফজরের ৫ মিনিট পূর্বে)
              </p>
            </div>
            <div className="p-4 bg-emerald-800/80 rounded-2xl text-amber-300">
              <Sunrise className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-linear-to-br from-amber-950 to-amber-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-800 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                আজকের ইফতারের সময় ({city.nameBn})
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 my-1">
                {schedule.iftarTimeFormatted}
              </div>
              <p className="text-xs text-amber-200">
                সূর্যাস্তের সাথে সাথেই দ্রুত ইফতার করা সুন্নাত
              </p>
            </div>
            <div className="p-4 bg-amber-800/80 rounded-2xl text-amber-300">
              <Sunset className="w-8 h-8" />
            </div>
          </div>
        </div>
      )}

      {/* Ramadan Duas */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>রমজানের আবশ্যকীয় দোয়া সমূহ</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RAMADAN_DUAS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-base">{item.titleBn}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {item.occasionBn}
                  </span>
                </div>

                <div className="text-right font-arabic text-xl text-emerald-950 leading-loose mb-3">
                  {item.arabic}
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-amber-800 block text-[11px] mb-0.5">
                      উচ্চারণ:
                    </strong>
                    {item.pronunciationBn}
                  </p>
                  <p className="text-gray-900 font-medium leading-relaxed">
                    <strong className="text-emerald-800 block text-[11px] mb-0.5">
                      অনুবাদ:
                    </strong>
                    {item.meaningBn}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                {item.reference}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules: What breaks fasting vs what does not */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">
          সিয়ামের গুরুত্বপূর্ণ মাসয়ালা
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Breaks fasting */}
          <div className="bg-red-50/60 rounded-2xl p-5 border border-red-100 space-y-3">
            <h3 className="font-bold text-red-900 flex items-center space-x-2 text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>যেসব কারণে রোজা ভেঙে যায় (কাজা/কাফফারা)</span>
            </h3>
            <ul className="text-xs text-gray-700 space-y-2 list-disc list-inside leading-relaxed">
              <li>ইচ্ছাকৃতভাবে খাবার, পানীয় বা ওষুধ সেবন করা।</li>
              <li>রোজা অবস্থায় ইচ্ছাকৃত স্ত্রী সহবাস করা (কাফফারা ওয়াজিব)।</li>
              <li>মুখ ভরে ইচ্ছাকৃত বমি করা।</li>
              <li>নাক বা মুখ দিয়ে পাকস্থলীতে কোনো পুষ্টিকর খাদ্যবস্তু প্রবেশ করানো।</li>
              <li>ধূমপান বা ইচ্ছাকৃত তামাকজাত বাষ্প গ্রহণ করা।</li>
              <li>নারীদের ঋতুস্রাব বা প্রসবোত্তর রক্তস্রাব শুরু হওয়া।</li>
            </ul>
          </div>

          {/* Does not break */}
          <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 space-y-3">
            <h3 className="font-bold text-emerald-900 flex items-center space-x-2 text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>যেসব কারণে রোজা ভাঙে না (ভুল ধারণা নিরসন)</span>
            </h3>
            <ul className="text-xs text-gray-700 space-y-2 list-disc list-inside leading-relaxed">
              <li>ভুলবশত কিছু খেয়ে বা পান করে ফেলা (মনে হওয়া মাত্রই বন্ধ করতে হবে)।</li>
              <li>চোখে ড্রপ, সুরমা বা আতর/সুগন্ধি ব্যবহার করা।</li>
              <li>অনিচ্ছাকৃত ধোঁয়া, ধুলাবালি বা মশা-মাছি গলায় ঢুকে যাওয়া।</li>
              <li>অনিচ্ছাকৃত বমি হওয়া বা সামান্য বমি নিজে নিজে নেমে যাওয়া।</li>
              <li>ইনজেকশন বা প্রয়োজনীয় জরুরি স্যালাইন গ্রহণ করা (খাদ্য বিকল্প না হলে)।</li>
              <li>অতিরিক্ত গরমে গোসল করা, মাথায় পানি ঢালা এবং মিসওয়াক করা।</li>
            </ul>
          </div>
        </div>
      </section>

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={(newCity) => {
          setCity(newCity);
          const madhab = getStoredMadhab();
          const method = getStoredCalcMethod();
          setSchedule(calculatePrayerSchedule(newCity, method, madhab));
        }}
      />
    </div>
  );
}
