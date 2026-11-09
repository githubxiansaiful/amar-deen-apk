'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Moon,
  Calendar,
  BookOpen,
  GraduationCap,
  Bookmark,
  LayoutGrid,
} from 'lucide-react';

const SHORTCUTS = [
  {
    title: 'তাসবিহ',
    icon: Sparkles,
    route: '/tasbih',
    color: '#047857',
    bgColor: 'rgba(4, 120, 87, 0.12)',
  },
  {
    title: 'কিবলা',
    icon: Compass,
    route: '/qibla',
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.12)',
  },
  {
    title: 'যিকির',
    icon: Moon,
    route: '/duas',
    color: '#047857',
    bgColor: 'rgba(4, 120, 87, 0.12)',
  },
  {
    title: 'রমজান',
    icon: Calendar,
    route: '/ramadan',
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.12)',
  },
  {
    title: 'উমরাহ',
    icon: BookOpen,
    route: '/umrah',
    color: '#047857',
    bgColor: 'rgba(4, 120, 87, 0.12)',
  },
  {
    title: 'জ্ঞান ও যাকাত',
    icon: GraduationCap,
    route: '/knowledge',
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.12)',
  },
  {
    title: 'বুকমার্কস',
    icon: Bookmark,
    route: '/quran',
    color: '#047857',
    bgColor: 'rgba(4, 120, 87, 0.12)',
  },
  {
    title: 'মেনু',
    icon: LayoutGrid,
    route: '/settings',
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.12)',
  },
];

export default function QuickShortcutsGrid() {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
      {SHORTCUTS.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            href={item.route}
            className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E6DFD3] shadow-xs hover:border-[#047857]/40 hover:shadow-sm transition-all duration-150 flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-transform duration-150 group-hover:scale-105"
              style={{ backgroundColor: item.bgColor }}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: item.color }} />
            </div>

            <span className="text-xs sm:text-sm font-bold text-[#2C2523] group-hover:text-[#047857] transition leading-tight">
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
