'use client';

import React from 'react';
import { Sparkles, Heart, Info, CheckCircle2 } from 'lucide-react';
import TasbihCounter from '@/components/TasbihCounter';

export default function TasbihPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>জিকির ও ইস্তিগফার</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          ডিজিটাল তাসবিহ কাউন্টার
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          ফরজ নামাজের পরবর্তী মাসনূন তাসবিহ (সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার) এবং প্রতিদিনের বরকতময় দরূদ ও ইস্তিগফার।
        </p>
      </div>

      {/* Main Counter */}
      <TasbihCounter />

      {/* Virtues Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-emerald-600" />
          <span>দৈনিক জিকিরের বিশেষ ফজিলত</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-1">
              ফরজ সালাত পরবর্তী তাসবিহ
            </h3>
            <p className="leading-relaxed">
              রাসূলুল্লাহ ﷺ বলেছেন: যে ব্যক্তি প্রতি নামাজের পর ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ, ৩৪ বার আল্লাহু আকবার পাঠ করে—তার পূর্ববর্তী সমস্ত সগিরা গুনাহ ক্ষমা করে দেওয়া হয়। (সহিহ মুসলিম)।
            </p>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
            <h3 className="font-bold text-amber-900 mb-1">
              সুবহানাল্লাহি ওয়া বিহামদিহি
            </h3>
            <p className="leading-relaxed">
              প্রতিদিন ১০০ বার &quot;সুবহানাল্লাহি ওয়া বিহামদিহি&quot; পাঠ করলে সাগরের ফেনা সমতুল্য গুনাহ থাকলেও আল্লাহ তা মাফ করে দেন। (সহিহ বুখারি)।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
