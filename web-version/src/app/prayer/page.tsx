'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Info,
} from 'lucide-react';
import { calculatePrayerSchedule, calculateNaflTimes, calculateMonthSchedule } from '@/lib/prayer';
import { getStoredCity, getStoredMadhab, getStoredCalcMethod } from '@/lib/storage';
import { CityOption, DayPrayerSchedule } from '@/lib/types';
import PrayerTimesTable from '@/components/PrayerTimesTable';
import CitySelectorModal from '@/components/CitySelectorModal';
import { toBengaliDigits } from '@/lib/utils';
import { Coordinates, PrayerTimes } from 'adhan';
import { getCalculationParameters } from '@/lib/prayer';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
            <Clock className="w-7 h-7 text-emerald-600" />
            <span>নামাজের স্থায়ী ও নির্ভুল সময়সূচি</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            বাংলাদেশের ৬৪ জেলা ও আন্তর্জাতিক সময়ের সঠিক গণনা পদ্ধতি অনুযায়ী
          </p>
        </div>

        <button
          onClick={() => setIsCityModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-semibold transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>{city.nameBn} ({city.districtBn}) পরিবর্তন</span>
        </button>
      </div>

      {/* Main Prayer Schedule Table */}
      {schedule && (
        <PrayerTimesTable
          prayers={schedule.prayers}
          forbiddenTimes={schedule.forbiddenTimes}
        />
      )}

      {/* Nafl Prayer Timings (নফল নামাজ) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100">
        <div className="flex items-center space-x-2 text-emerald-900 font-bold text-lg mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2>নফল সালাতের সুনির্দিষ্ট সময় ও ফজিলত</h2>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          ফরজ নামাজের পাশাপাশি নফল সালাতের মাধ্যমে আল্লাহর নৈকট্য লাভ এবং গুনাহ মাফ হয়:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {naflTimes.map((item, idx) => (
            <div
              key={idx}
              className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-gray-900">{item.nameBn}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-lg text-emerald-800 border border-emerald-200">
                    {item.rakat}
                  </span>
                </div>
                <div className="text-lg font-extrabold text-emerald-700 my-2">
                  {item.timeFormatted}
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pt-2 border-t border-emerald-100">
                {item.virtue}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly Prayer Calendar */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>
                {MONTH_NAMES_BN[selectedMonth]} {toBengaliDigits(selectedYear)} - মাসিক ক্যালেন্ডার
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              নির্বাচিত জেলার জন্য পূর্ণ মাসের নামাজের সময়সূচি
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
            >
              {MONTH_NAMES_BN.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left text-xs divide-y divide-gray-100">
            <thead className="bg-emerald-900 text-white font-semibold">
              <tr>
                <th className="px-3 py-3 text-center">তারিখ</th>
                <th className="px-3 py-3">ফজর</th>
                <th className="px-3 py-3">সূর্যোদয়</th>
                <th className="px-3 py-3">যোহর</th>
                <th className="px-3 py-3">আসর</th>
                <th className="px-3 py-3">মাগরিব (ইফতার)</th>
                <th className="px-3 py-3">ইশা</th>
                <th className="px-3 py-3">সেহরি শেষ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {monthlyData.map((row) => {
                const isToday =
                  todayDay === row.day &&
                  todayMonth === selectedMonth;

                return (
                  <tr
                    key={row.day}
                    className={`transition ${
                      isToday
                        ? 'bg-amber-50 font-bold text-amber-950'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center font-bold">
                      {toBengaliDigits(row.day)} {isToday && '★'}
                    </td>
                    <td className="px-3 py-2.5">{row.fajr}</td>
                    <td className="px-3 py-2.5 text-gray-400">{row.sunrise}</td>
                    <td className="px-3 py-2.5">{row.dhuhr}</td>
                    <td className="px-3 py-2.5">{row.asr}</td>
                    <td className="px-3 py-2.5 font-bold text-emerald-800">{row.maghrib}</td>
                    <td className="px-3 py-2.5">{row.isha}</td>
                    <td className="px-3 py-2.5 text-gray-500">{row.sahurEnd}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={(newCity) => {
          setCity(newCity);
          loadData();
        }}
      />
    </div>
  );
}
