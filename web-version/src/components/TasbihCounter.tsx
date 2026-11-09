'use client';

import React, { useState } from 'react';
import { TASBIH_PRESETS } from '@/data/tasbih';
import { PresetTasbih } from '@/lib/types';
import { RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import { toBengaliDigits } from '@/lib/utils';

export default function TasbihCounter() {
  const [currentPreset, setCurrentPreset] = useState<PresetTasbih>(TASBIH_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Play a gentle soft click using Web Audio API
  const playClickSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext might be restricted until user gesture
    }
  };

  const handleIncrement = () => {
    playClickSound();

    // Haptic vibration
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    const nextCount = count + 1;
    if (nextCount >= currentPreset.defaultTarget) {
      setCount(0);
      setRounds((prev) => prev + 1);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setRounds(0);
  };

  const handleSelectPreset = (preset: PresetTasbih) => {
    setCurrentPreset(preset);
    setCount(0);
    setRounds(0);
  };

  const target = currentPreset.defaultTarget;
  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Preset Selector Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {TASBIH_PRESETS.map((preset) => {
          const isSelected = preset.nameBn === currentPreset.nameBn;
          return (
            <button
              key={preset.nameBn}
              onClick={() => handleSelectPreset(preset)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {preset.nameBn}
            </button>
          );
        })}
      </div>

      {/* Main Counter Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 flex flex-col items-center text-center">
        {/* Dhikr Arabic & Meaning */}
        <div className="mb-6 space-y-2">
          <div className="text-3xl sm:text-4xl font-arabic text-emerald-800 leading-relaxed">
            {currentPreset.arabic}
          </div>
          <div className="text-base font-bold text-gray-900">
            {currentPreset.pronunciationBn}
          </div>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            {currentPreset.meaningBn}
          </p>
        </div>

        {/* Big Tap Circle with Progress Ring */}
        <div className="relative my-4 flex items-center justify-center">
          {/* SVG Progress Circle */}
          <svg className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-gray-100"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-emerald-600 transition-all duration-150"
              strokeWidth="8"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Touch Target */}
          <button
            onClick={handleIncrement}
            className="absolute w-44 h-44 sm:w-50 sm:h-50 rounded-full bg-linear-to-b from-emerald-600 to-emerald-800 text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform duration-100 cursor-pointer select-none"
            aria-label="গণনা বৃদ্ধি করুন"
          >
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {toBengaliDigits(count)}
            </span>
            <span className="text-xs text-emerald-200 mt-1">
              লক্ষ্য: {toBengaliDigits(target)}
            </span>
          </button>
        </div>

        {/* Counter Info Bar */}
        <div className="flex items-center justify-between w-full mt-4 px-4 text-xs text-gray-500">
          <div>
            মোট চক্র:{' '}
            <span className="font-bold text-emerald-800">
              {toBengaliDigits(rounds)} বার
            </span>
          </div>
          <div>
            অগ্রগতি:{' '}
            <span className="font-bold text-emerald-800">
              {toBengaliDigits(progressPercent)}%
            </span>
          </div>
        </div>

        {/* Action Controls: Sound & Reset */}
        <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-gray-100 w-full">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-2xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}
            title={soundEnabled ? 'শব্দ বন্ধ করুন' : 'শব্দ চালু করুন'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-semibold transition cursor-pointer"
            title="গণনা রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
            <span>পুনরায় শুরু</span>
          </button>
        </div>
      </div>
    </div>
  );
}
