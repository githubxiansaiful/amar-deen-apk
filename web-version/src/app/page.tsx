'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  BookOpen,
  Compass,
  Sparkles,
  Heart,
  Moon,
  Award,
  ChevronRight,
  Download,
  Share2,
  CheckCircle,
} from 'lucide-react';
import PrayerHeroCard from '@/components/PrayerHeroCard';
import { calculatePrayerSchedule } from '@/lib/prayer';
import { getStoredCity, getStoredMadhab, getStoredCalcMethod } from '@/lib/storage';
import { DayPrayerSchedule } from '@/lib/types';
import PrayerTimesTable from '@/components/PrayerTimesTable';

const FEATURES = [
  {
    href: '/prayer',
    title: 'নামাজের সময়সূচি',
    desc: '৫ ওয়াক্তের নির্ভুল সময় ও নিষিদ্ধ ওয়াক্ত',
    icon: Clock,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    href: '/quran',
    title: 'পবিত্র কুরআনুল কারীম',
    desc: '১১৪ সূরা, বাংলা অনুবাদ ও অডিও তেলাওয়াত',
    icon: BookOpen,
    color: 'bg-amber-50 text-amber-800 border-amber-100',
  },
  {
    href: '/qibla',
    title: 'কিবলা কম্পাস',
    desc: 'নির্ভুল কাবার দিকদর্শন ও দূরত্ব',
    icon: Compass,
    color: 'bg-teal-50 text-teal-700 border-teal-100',
  },
  {
    href: '/tasbih',
    title: 'ডিজিটাল তাসবিহ',
    desc: 'শব্দ ও ভাইব্রেশন সহ জিকির কাউন্টার',
    icon: Sparkles,
    color: 'bg-purple-50 text-purple-700 border-purple-100',
  },
  {
    href: '/duas',
    title: 'মাসনূন দোয়া সমূহ',
    desc: 'সহিহ হাদিস ভিত্তিক দৈনন্দিন দোয়া',
    icon: Heart,
    color: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  {
    href: '/ramadan',
    title: 'রমজান ও সিয়াম',
    desc: 'সেহরি, ইফতার ও রোজার বিধান',
    icon: Moon,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  {
    href: '/knowledge',
    title: 'ইসলামিক শিক্ষা',
    desc: 'নামাজের ফরজ, ওয়াজিব ও সুন্নত',
    icon: Award,
    color: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    href: '/umrah',
    title: 'উমরাহ গাইডলাইন',
    desc: 'হজ ও উমরার ৫টি ধারাবাহিক ধাপ',
    icon: Sparkles,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  },
];

export default function HomePage() {
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);

  useEffect(() => {
    const city = getStoredCity();
    const madhab = getStoredMadhab();
    const method = getStoredCalcMethod();
    setSchedule(calculatePrayerSchedule(city, method, madhab));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* Top Welcome Greeting Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 text-emerald-900 text-xs font-semibold">
          <span className="font-arabic text-sm">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
          <span>•</span>
          <span>আসসালামু আলাইকুম</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          আমার দ্বীন — আপনার দৈনন্দিন ইসলামিক পোর্টাল
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          প্রতিদিনের ইবাদতকে আরও সহজ ও সুন্দর করতে নামাজের নির্ভুল ওয়াক্ত, পবিত্র কুরআন, সহিহ দোয়া ও ডিজিটাল সরঞ্জাম।
        </p>
      </div>

      {/* Main Hero Card: Prayer Times & Countdown */}
      <PrayerHeroCard />

      {/* Feature Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            প্রয়োজনীয় ইসলামিক সেবাসমূহ
          </h2>
          <span className="text-xs text-gray-500">সম্পূর্ণ বিজ্ঞাপনমুক্ত</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border ${item.color} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-emerald-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 mt-3 sm:mt-4 pt-2 border-t border-gray-50">
                  <span>প্রবেশ করুন</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Today's Prayers Table & Ayah of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Prayer Times */}
        <div className="lg:col-span-2">
          {schedule && (
            <PrayerTimesTable
              prayers={schedule.prayers}
              forbiddenTimes={schedule.forbiddenTimes}
            />
          )}
        </div>

        {/* Right 1 Col: Verse of the Day & App Card */}
        <div className="space-y-6">
          {/* Daily Ayah Card */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50/40 rounded-3xl p-6 border border-amber-200/60 shadow-xs">
            <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>আজকের নির্বাচিত আয়াত</span>
            </div>
            <div className="text-right font-arabic text-xl sm:text-2xl text-amber-950 leading-loose mb-3">
              فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
            </div>
            <div className="text-sm font-semibold text-gray-800 mb-1">
              &quot;অতএব তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আর আমার প্রতি কৃতজ্ঞতা প্রকাশ করো এবং অকৃতজ্ঞ হয়ো না।&quot;
            </div>
            <div className="text-xs text-amber-700 pt-2 border-t border-amber-200/60">
              — সূরা আল-বাকারা ২:১৫২
            </div>
          </div>

          {/* Daily Dua Card */}
          <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200/60 shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>আজকের মাসনূন দোয়া</span>
            </div>
            <div className="text-right font-arabic text-lg text-emerald-950 leading-relaxed mb-2">
              اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا
            </div>
            <div className="text-xs font-medium text-emerald-900 mb-2">
              &quot;হে আল্লাহ! নিশ্চয়ই আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র রিজিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।&quot;
            </div>
            <div className="text-xs text-emerald-700 pt-2 border-t border-emerald-200/60">
              — সুনানে ইবনে মাজাহ ৯২৫ (সহিহ)
            </div>
          </div>

          {/* Android App Download Banner */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>১০০% অফলাইন সুবিধা</span>
              </div>
              <h3 className="text-lg font-bold">আমার দ্বীন অ্যান্ড্রয়েড অ্যাপ</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                ইন্টারনেট সংযোগ ছাড়াই নামাজের অ্যালার্ম, সম্পূর্ণ কুরআন ও তসবিহ সুবিধা পেতে আমাদের অফিশিয়াল অ্যাপ ডাউনলোড করুন।
              </p>
              <a
                href="https://github.com/githubxiansaiful/amar-deen-apk/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>সরাসরি APK ডাউনলোড করুন</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
