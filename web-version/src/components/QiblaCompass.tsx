'use client';

import React, { useState, useEffect } from 'react';
import { Compass, RotateCw, Navigation, Info, AlertCircle } from 'lucide-react';
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
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  useEffect(() => {
    // Test if device orientation is supported
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS Safari provides webkitCompassHeading
      if ('webkitCompassHeading' in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
        heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Standard Android/Chrome
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

  const requestOrientationPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
        } else {
          setPermissionState('denied');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Compass rotation angle
  // If sensor is active, the needle points towards (qiblaDegree - deviceHeading)
  const effectiveNeedleRotation =
    deviceHeading !== null
      ? (qiblaDegree - deviceHeading + 360) % 360
      : (qiblaDegree - manualAngle + 360) % 360;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 flex flex-col items-center max-w-lg mx-auto text-center">
      {/* City & Degree Header */}
      <div className="mb-6">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>{cityName} থেকে কিবলার দিক</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {toBengaliDigits(qiblaDegree)}° ডিগ্রি
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          পবিত্র কাবা শরিফের সরাসরি দূরত্ব: প্রায়{' '}
          <span className="font-semibold text-emerald-700">
            {toBengaliDigits(distanceKm.toLocaleString())} কিমি
          </span>
        </p>
      </div>

      {/* Compass Dial Visual */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-800/10 bg-linear-to-b from-emerald-50/50 to-white flex items-center justify-center shadow-inner">
          {/* Degree markings */}
          <div className="absolute top-2 text-xs font-bold text-gray-400">উত্তর (N)</div>
          <div className="absolute bottom-2 text-xs font-bold text-gray-400">দক্ষিণ (S)</div>
          <div className="absolute left-2 text-xs font-bold text-gray-400">পশ্চিম (W)</div>
          <div className="absolute right-2 text-xs font-bold text-gray-400">পূর্ব (E)</div>

          {/* Compass Rose Circular Marks */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-dashed border-emerald-300/60 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-emerald-100 flex items-center justify-center bg-emerald-50/30">
              {/* Central Pivot */}
              <div className="w-4 h-4 rounded-full bg-emerald-800 shadow-md z-20 border-2 border-white" />
            </div>
          </div>
        </div>

        {/* Qibla Indicator Needle */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out pointer-events-none"
          style={{ transform: `rotate(${effectiveNeedleRotation}deg)` }}
        >
          {/* Top Half of Needle (Kaaba Gold / Green) */}
          <div className="absolute top-4 flex flex-col items-center">
            <div className="px-2.5 py-1 bg-amber-500 text-white rounded-full text-[11px] font-bold shadow-md flex items-center space-x-1 mb-1 animate-bounce">
              <span>কাবা</span>
            </div>
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[60px] sm:border-b-[70px] border-b-emerald-600 drop-shadow-md" />
          </div>

          {/* Bottom Half of Needle */}
          <div className="absolute bottom-4 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[50px] sm:border-t-[60px] border-t-gray-300 drop-shadow-xs" />
          </div>
        </div>
      </div>

      {/* Sensor status / Manual Controls */}
      <div className="w-full mt-6 space-y-4">
        {sensorAvailable ? (
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>ডিভাইস কম্পাস সক্রিয় (হেডিং: {toBengaliDigits(deviceHeading || 0)}°)</span>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 space-y-2">
            <div className="flex items-center justify-center space-x-1.5 text-gray-700 font-medium">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>মোবাইল ব্রাউজারে কম্পাস সেন্সর সক্রিয় করতে ফোনটিকে সমতল রাখুন</span>
            </div>

            {typeof window !== 'undefined' &&
              typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === 'function' &&
              permissionState === 'prompt' && (
                <button
                  onClick={requestOrientationPermission}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-600 transition"
                >
                  কম্পাস অনুমতি দিন (iOS)
                </button>
              )}

            <div className="pt-2">
              <label className="text-[11px] text-gray-500 block mb-1">
                ম্যানুয়াল টেস্ট স্লাইডার (ঘুরিয়ে দেখুন):
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={manualAngle}
                onChange={(e) => setManualAngle(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/80 text-[11px] sm:text-xs text-amber-900 flex items-start space-x-2 text-left">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            নির্ভুল দিক নির্দেশনার জন্য ফোনটিকে কোনো চৌম্বকীয় বা ধাতব বস্তু (যেমন স্পিকার, ল্যাপটপ, ইলেকট্রনিক চার্জার) থেকে দূরে রাখুন।
          </span>
        </div>
      </div>
    </div>
  );
}
