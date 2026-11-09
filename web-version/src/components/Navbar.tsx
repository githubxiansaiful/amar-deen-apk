'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Clock,
  BookOpen,
  Compass,
  Sparkles,
  Heart,
  Moon,
  Menu,
  X,
  MapPin,
  Settings,
} from 'lucide-react';
import { CityOption } from '@/lib/types';
import { getStoredCity, setStoredCity } from '@/lib/storage';
import { DEFAULT_CITY } from '@/data/cities';
import CitySelectorModal from './CitySelectorModal';

const NAV_LINKS = [
  { href: '/prayer', label: 'নামাজ', icon: Clock },
  { href: '/quran', label: 'কুরআন', icon: BookOpen },
  { href: '/qibla', label: 'কিবলা', icon: Compass },
  { href: '/tasbih', label: 'তাসবিহ', icon: Sparkles },
  { href: '/duas', label: 'দোয়া', icon: Heart },
  { href: '/ramadan', label: 'রমজান', icon: Moon },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<CityOption>(DEFAULT_CITY);

  useEffect(() => {
    setCurrentCity(getStoredCity());

    const handleCityChange = () => {
      setCurrentCity(getStoredCity());
    };

    window.addEventListener('amardeen_city_changed', handleCityChange);
    return () => {
      window.removeEventListener('amardeen_city_changed', handleCityChange);
    };
  }, []);

  const handleSelectCity = (city: CityOption) => {
    setCurrentCity(city);
    setStoredCity(city.id);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-[#E6DFD3] group-hover:scale-105 transition">
                <Image
                  src="/app_icon.png"
                  alt="আমার দ্বীন"
                  fill
                  sizes="36px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#2C2523] tracking-tight leading-none">
                  আমার দ্বীন
                </span>
                <span className="text-[10px] text-[#D97706] font-bold mt-0.5">
                  Amar Deen
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-[#047857] text-white shadow-xs'
                        : 'text-[#6E615D] hover:text-[#2C2523] hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* City Selector Button & Settings */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF8F3] text-[#047857] rounded-xl text-xs font-bold border border-[#E6DFD3] transition shadow-xs cursor-pointer"
                title="স্থান পরিবর্তন করুন"
              >
                <MapPin className="w-3.5 h-3.5 text-[#047857]" />
                <span>{currentCity.nameBn}</span>
              </button>

              <Link
                href="/settings"
                className="p-2 rounded-xl text-[#6E615D] hover:text-[#2C2523] hover:bg-white transition"
                title="সেটিংস"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={currentCity}
        onSelectCity={handleSelectCity}
      />
    </>
  );
}
