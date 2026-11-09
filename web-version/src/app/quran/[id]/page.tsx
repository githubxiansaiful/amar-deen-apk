'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  Copy,
  Bookmark,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Ayah, SurahMeta } from '@/lib/types';
import { SURAH_CONTEXT_MAP } from '@/data/surahContext';
import { setStoredBookmark } from '@/lib/storage';
import { toBengaliDigits } from '@/lib/utils';
import AudioPlayerBar from '@/components/AudioPlayerBar';

export default function SurahReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 text-center text-xs text-[#8D7E7A]">
          সূরা লোড হচ্ছে...
        </div>
      }
    >
      <SurahReaderContent />
    </Suspense>
  );
}

function SurahReaderContent() {
  const params = useParams();
  const router = useRouter();
  const surahId = Number(params?.id);

  const [surahMeta, setSurahMeta] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [bookmarkedAyah, setBookmarkedAyah] = useState<number | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<Ayah | null>(null);

  useEffect(() => {
    if (!surahId || isNaN(surahId) || surahId < 1 || surahId > 114) {
      router.push('/quran');
      return;
    }

    setLoading(true);

    fetch('/data/quran/surahs.json')
      .then((res) => res.json())
      .then((list: SurahMeta[]) => {
        const found = list.find((s) => s.number === surahId);
        if (found) setSurahMeta(found);
      });

    fetch(`/data/quran/surah_${surahId}.json`)
      .then((res) => res.json())
      .then((data: Ayah[]) => {
        setAyahs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load ayahs', err);
        setLoading(false);
      });
  }, [surahId, router]);

  const contextData = SURAH_CONTEXT_MAP[surahId];

  const handleCopyAyah = (ayah: Ayah) => {
    if (typeof navigator !== 'undefined') {
      const text = `${ayah.text}\n\nউচ্চারণ: ${ayah.pronunciationBn}\n\nঅনুবাদ: ${ayah.translationBn}\n\n[সূরা ${surahMeta?.bengaliName || ''}: আয়াত ${ayah.numberInSurah}]`;
      navigator.clipboard.writeText(text);
      setCopiedAyah(ayah.numberInSurah);
      setTimeout(() => setCopiedAyah(null), 2000);
    }
  };

  const handleBookmarkAyah = (ayah: Ayah) => {
    if (!surahMeta) return;
    setStoredBookmark({
      surahNumber: surahId,
      surahNameBn: surahMeta.bengaliName,
      ayahNumber: ayah.numberInSurah,
      updatedAt: new Date().toISOString(),
    });
    setBookmarkedAyah(ayah.numberInSurah);
    setTimeout(() => setBookmarkedAyah(null), 2500);
  };

  const handlePlayNext = () => {
    if (!playingAyah) return;
    const nextIndex = ayahs.findIndex((a) => a.numberInSurah === playingAyah.numberInSurah) + 1;
    if (nextIndex < ayahs.length) {
      setPlayingAyah(ayahs[nextIndex]);
    }
  };

  const handlePlayPrev = () => {
    if (!playingAyah) return;
    const prevIndex = ayahs.findIndex((a) => a.numberInSurah === playingAyah.numberInSurah) - 1;
    if (prevIndex >= 0) {
      setPlayingAyah(ayahs[prevIndex]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-44 bg-white rounded-3xl border border-[#E6DFD3]" />
        <div className="h-32 bg-white rounded-3xl border border-[#E6DFD3]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 pb-32 space-y-4">
      {/* 1. Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/quran"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-[#E6DFD3] text-xs font-bold text-[#047857] hover:bg-[#FAF8F3] transition shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল সূরা</span>
        </Link>

        <div className="flex items-center space-x-1.5">
          {surahId > 1 && (
            <Link
              href={`/quran/${surahId - 1}`}
              className="px-2.5 py-1.5 bg-white border border-[#E6DFD3] rounded-xl text-xs font-bold text-[#2C2523] hover:bg-[#FAF8F3]"
            >
              পূর্ববর্তী
            </Link>
          )}
          {surahId < 114 && (
            <Link
              href={`/quran/${surahId + 1}`}
              className="px-2.5 py-1.5 bg-white border border-[#E6DFD3] rounded-xl text-xs font-bold text-[#2C2523] hover:bg-[#FAF8F3]"
            >
              পরবর্তী
            </Link>
          )}
        </div>
      </div>

      {/* 2. Surah Header Card (matching Android app) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6DFD3] shadow-xs text-center space-y-2">
        <div className="font-arabic text-4xl text-[#047857]">
          {surahMeta?.name}
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#2C2523]">
          সূরা {surahMeta?.bengaliName}
        </h1>
        <p className="text-xs text-[#6E615D] font-medium">
          {surahMeta?.englishName} • {surahMeta?.englishNameTranslation}
        </p>

        <div className="flex items-center justify-center space-x-2 pt-1 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] border border-[#E6DFD3] text-[#2C2523] font-bold">
            {surahMeta?.revelationType === 'Meccan' ? 'মাক্কী সূরা' : 'মাদানী সূরা'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] border border-[#E6DFD3] text-[#2C2523] font-bold">
            মোট আয়াত: {toBengaliDigits(ayahs.length)}
          </span>
        </div>

        {contextData && (
          <div className="pt-2">
            <button
              onClick={() => setShowContext(!showContext)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7] text-xs font-bold transition cursor-pointer border border-[#FDE68A]"
            >
              <Info className="w-3.5 h-3.5" />
              <span>
                {showContext ? 'প্রেক্ষাপট লুকান' : 'শানে নুযূল ও ফজিলত'}
              </span>
              {showContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Context Details */}
      {contextData && showContext && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-3xl p-5 space-y-3 text-xs text-[#2C2523]">
          <div>
            <span className="font-bold text-[#D97706] block mb-0.5">নামকরণ:</span>
            <p className="text-[#6E615D] leading-relaxed">{contextData.namkoron}</p>
          </div>
          <div>
            <span className="font-bold text-[#D97706] block mb-0.5">শানে নুযূল:</span>
            <p className="text-[#6E615D] leading-relaxed">{contextData.shaneNuzul}</p>
          </div>
          <div>
            <span className="font-bold text-[#D97706] block mb-0.5">ফজিলত:</span>
            <p className="text-[#6E615D] leading-relaxed">{contextData.fazilat}</p>
          </div>
        </div>
      )}

      {/* 3. Bismillah Banner (except Surah 9) */}
      {surahId !== 9 && (
        <div className="text-center py-4 px-3 bg-white rounded-2xl border border-[#E6DFD3] shadow-xs">
          <div className="font-arabic text-2xl text-[#047857]">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
          <div className="text-[11px] text-[#6E615D] mt-0.5">
            শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু
          </div>
        </div>
      )}

      {/* 4. Ayah Cards (exact matching Android app) */}
      <div className="space-y-3">
        {ayahs.map((ayah) => {
          const isPlayingThis = playingAyah?.numberInSurah === ayah.numberInSurah;
          const isCopied = copiedAyah === ayah.numberInSurah;
          const isBookmarked = bookmarkedAyah === ayah.numberInSurah;

          return (
            <article
              key={ayah.numberInSurah}
              id={`ayah-${ayah.numberInSurah}`}
              className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-150 ${
                isPlayingThis
                  ? 'border-[#047857] ring-2 ring-[#047857]/20 shadow-md'
                  : 'border-[#E6DFD3] shadow-xs'
              }`}
            >
              {/* Header: Ayah Number Badge & Actions */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]/60">
                <span className="w-8 h-8 rounded-xl bg-[#FAF8F3] border border-[#E6DFD3] text-[#2C2523] font-black flex items-center justify-center text-xs">
                  {toBengaliDigits(ayah.numberInSurah)}
                </span>

                <div className="flex items-center space-x-1">
                  {ayah.audioUrl && (
                    <button
                      onClick={() => setPlayingAyah(ayah)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isPlayingThis
                          ? 'bg-[#047857] text-white'
                          : 'text-[#6E615D] hover:text-[#047857] hover:bg-[#ECFDF5]'
                      }`}
                      title="তেলাওয়াত"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyAyah(ayah)}
                    className="p-1.5 text-[#6E615D] hover:text-[#047857] hover:bg-[#ECFDF5] rounded-lg transition cursor-pointer"
                    title="অনুলিপি"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-[#047857]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleBookmarkAyah(ayah)}
                    className="p-1.5 text-[#6E615D] hover:text-[#D97706] hover:bg-[#FFFBEB] rounded-lg transition cursor-pointer"
                    title="বুকমার্ক"
                  >
                    {isBookmarked ? (
                      <Check className="w-4 h-4 text-[#D97706]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Verse Text */}
              <div className="py-4 text-right font-arabic text-2xl sm:text-3xl text-[#2C2523] leading-loose">
                {ayah.text}
              </div>

              {/* Pronunciation & Translation Strips matching Android app */}
              <div className="space-y-2 pt-2">
                {/* Pronunciation Strip */}
                <div className="bg-[#F5EFE4] rounded-2xl p-3 border border-[#E6DFD3]/60">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider block mb-0.5">
                    উচ্চারণ
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-[#2C2523] leading-relaxed">
                    {ayah.pronunciationBn}
                  </p>
                </div>

                {/* Translation Strip */}
                <div className="bg-[#FAF7EE] rounded-2xl p-3 border border-[#E6DFD3]/60">
                  <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block mb-0.5">
                    অনুবাদ
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#2C2523] leading-relaxed">
                    {ayah.translationBn}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Floating Audio Player Bar */}
      {playingAyah && playingAyah.audioUrl && (
        <AudioPlayerBar
          surahNameBn={surahMeta?.bengaliName || ''}
          ayahNumberInSurah={playingAyah.numberInSurah}
          totalAyahs={ayahs.length}
          audioUrl={playingAyah.audioUrl}
          onPrevAyah={handlePlayPrev}
          onNextAyah={handlePlayNext}
          onClose={() => setPlayingAyah(null)}
        />
      )}
    </div>
  );
}
