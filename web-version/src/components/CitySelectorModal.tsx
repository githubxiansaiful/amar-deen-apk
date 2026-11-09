'use client';

import React, { useState } from 'react';
import { CITIES } from '@/data/cities';
import { CityOption } from '@/lib/types';
import { Search, MapPin, X, Check } from 'lucide-react';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
}

export default function CitySelectorModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}: CitySelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = CITIES.filter(
    (c) =>
      c.nameBn.includes(searchTerm) ||
      c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.districtBn.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold">জেলা ও শহর নির্বাচন করুন</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-700 transition"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="আপনার জেলা বা শহরের নাম খুঁজুন (যেমন: ঢাকা, সিলেট, চট্টগ্রাম)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              autoFocus
            />
          </div>
        </div>

        {/* City List */}
        <div className="overflow-y-auto divide-y divide-gray-100 p-2 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              কোনো জেলা বা শহর পাওয়া যায়নি।
            </div>
          ) : (
            filtered.map((city) => {
              const isSelected = city.id === selectedCity.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-left transition ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {city.nameBn.charAt(0)}
                    </span>
                    <div>
                      <div className="font-medium text-base">{city.nameBn}</div>
                      <div className="text-xs text-gray-400">
                        {city.nameEn} • {city.country}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
          বাংলাদেশের ৬৪টি জেলা এবং প্রধান আন্তর্জাতিক শহরের নামাজের সঠিক সময়
        </div>
      </div>
    </div>
  );
}
