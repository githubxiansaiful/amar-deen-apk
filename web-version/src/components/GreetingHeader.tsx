'use client';

import React from 'react';

interface GreetingHeaderProps {
  cityName: string;
  hijriDate: string;
  gregorianDate: string;
  onCityClick: () => void;
}

export default function GreetingHeader({
  cityName,
  hijriDate,
  gregorianDate,
  onCityClick,
}: GreetingHeaderProps) {
  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-black text-[#2C2523] tracking-tight">
          আসসালামু আলাইকুম
        </h1>

        <button
          onClick={onCityClick}
          className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#E6DFD3] rounded-xl text-xs sm:text-sm font-bold text-[#047857] transition flex items-center space-x-1 cursor-pointer shrink-0"
        >
          <span>📍 {cityName} ⌵</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-[#6E615D] font-medium mt-1.5">
        {hijriDate} • {gregorianDate}
      </p>
    </div>
  );
}
