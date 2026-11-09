'use client';

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Moon, Sun, ArrowRight, Sunrise, Sunset } from 'lucide-react';
import { DayPrayerSchedule, CityOption } from '@/lib/types';
import { calculatePrayerSchedule } from '@/lib/prayer';
import { getStoredCity, getStoredMadhab, getStoredCalcMethod } from '@/lib/storage';
import { toBengaliDigits } from '@/lib/utils';
import Link from 'next/link';

export default function PrayerHeroCard() {
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);
  const [city, setCity] = useState<CityOption | null>(null);
  const [timeRemainingStr, setTimeRemainingStr] = useState<string>('');

  const refreshTimes = () => {
    const activeCity = getStoredCity();
    const madhab = getStoredMadhab();
    const method = getStoredCalcMethod();
    const sched = calculatePrayerSchedule(activeCity, method, madhab, new Date());
    setCity(activeCity);
    setSchedule(sched);
  };

  useEffect(() => {
    refreshTimes();

    const handleUpdate = () => refreshTimes();
    window.addEventListener('amardeen_city_changed', handleUpdate);
    window.addEventListener('amardeen_settings_changed', handleUpdate);

    // Live update interval
    const interval = setInterval(() => {
      refreshTimes();
    }, 30000); // every 30 seconds

    return () => {
      window.removeEventListener('amardeen_city_changed', handleUpdate);
      window.removeEventListener('amardeen_settings_changed', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  if (!schedule || !city) {
    return (
      <div className="w-full h-64 bg-emerald-900 rounded-3xl animate-pulse"></div>
    );
  }

  const currentPrayer = schedule.currentPrayer;
  const nextPrayer = schedule.nextPrayer;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl border border-emerald-700/40 p-6 sm:p-8">
      {/* Decorative Islamic Geometric Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />

      {/* Header: Date & City Info */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-emerald-800/60">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 font-medium text-sm sm:text-base">
            <Moon className="w-4 h-4" />
            <span>{schedule.hijriFormatted}</span>
          </div>
          <div className="text-emerald-200 text-xs sm:text-sm mt-0.5">
            {schedule.gregorianFormatted}
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-800/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-emerald-700/50 self-start sm:self-auto text-xs sm:text-sm">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold">{city.nameBn}</span>
          <span className="text-emerald-300 text-xs">({city.districtBn})</span>
        </div>
      </div>

      {/* Hero Body: Current and Next Prayer */}
      <div className="relative py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Side: Current active prayer */}
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>বর্তমান ওয়াক্ত</span>
          </div>

          <div className="flex items-baseline space-x-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {currentPrayer ? currentPrayer.nameBn : 'ওয়াক্ত শেষ'}
            </h1>
            <span className="text-2xl sm:text-3xl font-arabic text-emerald-300">
              {currentPrayer?.nameAr}
            </span>
          </div>

          <p className="text-emerald-200 text-sm sm:text-base mt-2">
            {currentPrayer ? (
              <>
                সময়কাল:{' '}
                <span className="text-white font-semibold">
                  {currentPrayer.timeFormatted}
                </span>{' '}
                থেকে{' '}
                <span className="text-white font-semibold">
                  {currentPrayer.endTimeFormatted || 'পরবর্তী ওয়াক্ত পর্যন্ত'}
                </span>
              </>
            ) : (
              'পরবর্তী ওয়াক্তের জন্য অপেক্ষা করুন'
            )}
          </p>
        </div>

        {/* Right Side: Next prayer countdown card */}
        {nextPrayer && (
          <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-2xl p-5 backdrop-blur-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-300 mb-2">
              <span className="font-medium">পরবর্তী ওয়াক্ত: {nextPrayer.nameBn}</span>
              <span className="text-amber-300 font-bold">{nextPrayer.timeFormatted}</span>
            </div>

            <div className="text-xl sm:text-2xl font-bold text-amber-300 my-1">
              {schedule.remainingTimeFormatted}
            </div>

            <div className="text-xs text-emerald-300 flex items-center justify-between pt-2 border-t border-emerald-800/80">
              <span>ফরজ নামাজের প্রস্তুতি গ্রহণ করুন</span>
              <Link
                href="/prayer"
                className="hover:text-amber-300 transition flex items-center space-x-1"
              >
                <span>সম্পূর্ণ সূচি</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Highlights: Sahur & Iftar & Sunrise */}
      <div className="relative pt-5 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-800/50 flex items-center space-x-3">
          <div className="p-2 bg-emerald-900/80 rounded-lg text-amber-300">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-300">সেহরি শেষ (আজ)</div>
            <div className="text-sm font-bold text-white">
              {schedule.sahurEndTimeFormatted}
            </div>
          </div>
        </div>

        <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-800/50 flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
            <Sunset className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-300">ইফতারের সময় (আজ)</div>
            <div className="text-sm font-bold text-amber-300">
              {schedule.iftarTimeFormatted}
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-emerald-950/50 rounded-xl p-3 border border-emerald-800/50 flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg text-orange-300">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-300">সূর্যোদয়</div>
            <div className="text-sm font-bold text-white">
              {schedule.sunrise.timeFormatted}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
