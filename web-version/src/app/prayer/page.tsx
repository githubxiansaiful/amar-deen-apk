'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Settings,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  calculatePrayerSchedule,
  calculateNaflTimes,
  calculateMonthSchedule,
  getCalculationParameters,
} from '@/lib/prayer';
import { getStoredCity, setStoredCity, getStoredMadhab, getStoredCalcMethod } from '@/lib/storage';
import { CityOption, DayPrayerSchedule } from '@/lib/types';
import NamajTimeHeroCard from '@/components/NamajTimeHeroCard';
import SectionHeader from '@/components/SectionHeader';
import PrayerTimesTable from '@/components/PrayerTimesTable';
import CitySelectorModal from '@/components/CitySelectorModal';
import { toBengaliDigits } from '@/lib/utils';
import { Coordinates, PrayerTimes } from 'adhan';
import { DEFAULT_CITY } from '@/data/cities';

const MONTH_NAMES_BN = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export default function PrayerPage() {
  const [city, setCity] = useState<CityOption>(DEFAULT_CITY);
  const [schedule, setSchedule] = useState<DayPrayerSchedule | null>(null);
  const [naflTimes, setNaflTimes] = useState<any[]>([]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [todayDay, setTodayDay] = useState<number>(0);
  const [todayMonth, setTodayMonth] = useState<number>(0);

  const loadData = () => {
    const activeCity = getStoredCity();
    const madhab = getStoredMadhab();
    const method = getStoredCalcMethod();
    const now = new Date();
    setTodayDay(now.getDate());
    setTodayMonth(now.getMonth());

    const sched = calculatePrayerSchedule(activeCity, method, madhab, now);
    setCity(activeCity);
    setSchedule(sched);

    // Nafl calculation
    const coords = new Coordinates(activeCity.latitude, activeCity.longitude);
    const params = getCalculationParameters(method, madhab);
    const pt = new PrayerTimes(coords, now, params);
    setNaflTimes(calculateNaflTimes(pt));

    // Monthly data
    const monthSchedule = calculateMonthSchedule(
      activeCity,
      selectedYear,
      selectedMonth,
      method,
      madhab
    );
    setMonthlyData(monthSchedule);
  };

  useEffect(() => {
    loadData();

    const handleCityChange = () => loadData();
    window.addEventListener('amardeen_city_changed', handleCityChange);
    return () => window.removeEventListener('amardeen_city_changed', handleCityChange);
  }, [selectedMonth, selectedYear]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 pb-24">
      {/* 1. Top Bar: [ 📍 ঢাকা ⌵ ]   [ 📅 ১৮ অক্টোবর ]   [ ⚙ পদ্ধতি ] */}
      {schedule && (
        <div className="flex items-center justify-between gap-2">
          {/* Location Pill */}
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-[#FAF8F3] border border-[#E6DFD3] rounded-2xl text-xs sm:text-sm font-bold text-[#047857] transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <span>📍 {city.nameBn} ⌵</span>
          </button>

          {/* Date Pill */}
          <div className="px-3 py-2 bg-white border border-[#E6DFD3] rounded-2xl text-xs font-semibold text-[#2C2523] shadow-xs flex items-center space-x-1.5">
            <span>📅 {schedule.gregorianFormatted.split(',')[1] || schedule.gregorianFormatted}</span>
          </div>

          {/* Settings Pill */}
          <Link
            href="/settings"
            className="px-3 py-2 bg-white hover:bg-[#FAF8F3] border border-[#E6DFD3] rounded-2xl text-xs font-bold text-[#2C2523] transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#6E615D]" />
            <span>পদ্ধতি</span>
          </Link>
        </div>
      )}

      {/* 2. Namaj Time Hero Card (Exact Mosque Silhouette & Celestial Arc) */}
      {schedule && <NamajTimeHeroCard schedule={schedule} />}

      {/* 3. Fard Prayers Section */}
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

      {/* 4. Nafl Prayers Section */}
      <div className="pt-2">
        <SectionHeader
          title="নফল নামাজ"
          accentColor="#3B82F6"
          subtitle="অতিরিক্ত সাওয়াবের সালাত"
        />
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {naflTimes.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-4 border border-[#E6DFD3] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#2C2523]">{item.nameBn}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-[#ECFDF5] text-[#047857] rounded-lg">
                    {item.rakat}
                  </span>
                </div>
                <div className="text-base font-extrabold text-[#047857] my-1">
                  {item.timeFormatted}
                </div>
              </div>
              <p className="text-[11px] text-[#6E615D] pt-2 border-t border-[#E6DFD3]/60 leading-tight">
                {item.virtue}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Monthly Prayer Calendar */}
      <div className="pt-2">
        <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#047857]" />
              <h2 className="text-base font-bold text-[#2C2523]">
                {MONTH_NAMES_BN[selectedMonth]} {toBengaliDigits(selectedYear)} - মাসিক ক্যালেন্ডার
              </h2>
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-2.5 py-1.5 bg-[#FAF8F3] border border-[#E6DFD3] rounded-xl text-xs font-bold text-[#2C2523]"
            >
              {MONTH_NAMES_BN.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E6DFD3]">
            <table className="w-full text-left text-xs divide-y divide-[#E6DFD3]">
              <thead className="bg-[#FAF8F3] text-[#2C2523] font-bold">
                <tr>
                  <th className="px-2.5 py-2.5 text-center">তারিখ</th>
                  <th className="px-2 py-2.5">ফজর</th>
                  <th className="px-2 py-2.5">সূর্যোদয়</th>
                  <th className="px-2 py-2.5">যোহর</th>
                  <th className="px-2 py-2.5">আসর</th>
                  <th className="px-2 py-2.5">মাগরিব</th>
                  <th className="px-2 py-2.5">ইশা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]/60 bg-white">
                {monthlyData.map((row) => {
                  const isToday =
                    todayDay === row.day &&
                    todayMonth === selectedMonth;

                  return (
                    <tr
                      key={row.day}
                      className={`transition ${
                        isToday
                          ? 'bg-[#ECFDF5] font-bold text-[#047857]'
                          : 'hover:bg-[#FAF8F3] text-[#2C2523]'
                      }`}
                    >
                      <td className="px-2.5 py-2 text-center font-bold">
                        {toBengaliDigits(row.day)} {isToday && '★'}
                      </td>
                      <td className="px-2 py-2">{row.fajr}</td>
                      <td className="px-2 py-2 text-[#8D7E7A]">{row.sunrise}</td>
                      <td className="px-2 py-2">{row.dhuhr}</td>
                      <td className="px-2 py-2">{row.asr}</td>
                      <td className="px-2 py-2 font-bold text-[#047857]">{row.maghrib}</td>
                      <td className="px-2 py-2">{row.isha}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
