'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import TasbihCounter from '@/components/TasbihCounter';

export default function TasbihPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 pb-24">
      {/* 1. Header Card matching Android app */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#E6DFD3] text-[#2C2523] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-[#2C2523]">ডিজিটাল তাসবিহ</h1>
            <p className="text-[11px] text-[#6E615D] font-medium">জিকির ও ইস্তিগফার কাউন্টার</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Main Counter */}
      <TasbihCounter />

      {/* 3. Virtues Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6DFD3] shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#2C2523] flex items-center space-x-1.5">
          <Heart className="w-4 h-4 text-[#047857]" />
          <span>দৈনিক জিকিরের বিশেষ ফজিলত</span>
        </h2>

        <div className="p-3 bg-[#ECFDF5] rounded-2xl border border-[#047857]/20 text-xs text-[#2C2523] leading-relaxed">
          <strong className="text-[#047857] block mb-0.5">ফরজ সালাত পরবর্তী তাসবিহ:</strong>
          প্রতি ফরজ সালাতের পর ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ, ৩৪ বার আল্লাহু আকবার পাঠে পূর্বের সগিরা গুনাহ ক্ষমা হয়ে যায়। (সহিহ মুসলিম)।
        </div>
      </div>
    </div>
  );
}
