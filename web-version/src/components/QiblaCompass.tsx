'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Info, AlertCircle } from 'lucide-react';
import { toBengaliDigits } from '@/lib/utils';

interface QiblaCompassProps {
  qiblaDegree: number;
  distanceKm: number;
  cityName: string;
}

export default function QiblaCompass({
  qiblaDegree,
  distanceKm,
  cityName,
}: QiblaCompassProps) {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState<boolean>(false);
  const [manualAngle, setManualAngle] = useState<number>(0);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      if ('webkitCompassHeading' in e && typeof (e as any).webkitCompassHeading === 'number') {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = 360 - e.alpha;
      }

      if (heading !== null) {
        setDeviceHeading(Math.round(heading));
        setSensorAvailable(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const effectiveNeedleRotation =
    deviceHeading !== null
      ? (qiblaDegree - deviceHeading + 360) % 360
      : (qiblaDegree - manualAngle + 360) % 360;

  return (
    <div className="w-full space-y-4">
      {/* 1. Degree & Distance Card (matching Android app) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6DFD3] shadow-xs text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#E6DFD3] text-xs font-bold text-[#047857]">
          📍 {cityName} থেকে কিবলার দিক
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#2C2523] tracking-tight">
          {toBengaliDigits(qiblaDegree)}° ডিগ্রি
        </h2>
        <p className="text-xs text-[#6E615D] font-medium">
          পবিত্র কাবার দূরত্ব: প্রায়{' '}
          <strong className="text-[#047857]">
            {toBengaliDigits(distanceKm.toLocaleString())} কিমি
          </strong>
        </p>
      </div>

      {/* 2. Compass Dial (matching Android app) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD3] shadow-xs flex flex-col items-center text-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#E6DFD3] bg-[#FAF8F3] flex items-center justify-center shadow-inner">
            {/* Markings */}
            <span className="absolute top-2.5 text-[11px] font-black text-[#8D7E7A]">উত্তর (N)</span>
            <span className="absolute bottom-2.5 text-[11px] font-black text-[#8D7E7A]">দক্ষিণ (S)</span>
            <span className="absolute left-2.5 text-[11px] font-black text-[#8D7E7A]">পশ্চিম (W)</span>
            <span className="absolute right-2.5 text-[11px] font-black text-[#8D7E7A]">পূর্ব (E)</span>

            {/* Inner Ring */}
            <div className="w-48 h-48 sm:w-54 sm:h-54 rounded-full border border-dashed border-[#047857]/30 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-[#E6DFD3] bg-white flex items-center justify-center">
                {/* Center Pivot */}
                <div className="w-4 h-4 rounded-full bg-[#047857] shadow-xs border-2 border-white z-20" />
              </div>
            </div>
          </div>

          {/* Qibla Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out pointer-events-none"
            style={{ transform: `rotate(${effectiveNeedleRotation}deg)` }}
          >
            {/* Kaaba Direction Top Arrow */}
            <div className="absolute top-4 flex flex-col items-center">
              <div className="px-2 py-0.5 bg-[#D97706] text-white rounded-md text-[10px] font-bold shadow-xs mb-1">
                কাবা
              </div>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[60px] border-b-[#047857] drop-shadow-xs" />
            </div>

            {/* Bottom Arrow */}
            <div className="absolute bottom-4 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[50px] border-t-[#C4B9A9]" />
            </div>
          </div>
        </div>

        {/* Status / Controls */}
        <div className="w-full mt-4 pt-4 border-t border-[#E6DFD3]/60 text-xs text-[#6E615D] space-y-2">
          {sensorAvailable ? (
            <div className="px-3 py-1.5 bg-[#ECFDF5] text-[#047857] font-bold rounded-xl inline-flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#047857] animate-ping" />
              <span>সেন্সর সক্রিয়: {toBengaliDigits(deviceHeading || 0)}°</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-1 text-[#8D7E7A] text-[11px] mb-2">
                <Info className="w-3.5 h-3.5 text-[#047857]" />
                <span>মোবাইলে সমতল রাখলে স্বয়ংক্রিয়ভাবে দিক নির্ণয় হবে</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={manualAngle}
                onChange={(e) => setManualAngle(Number(e.target.value))}
                className="w-full max-w-xs accent-[#047857] cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
