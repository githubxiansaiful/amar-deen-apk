'use client';

import React from 'react';
import { PrayerTimeItem } from '@/lib/types';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  Bell,
  AlertTriangle,
} from 'lucide-react';

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
  const getPrayerIconInfo = (id: string) => {
    switch (id) {
      case 'fajr':
        return {
          icon: Sunrise,
          bg: 'rgba(14, 165, 233, 0.12)',
          color: '#0284C7',
        };
      case 'sunrise':
        return {
          icon: Sunrise,
          bg: 'rgba(245, 158, 11, 0.12)',
          color: '#D97706',
        };
      case 'dhuhr':
        return {
          icon: Sun,
          bg: 'rgba(245, 158, 11, 0.15)',
          color: '#D97706',
        };
      case 'asr':
        return {
          icon: CloudSun,
          bg: 'rgba(249, 115, 22, 0.12)',
          color: '#EA580C',
        };
      case 'maghrib':
        return {
          icon: Sunset,
          bg: 'rgba(139, 92, 246, 0.12)',
          color: '#7C3AED',
        };
      case 'isha':
      default:
        return {
          icon: Moon,
          bg: 'rgba(99, 102, 241, 0.12)',
          color: '#4F46E5',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* 5 Daily Prayers List Card */}
      <div className="bg-white rounded-3xl border border-[#E6DFD3] shadow-xs overflow-hidden divide-y divide-[#E6DFD3]/60">
        {prayers.map((prayer) => {
          const { icon: Icon, bg, color } = getPrayerIconInfo(prayer.id);
          const isCurrent = prayer.isCurrent;
          const isNext = prayer.isNext;

          return (
            <div
              key={prayer.id}
              className={`px-4 sm:px-5 py-3.5 flex items-center justify-between transition ${
                isCurrent ? 'bg-[#ECFDF5]/60' : 'hover:bg-[#FAF8F3]/60'
              }`}
            >
              {/* Left: Circular icon + Name + Ongoing badge */}
              <div className="flex items-center space-x-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-[#2C2523]">
                      {prayer.nameBn}
                    </span>

                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#047857]/15 text-[#047857]">
                        ● চলমান
                      </span>
                    )}

                    {isNext && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D97706]/15 text-[#D97706]">
                        পরবর্তী
                      </span>
                    )}
                  </div>

                  {prayer.endTimeFormatted && (
                    <div className="text-[11px] text-[#8D7E7A] mt-0.5">
                      শেষ সময়: {prayer.endTimeFormatted}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Time & Alert indicator */}
              <div className="flex items-center space-x-3">
                <span
                  className={`text-base sm:text-lg font-bold tracking-tight ${
                    isCurrent ? 'text-[#047857]' : 'text-[#2C2523]'
                  }`}
                >
                  {prayer.timeFormatted} মি.
                </span>

                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#8D7E7A] hover:text-[#047857] transition">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forbidden Times (হারাম ওয়াক্ত) */}
      {forbiddenTimes && forbiddenTimes.length > 0 && (
        <div className="bg-[#FFF5F5] border border-[#FED7D7] rounded-3xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-[#C53030] font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-[#E53E3E]" />
            <span>নামাজের নিষিদ্ধ সময়সমূহ (হারাম ওয়াক্ত)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {forbiddenTimes.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 border border-[#FED7D7] shadow-2xs"
              >
                <div className="text-xs font-bold text-[#2C2523]">
                  {item.nameBn}
                </div>
                <div className="text-sm font-extrabold text-[#E53E3E] my-1">
                  {item.rangeFormatted}
                </div>
                <div className="text-[11px] text-[#718096] leading-tight">
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
