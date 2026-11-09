'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Info } from 'lucide-react';
import { calculateQibla } from '@/lib/prayer';
import { getStoredCity, setStoredCity } from '@/lib/storage';
import { CityOption } from '@/lib/types';
import { DEFAULT_CITY } from '@/data/cities';
import QiblaCompass from '@/components/QiblaCompass';
import CitySelectorModal from '@/components/CitySelectorModal';

export default function QiblaPage() {
  const [city, setCity] = useState<CityOption>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [qiblaInfo, setQiblaInfo] = useState({ directionDegrees: 273.5, distanceKm: 5120 });

  const updateQibla = (targetCity: CityOption) => {
    const info = calculateQibla(targetCity.latitude, targetCity.longitude);
    setQiblaInfo(info);
    setCity(targetCity);
  };

  useEffect(() => {
    updateQibla(getStoredCity());

    const handleCityChange = () => {
      updateQibla(getStoredCity());
    };

    window.addEventListener('amardeen_city_changed', handleCityChange);
    return () => window.removeEventListener('amardeen_city_changed', handleCityChange);
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
            <h1 className="text-lg font-black text-[#2C2523]">কিবলা কম্পাস</h1>
            <p className="text-[11px] text-[#6E615D] font-medium">সরাসরি কাবার দিকদর্শন ও কোণ</p>
          </div>
        </div>

        <button
          onClick={() => setIsCityModalOpen(true)}
          className="px-3 py-1.5 bg-[#FAF8F3] border border-[#E6DFD3] rounded-xl text-xs font-bold text-[#047857] hover:bg-[#F3EFE6] transition cursor-pointer"
        >
          📍 {city.nameBn} ⌵
        </button>
      </div>

      {/* 2. Compass Component */}
      <QiblaCompass
        qiblaDegree={qiblaInfo.directionDegrees}
        distanceKm={qiblaInfo.distanceKm}
        cityName={city.nameBn}
      />

      {/* 3. Guidance Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-2 text-xs text-[#6E615D]">
        <div className="font-bold text-[#2C2523] flex items-center space-x-1.5 text-sm">
          <Info className="w-4 h-4 text-[#047857]" />
          <span>নির্ভুল দিক নির্ণয়ের নির্দেশিকা</span>
        </div>
        <p className="leading-relaxed">
          বাংলাদেশ থেকে কিবলার সাধারণ দিক পশ্চিম-উত্তর-পশ্চিম (WNW)। নির্ভুল কোণ প্রায় ২৭৩° থেকে ২৭৫° ডিগ্রি। ফোনটিকে কোনো ধাতব বা চৌম্বকীয় বস্তু থেকে দূরে রেখে সমতলে রাখুন।
        </p>
      </div>

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={(newCity) => {
          setCity(newCity);
          setStoredCity(newCity.id);
          updateQibla(newCity);
        }}
      />
    </div>
  );
}
