'use client';

import React, { useState } from 'react';
import { TASBIH_PRESETS } from '@/data/tasbih';
import { PresetTasbih } from '@/lib/types';
import { RotateCcw, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { toBengaliDigits } from '@/lib/utils';

export default function TasbihCounter() {
  const [currentPreset, setCurrentPreset] = useState<PresetTasbih>(TASBIH_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const playClickSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  };

  const handleIncrement = () => {
    playClickSound();

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    const nextCount = count + 1;
    setTodayTotal((prev) => prev + 1);

    if (nextCount >= currentPreset.defaultTarget) {
      setCount(0);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const target = currentPreset.defaultTarget;
  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return (
    <div className="w-full space-y-4">
      {/* 1. Preset Dhikr Chips (Horizontal Scroll) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {TASBIH_PRESETS.map((preset) => {
          const isSelected = preset.nameBn === currentPreset.nameBn;
          return (
            <button
              key={preset.nameBn}
              onClick={() => {
                setCurrentPreset(preset);
                setCount(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'bg-white text-[#6E615D] hover:bg-[#FAF8F3] border border-[#E6DFD3]'
              }`}
            >
              {preset.nameBn}
            </button>
          );
        })}
      </div>

      {/* 2. Active Dhikr Card (matching Android app) */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs text-center space-y-1.5">
        <div className="font-arabic text-3xl text-[#047857] leading-loose">
          {currentPreset.arabic}
        </div>
        <div className="text-base font-bold text-[#2C2523]">
          {currentPreset.pronunciationBn}
        </div>
        <p className="text-xs text-[#6E615D] font-medium leading-relaxed max-w-sm mx-auto">
          {currentPreset.meaningBn}
        </p>
      </div>

      {/* 3. Big Tap Circle with Progress Ring */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DFD3] shadow-xs flex flex-col items-center text-center">
        <div className="relative my-2 flex items-center justify-center">
          {/* SVG Progress Circle */}
          <svg className="w-56 h-56 sm:w-60 sm:h-60 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-[#E6DFD3]"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-[#047857] transition-all duration-150"
              strokeWidth="7"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Touch Target */}
          <button
            onClick={handleIncrement}
            className="absolute w-44 h-44 sm:w-46 sm:h-46 rounded-full bg-linear-to-b from-[#047857] to-[#065F46] text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform duration-100 cursor-pointer select-none"
            aria-label="গণনা বৃদ্ধি করুন"
          >
            <span className="text-4xl sm:text-5xl font-black tracking-tight">
              {toBengaliDigits(count)}
            </span>
            <span className="text-xs text-[#ECFDF5] font-semibold mt-1">
              লক্ষ্য: {toBengaliDigits(target)}
            </span>
          </button>
        </div>

        {/* Action Controls: Sound & Reset */}
        <div className="flex items-center justify-center space-x-3 mt-4 pt-4 border-t border-[#E6DFD3]/60 w-full">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-[#ECFDF5] text-[#047857] border-[#047857]/30'
                : 'bg-[#FAF8F3] text-[#8D7E7A] border-[#E6DFD3]'
            }`}
            title="শব্দ"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#FAF8F3] hover:bg-[#F3EFE6] text-[#2C2523] border border-[#E6DFD3] rounded-xl text-xs font-bold transition cursor-pointer"
            title="রিসেট"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>পুনরায় শুরু</span>
          </button>
        </div>
      </div>

      {/* 4. Total Stats Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6DFD3] shadow-xs flex items-center justify-between text-xs sm:text-sm font-bold text-[#2C2523]">
        <span>আজকের মোট তাসবিহ</span>
        <span className="text-[#047857] font-black text-base">
          {toBengaliDigits(todayTotal)} বার
        </span>
      </div>
    </div>
  );
}
