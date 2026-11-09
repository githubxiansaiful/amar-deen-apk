'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { toBengaliDigits } from '@/lib/utils';

interface AudioPlayerBarProps {
  surahNameBn: string;
  ayahNumberInSurah: number;
  totalAyahs: number;
  audioUrl: string;
  onPrevAyah?: () => void;
  onNextAyah?: () => void;
  onClose?: () => void;
  autoPlay?: boolean;
}

export default function AudioPlayerBar({
  surahNameBn,
  ayahNumberInSurah,
  totalAyahs,
  audioUrl,
  onPrevAyah,
  onNextAyah,
  onClose,
  autoPlay = true,
}: AudioPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      if (autoPlay) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [audioUrl, autoPlay, playbackRate]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error(e));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (onNextAyah) {
      onNextAyah();
    }
  };

  const toggleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 0.75 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-50 bg-emerald-950/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-700/60 flex flex-col gap-2 animate-in slide-in-from-bottom duration-300">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Progress Bar */}
      <div className="w-full bg-emerald-900 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-400 h-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Reciter & Ayah Details */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-800 rounded-xl text-amber-300">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {surahNameBn} • আয়াত {toBengaliDigits(ayahNumberInSurah)} / {toBengaliDigits(totalAyahs)}
            </div>
            <div className="text-xs text-emerald-300">
              ক্বারী মিশারি রশিদ আল-আফাসি
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {onPrevAyah && (
            <button
              onClick={onPrevAyah}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
              title="পূর্ববর্তী আয়াত"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-md transition"
            title={isPlaying ? 'বিরতি' : 'বাজান'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-emerald-950" />
            ) : (
              <Play className="w-5 h-5 fill-emerald-950 ml-0.5" />
            )}
          </button>

          {onNextAyah && (
            <button
              onClick={onNextAyah}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
              title="পরবর্তী আয়াত"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleSpeed}
            className="px-2 py-1 bg-emerald-900 text-xs font-semibold rounded-md text-amber-300 hover:bg-emerald-800 transition"
            title="গতি পরিবর্তন"
          >
            {playbackRate}x
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-400 hover:text-white transition ml-1"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
