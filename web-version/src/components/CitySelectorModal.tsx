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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-[#E6DFD3]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#047857] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#FDE68A]" />
            <h2 className="text-base font-bold">জেলা ও শহর নির্বাচন করুন</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#065F46] transition cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E6DFD3] bg-[#FAF8F3]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8D7E7A]" />
            <input
              type="text"
              placeholder="আপনার জেলা খুঁজুন (যেমন: ঢাকা, সিলেট, চট্টগ্রাম)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6DFD3] rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#047857] transition"
              autoFocus
            />
          </div>
        </div>

        {/* City List */}
        <div className="overflow-y-auto divide-y divide-[#E6DFD3]/60 p-2 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8D7E7A]">
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
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#ECFDF5] text-[#047857] font-bold'
                      : 'hover:bg-[#FAF8F3] text-[#2C2523]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-[#047857] text-white'
                          : 'bg-[#FAF8F3] text-[#6E615D] border border-[#E6DFD3]'
                      }`}
                    >
                      {city.nameBn.charAt(0)}
                    </span>
                    <div>
                      <div className="font-bold text-sm">{city.nameBn}</div>
                      <div className="text-[11px] text-[#8D7E7A]">
                        {city.nameEn} • {city.country}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#047857] text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF8F3] border-t border-[#E6DFD3] text-center text-[11px] text-[#8D7E7A]">
          বাংলাদেশের ৬৪টি জেলা ও প্রধান আন্তর্জাতিক শহরের সময়
        </div>
      </div>
    </div>
  );
}
