'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
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
    <React.Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
          সূরা লোড হচ্ছে...
        </div>
      }
    >
      <SurahReaderContent />
    </React.Suspense>
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

  // Audio player state
  const [playingAyah, setPlayingAyah] = useState<Ayah | null>(null);

  useEffect(() => {
    if (!surahId || isNaN(surahId) || surahId < 1 || surahId > 114) {
      router.push('/quran');
      return;
    }

    setLoading(true);

    // Fetch surah list for metadata
    fetch('/data/quran/surahs.json')
      .then((res) => res.json())
      .then((list: SurahMeta[]) => {
        const found = list.find((s) => s.number === surahId);
        if (found) setSurahMeta(found);
      });

    // Fetch ayahs
    fetch(`/data/quran/surah_${surahId}.json`)
      .then((res) => res.json())
      .then((data: Ayah[]) => {
        setAyahs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load surah ayahs', err);
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
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-28 bg-gray-200 rounded-2xl" />
        <div className="h-28 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32 space-y-8">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/quran"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3.5 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল সূরা</span>
        </Link>

        <div className="flex items-center space-x-2">
          {surahId > 1 && (
            <Link
              href={`/quran/${surahId - 1}`}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              পূর্ববর্তী সূরা
            </Link>
          )}
          {surahId < 114 && (
            <Link
              href={`/quran/${surahId + 1}`}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              পরবর্তী সূরা
            </Link>
          )}
        </div>
      </div>

      {/* Surah Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800 text-center">
        <div className="space-y-2">
          <div className="font-arabic text-4xl sm:text-5xl text-amber-300 drop-shadow-md">
            {surahMeta?.name}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            সূরা {surahMeta?.bengaliName}
          </h1>
          <p className="text-emerald-200 text-xs sm:text-sm">
            {surahMeta?.englishName} • {surahMeta?.englishNameTranslation}
          </p>

          <div className="flex items-center justify-center space-x-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-emerald-200">
              {surahMeta?.revelationType === 'Meccan' ? 'মাক্কী সূরা' : 'মাদানী সূরা'}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-emerald-200">
              মোট আয়াত: {toBengaliDigits(ayahs.length)}
            </span>
          </div>
        </div>

        {/* Context Button */}
        {contextData && (
          <div className="mt-6 pt-4 border-t border-emerald-800/60">
            <button
              onClick={() => setShowContext(!showContext)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-xs font-semibold transition cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>
                {showContext ? 'প্রেক্ষাপট ও ফজিলত লুকান' : 'শানে নুযূল, নামকরণ ও ফজিলত দেখুন'}
              </span>
              {showContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Surah Context Details (Expandable) */}
      {contextData && showContext && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-gray-800 animate-in fade-in duration-200">
          <div>
            <h3 className="font-bold text-amber-900 text-base mb-1">নামকরণ:</h3>
            <p className="leading-relaxed text-gray-700">{contextData.namkoron}</p>
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-base mb-1">শানে নুযূল (অবতরণের পটভূমি):</h3>
            <p className="leading-relaxed text-gray-700">{contextData.shaneNuzul}</p>
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-base mb-1">ফজিলত ও গুরুত্ব:</h3>
            <p className="leading-relaxed text-gray-700">{contextData.fazilat}</p>
          </div>
        </div>
      )}

      {/* Bismillah Header (Except Surah 9) */}
      {surahId !== 9 && (
        <div className="text-center py-6 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <div className="font-arabic text-2xl sm:text-3xl text-emerald-900">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
          <div className="text-xs text-gray-500 mt-1">
            শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু
          </div>
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-6">
        {ayahs.map((ayah) => {
          const isPlayingThis = playingAyah?.numberInSurah === ayah.numberInSurah;
          const isCopied = copiedAyah === ayah.numberInSurah;
          const isBookmarked = bookmarkedAyah === ayah.numberInSurah;

          return (
            <article
              key={ayah.numberInSurah}
              id={`ayah-${ayah.numberInSurah}`}
              className={`bg-white rounded-3xl p-5 sm:p-7 border transition-all duration-200 ${
                isPlayingThis
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-gray-100 shadow-xs hover:border-gray-200'
              }`}
            >
              {/* Verse Top Bar: Number & Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-xs border border-emerald-100">
                  {toBengaliDigits(ayah.numberInSurah)}
                </span>

                <div className="flex items-center space-x-1.5">
                  {ayah.audioUrl && (
                    <button
                      onClick={() => setPlayingAyah(ayah)}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        isPlayingThis
                          ? 'bg-amber-400 text-emerald-950 font-bold'
                          : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title="তেলাওয়াত শুনুন"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyAyah(ayah)}
                    className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                    title="অনুলিপি করুন"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleBookmarkAyah(ayah)}
                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition cursor-pointer"
                    title="এখানে বুকমার্ক করুন"
                  >
                    {isBookmarked ? (
                      <Check className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Verse Text */}
              <div className="py-6 text-right font-arabic text-2xl sm:text-3xl text-gray-900 leading-loose">
                {ayah.text}
              </div>

              {/* Bengali Pronunciation & Translation */}
              <div className="space-y-3 pt-3 border-t border-gray-100 text-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
                    উচ্চারণ:
                  </span>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {ayah.pronunciationBn}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                    অনুবাদ:
                  </span>
                  <p className="text-gray-900 font-semibold leading-relaxed">
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
