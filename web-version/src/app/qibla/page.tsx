'use client';

import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Info, CheckCircle2 } from 'lucide-react';
import { calculateQibla } from '@/lib/prayer';
import { getStoredCity } from '@/lib/storage';
import { CityOption } from '@/lib/types';
import { DEFAULT_CITY } from '@/data/cities';
import QiblaCompass from '@/components/QiblaCompass';
import CitySelectorModal from '@/components/CitySelectorModal';
import { toBengaliDigits } from '@/lib/utils';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>কিবলা ও কা'বা দিকদর্শন</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          কিবলা কম্পাস
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          পবিত্র মসজিদুল হারামের কাবা শরিফের সরাসরি ভৌগোলিক দিক ও নির্ভুল ডিগ্রি নির্ধারণ।
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-300" />
            <span>বর্তমান অবস্থান: {city.nameBn} ({city.districtBn})</span>
          </button>
        </div>
      </div>

      {/* Compass Interactive Component */}
      <QiblaCompass
        qiblaDegree={qiblaInfo.directionDegrees}
        distanceKm={qiblaInfo.distanceKm}
        cityName={city.nameBn}
      />

      {/* Guidance & Instructions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <Info className="w-5 h-5 text-emerald-600" />
          <span>নির্ভুলভাবে কিবলা নির্ণয়ের নিয়মাবলি</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
          <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
            <div className="font-bold text-gray-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>মোবাইল ফোনের সেন্সর ব্যবহার</span>
            </div>
            <p>
              মোবাইল ব্রাউজারে লোকেশন ও মোশন সেন্সর সক্রিয় করে ফোনটিকে সমতল মেঝেতে রাখুন। কা'বা চিহ্নিত সোনালী তীরটি যেদিকে নির্দেশ করবে সেদিকে মুখ করুন।
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
            <div className="font-bold text-gray-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>বাংলাদেশের প্রেক্ষিতে সাধারণ দিক</span>
            </div>
            <p>
              বাংলাদেশ থেকে কিবলার সাধারণ দিক পশ্চিম-উত্তর-পশ্চিম (WNW)। দিগ্বলয়ের কোণ প্রায় ২৭৩° থেকে ২৭৫° ডিগ্রি।
            </p>
          </div>
        </div>
      </div>

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={(newCity) => updateQibla(newCity)}
      />
    </div>
  );
}
