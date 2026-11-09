'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Check, Sunset, Sunrise } from 'lucide-react';
import { DayPrayerSchedule } from '@/lib/types';
import { toBengaliDigits } from '@/lib/utils';

interface NamajTimeHeroCardProps {
  schedule: DayPrayerSchedule;
  onClick?: () => void;
}

export default function NamajTimeHeroCard({
  schedule,
  onClick,
}: NamajTimeHeroCardProps) {
  const [liveBengaliTime, setLiveBengaliTime] = useState<string>('১২:০০');
  const [isNight, setIsNight] = useState<boolean>(false);
  const [celestialPct, setCelestialPct] = useState<number>(0.45);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const rawHour = now.getHours();
      const hour12 = rawHour % 12 || 12;
      const minute = now.getMinutes();
      const minPadded = minute < 10 ? `০${toBengaliDigits(minute)}` : toBengaliDigits(minute);
      setLiveBengaliTime(`${toBengaliDigits(hour12)}:${minPadded}`);

      // Check if night (after Maghrib or before Fajr)
      const nowTime = now.getTime();
      const maghribTime = schedule.maghrib.date.getTime();
      const fajrTime = schedule.fajr.date.getTime();
      const sunriseTime = schedule.sunrise.date.getTime();
      const night = nowTime >= maghribTime || nowTime < sunriseTime;
      setIsNight(night);

      // Celestial arc progress calculation (0.08 to 0.92)
      if (!night) {
        // Daytime: from Sunrise to Maghrib
        const totalDay = maghribTime - sunriseTime;
        const passedDay = nowTime - sunriseTime;
        const frac = Math.max(0.08, Math.min(0.92, passedDay / totalDay));
        setCelestialPct(frac);
      } else {
        // Nighttime: from Maghrib to Sunrise
        const tomorrowSunrise = new Date(schedule.sunrise.date);
        if (nowTime >= maghribTime) {
          tomorrowSunrise.setDate(tomorrowSunrise.getDate() + 1);
        }
        const totalNight = tomorrowSunrise.getTime() - maghribTime;
        const passedNight = Math.max(0, nowTime - maghribTime);
        const frac = Math.max(0.08, Math.min(0.92, passedNight / totalNight));
        setCelestialPct(frac);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, [schedule]);

  // Geometry calculations for Parabolic Arc
  // SVG coordinates: viewBox="0 0 400 160"
  const startX = 20;
  const endX = 380;
  const spanX = endX - startX;
  const peakY = 22;
  const baseY = 142;

  // Parabolic point at ratio s (0 to 1)
  const getArcPoint = (s: number) => {
    const x = startX + s * spanX;
    const norm = s - 0.5;
    const y = peakY + 4 * (baseY - peakY) * (norm * norm);
    return { x, y };
  };

  const currentPos = getArcPoint(celestialPct);

  // Generate SVG path for passed arc
  let passedPathD = `M ${startX} ${baseY}`;
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * celestialPct;
    const pt = getArcPoint(s);
    passedPathD += ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }

  // Generate SVG path for future arc
  let futurePathD = `M ${currentPos.x.toFixed(1)} ${currentPos.y.toFixed(1)}`;
  for (let i = 1; i <= steps; i++) {
    const s = celestialPct + (i / steps) * (1 - celestialPct);
    const pt = getArcPoint(s);
    futurePathD += ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }

  // Generate SVG path for filled area under passed arc
  const fillPathD = `${passedPathD} L ${currentPos.x.toFixed(1)} ${baseY} Z`;

  // Display texts
  const currentPrayerName = schedule.currentPrayer?.nameBn || 'ফজর';
  const currentPrayerTime = schedule.currentPrayer?.timeFormatted || schedule.fajr.timeFormatted;
  const currentPrayerEnd = schedule.currentPrayer?.endTimeFormatted || schedule.sunrise.timeFormatted;

  return (
    <div
      onClick={onClick}
      className={`w-full rounded-3xl bg-linear-to-b from-[#F1F5F9] to-[#E8EEF5] border border-[#DCE4ED] shadow-xs overflow-hidden transition ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      {/* ========================================== */}
      {/* TOP SECTION: CELESTIAL SKY & LIVE ARC */}
      {/* ========================================== */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden">
        {/* SVG Canvas: Mosque Silhouette + Celestial Arc */}
        <svg
          viewBox="0 0 400 160"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Glow fill gradient under passed arc */}
            <linearGradient id="arcGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* 1A. Background Mosque Architectural Silhouette */}
          <path
            d="M 0 160 L 0 104 L 48 104 L 48 48 L 42 48 L 42 45 L 54 45 L 54 48 L 48 48 L 51 26 L 54 48 L 54 104 L 88 104 Q 112 74 140 104 L 152 104 C 156 64 180 42 200 35 C 220 42 244 64 248 104 L 260 104 Q 288 74 312 104 L 345 104 L 345 48 L 340 48 L 340 45 L 352 45 L 352 48 L 345 48 L 349 26 L 352 48 L 352 104 L 400 104 L 400 160 Z"
            fill="#BAC9D8"
            fillOpacity="0.38"
          />

          {/* 1B. Gradient Light Fill under Passed Arc */}
          <path d={fillPathD} fill="url(#arcGlow)" />

          {/* 1C. Solid Golden Stroke for Passed Path */}
          <path
            d={passedPathD}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 1D. Dashed Golden Stroke for Future Path */}
          <path
            d={futurePathD}
            fill="none"
            stroke="#F59E0B"
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeDasharray="6,5"
            strokeLinecap="round"
          />

          {/* Endpoints Dots */}
          <circle cx={startX} cy={baseY} r="3.5" fill="#F59E0B" />
          <circle cx={endX} cy={baseY} r="3.5" fill="#F59E0B" fillOpacity="0.6" />
        </svg>

        {/* 2. Floating Celestial Pill Badge with Pulsing Halo */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
          style={{
            left: `${(currentPos.x / 400) * 100}%`,
            top: `${(currentPos.y / 160) * 100}%`,
          }}
        >
          {/* Pulsing Sonar Halo */}
          <div className="absolute inset-0 -m-2 rounded-full bg-amber-400/20 animate-ping pointer-events-none" />

          {/* Frosted Pill Surface */}
          <div className="relative px-2.5 py-1 bg-white/95 backdrop-blur-xs border border-[#CBD5E1] rounded-lg shadow-xs flex items-center space-x-1.5 select-none">
            {isNight ? (
              <Moon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="text-xs font-bold text-[#1E293B]">
              {liveBengaliTime}
            </span>
          </div>
        </div>

        {/* 3. Two Pillars Under the Arc (Left: Prayer Start | Right: Tahajjud/Sahri End) */}
        <div className="absolute inset-x-0 top-16 sm:top-18 px-4 flex items-center justify-between pointer-events-none z-10">
          {/* Left Pillar */}
          <div className="flex-1 text-center font-bold text-sm sm:text-base text-[#1E293B]">
            {currentPrayerName} {currentPrayerTime} মি.
          </div>

          {/* Center Hairline Divider */}
          <div className="w-[1px] h-5 bg-[#CBD5E1]" />

          {/* Right Pillar */}
          <div className="flex-1 text-center font-bold text-sm sm:text-base text-[#1E293B] flex items-center justify-center space-x-1.5">
            <span>তাহাজ্জুদ শেষ {schedule.sahurEndTimeFormatted} মি.</span>
            <span className="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-600/40 flex items-center justify-center text-emerald-700">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          </div>
        </div>

        {/* 4. Horizon Anchors (Bottom Corners: Sunset & Sunrise) */}
        <div className="absolute inset-x-0 bottom-1 px-4 flex items-center justify-between text-xs text-[#64748B] z-10 font-medium">
          <div className="flex items-center space-x-1">
            <Sunset className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{schedule.maghrib.timeFormatted}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sunrise className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{schedule.sunrise.timeFormatted}</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* BOTTOM SECTION: ACTIVE PRAYER & COUNTDOWN */}
      {/* ========================================== */}
      <div className="px-5 py-4 border-t border-[#DCE4ED] bg-white">
        {/* Top Row: Active Prayer Title & Range */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#1E293B]">
            {currentPrayerName}
          </span>
          <span className="text-sm sm:text-base font-bold text-[#1E293B]">
            {currentPrayerTime} - {currentPrayerEnd}
          </span>
        </div>

        {/* Progress Bar: Thick rounded track with vibrant emerald fill */}
        <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden my-3">
          <div
            className="h-full bg-[#047857] rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(
                100,
                Math.max(10, (1 - schedule.remainingMinutes / 180) * 100)
              )}%`,
            }}
          />
        </div>

        {/* Bottom Row: Live Beacon Status & Remaining Countdown */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          {/* Left: Live Beacon Indicator */}
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
              <span className="relative w-2 h-2 rounded-full bg-[#047857]" />
            </div>
            <span className="font-bold text-[#047857]">চলমান</span>
          </div>

          {/* Right: Remaining Countdown */}
          <div className="font-bold text-[#1E293B]">
            {schedule.remainingTimeFormatted}
          </div>
        </div>
      </div>
    </div>
  );
}
