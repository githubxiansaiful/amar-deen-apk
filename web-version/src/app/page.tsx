'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Heart,
  ChevronRight,
  Download,
  Share2,
} from 'lucide-react';
import GreetingHeader from '@/components/GreetingHeader';
import SectionHeader from '@/components/SectionHeader';
import NamajTimeHeroCard from '@/components/NamajTimeHeroCard';
import QuickShortcutsGrid from '@/components/QuickShortcutsGrid';
import PrayerTimesTable from '@/components/PrayerTimesTable';
import CitySelectorModal from '@/components/CitySelectorModal';
import { calculatePrayerSchedule } from '@/lib/prayer';
import { getStoredCity, setStoredCity, getStoredMadhab, getStoredCalcMethod } from '@/lib/storage';
import { CityOption, DayPrayerSchedule } from '@/lib/types';
import { DEFAULT_CITY } from '@/data/cities';

export default function HomePage() {
  const [city, setCity] = useState<CityOption>(DEFAULT_CITY);
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  const loadData = () => {
    const activeCity = getStoredCity();
    const madhab = getStoredMadhab();
    const method = getStoredCalcMethod();
    const sched = calculatePrayerSchedule(activeCity, method, madhab);
    setCity(activeCity);
    setSchedule(sched);
  };

  useEffect(() => {
    loadData();

    const handleCityChange = () => loadData();
    window.addEventListener('amardeen_city_changed', handleCityChange);
    return () => window.removeEventListener('amardeen_city_changed', handleCityChange);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 pb-24">
      {/* 1. Greeting & Date Card */}
      {schedule && (
        <GreetingHeader
          cityName={city.nameBn}
          hijriDate={schedule.hijriFormatted}
          gregorianDate={schedule.gregorianFormatted}
          onCityClick={() => setIsCityModalOpen(true)}
        />
      )}

      {/* 2. Namaj Time Section Header */}
      <SectionHeader
        title="নামাজের সময়"
        accentColor="#047857"
        actionText="বিস্তারিত সময়সূচি >"
        actionHref="/prayer"
      />

      {/* 3. Namaj Time Hero Card (Mosque Silhouette + Arc + Two Pillars) */}
      {schedule && <NamajTimeHeroCard schedule={schedule} />}

      {/* 4. Quick Shortcuts Grid (8 Items like Android App) */}
      <div className="pt-1">
        <SectionHeader
          title="প্রয়োজনীয় ফিচার"
          accentColor="#047857"
          subtitle="দৈনন্দিন ইবাদতের সরঞ্জাম"
        />
        <div className="mt-2">
          <QuickShortcutsGrid />
        </div>
      </div>

      {/* 5. Fard Prayer List */}
      <div className="pt-2">
        <SectionHeader
          title="ফরজ নামাজ"
          accentColor="#047857"
          subtitle="আজকের ৫ ওয়াক্ত সালাত"
        />
        <div className="mt-2">
          {schedule && (
            <PrayerTimesTable
              prayers={schedule.prayers}
              forbiddenTimes={schedule.forbiddenTimes}
            />
          )}
        </div>
      </div>

      {/* 6. Daily Ayah Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-[#D97706] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-[#D97706]" />
          <span>আজকের নির্বাচিত আয়াত</span>
        </div>

        <div className="text-right font-arabic text-2xl text-[#2C2523] leading-loose">
          فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
        </div>

        <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-[#E6DFD3]/70 text-sm font-semibold text-[#2C2523]">
          &quot;অতএব তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আর আমার প্রতি কৃতজ্ঞতা প্রকাশ করো এবং অকৃতজ্ঞ হয়ো না।&quot;
        </div>

        <div className="text-xs text-[#8D7E7A] text-right font-medium">
          — সূরা আল-বাকারা ২:১৫২
        </div>
      </div>

      {/* 7. Daily Dua Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-[#047857] text-xs font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 text-[#047857]" />
          <span>আজকের মাসনূন দোয়া</span>
        </div>

        <div className="text-right font-arabic text-xl text-[#2C2523] leading-relaxed">
          اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا
        </div>

        <div className="p-3 bg-[#F5EFE4] rounded-2xl border border-[#E6DFD3]/70 text-xs sm:text-sm font-medium text-[#2C2523]">
          &quot;হে আল্লাহ! নিশ্চয়ই আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র রিজিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।&quot;
        </div>

        <div className="text-xs text-[#8D7E7A] text-right font-medium">
          — সুনানে ইবনে মাজাহ ৯২৫ (সহিহ)
        </div>
      </div>

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={(newCity) => {
          setCity(newCity);
          setStoredCity(newCity.id);
          loadData();
        }}
      />
    </div>
  );
}
