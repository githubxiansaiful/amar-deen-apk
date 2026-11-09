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
  HelpCircle,
  Award,
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-xs border border-emerald-600/20 group-hover:scale-105 transition">
                <Image
                  src="/app_icon.png"
                  alt="Amar Deen Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-emerald-900 tracking-tight leading-tight">
                  আমার দ্বীন
                </span>
                <span className="text-[10px] sm:text-xs text-amber-600 font-medium">
                  দৈনন্দিন ইসলামিক সঙ্গী
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* City Selector Button & More */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs sm:text-sm font-medium border border-emerald-200/60 transition shadow-xs cursor-pointer"
                title="স্থান পরিবর্তন করুন"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{currentCity.nameBn}</span>
              </button>

              <Link
                href="/settings"
                className="hidden sm:flex p-2 rounded-xl text-gray-500 hover:text-emerald-800 hover:bg-gray-50 transition"
                title="সেটিংস"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition focus:outline-hidden"
                aria-label="মোবাইল মেনু খুলুন"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Drawer / Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-gray-100 mt-2">
                <Link
                  href="/knowledge"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>ইসলামিক জ্ঞান ও শিক্ষা</span>
                </Link>
                <Link
                  href="/umrah"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>উমরাহ নির্দেশিকা</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span>সেটিংস ও হিসাব পদ্ধতি</span>
                </Link>
              </div>
            </div>
          </div>
        )}
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
