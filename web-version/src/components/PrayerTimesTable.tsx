'use client';

import React from 'react';
import { PrayerTimeItem } from '@/lib/types';
import { CheckCircle2, Clock } from 'lucide-react';

interface PrayerTimesTableProps {
  prayers: PrayerTimeItem[];
  forbiddenTimes?: {
    nameBn: string;
    rangeFormatted: string;
    description: string;
  }[];
}

export default function PrayerTimesTable({
  prayers,
  forbiddenTimes,
}: PrayerTimesTableProps) {
  return (
    <div className="space-y-6">
      {/* 5 Daily Prayers + Sunrise Grid */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span>দৈনিক ৫ ওয়াক্ত নামাজের সময়</span>
        </h2>

        <div className="divide-y divide-gray-100">
          {prayers.map((prayer) => {
            const isSunrise = prayer.id === 'sunrise';
            const isCurrent = prayer.isCurrent;
            const isNext = prayer.isNext;

            return (
              <div
                key={prayer.id}
                className={`py-3.5 px-3 rounded-2xl flex items-center justify-between transition ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200/80 shadow-xs'
                    : isNext
                    ? 'bg-amber-50/60 text-amber-950 font-medium'
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                {/* Left: Prayer Name & Arabic */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : isNext
                        ? 'bg-amber-500 text-white'
                        : isSunrise
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {prayer.nameBn.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base sm:text-lg font-bold">
                        {prayer.nameBn}
                      </span>
                      <span className="text-xs font-arabic text-gray-400">
                        {prayer.nameAr}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-600 text-white animate-pulse">
                          চলমান
                        </span>
                      )}
                      {isNext && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500 text-white">
                          পরবর্তী
                        </span>
                      )}
                    </div>
                    {prayer.endTimeFormatted && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        শেষ সময়: {prayer.endTimeFormatted}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Start Time */}
                <div className="text-right">
                  <span
                    className={`text-lg sm:text-xl font-bold tracking-tight ${
                      isCurrent
                        ? 'text-emerald-700'
                        : isNext
                        ? 'text-amber-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {prayer.timeFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forbidden Times (হারাম ওয়াক্ত) */}
      {forbiddenTimes && forbiddenTimes.length > 0 && (
        <div className="bg-red-50/70 border border-red-200/80 rounded-3xl p-6">
          <div className="flex items-center space-x-2 text-red-800 font-bold mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <h3 className="text-base">নামাজের নিষিদ্ধ সময়সমূহ (হারাম ওয়াক্ত)</h3>
          </div>
          <p className="text-xs text-red-700 mb-4">
            রাসূলুল্লাহ ﷺ এই তিন সময়ে যেকোনো ফরজ বা নফল নামাজ আদায় করতে নিষেধ করেছেন (ঐ দিনের আসর বাদে):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {forbiddenTimes.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-red-100 shadow-xs"
              >
                <div className="text-sm font-bold text-gray-900">{item.nameBn}</div>
                <div className="text-base font-extrabold text-red-600 my-1">
                  {item.rangeFormatted}
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
