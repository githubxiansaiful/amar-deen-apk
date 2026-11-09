'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Clock, Heart, LayoutGrid } from 'lucide-react';

const TABS = [
  { href: '/', label: 'হোম', icon: Home },
  { href: '/quran', label: 'কুরআন', icon: BookOpen },
  { href: '/prayer', label: 'নামাজ', icon: Clock },
  { href: '/duas', label: 'দোয়া', icon: Heart },
  { href: '/settings', label: 'মেনু', icon: LayoutGrid },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 pointer-events-none flex justify-center">
      <nav className="pointer-events-auto w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl border border-[#E6DFD3] shadow-xl px-2 py-1.5 flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-[#047857] font-bold bg-[#ECFDF5]'
                  : 'text-[#8D7E7A] hover:text-[#2C2523] font-medium'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
