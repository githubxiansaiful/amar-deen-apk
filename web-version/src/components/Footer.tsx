'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShieldCheck, Download, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FAF8F3] text-[#6E615D] border-t border-[#E6DFD3] pb-24 pt-8 text-xs">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-[#E6DFD3]">
            <Image
              src="/app_icon.png"
              alt="আমার দ্বীন"
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          <span className="text-base font-black text-[#2C2523]">
            আমার দ্বীন (Amar Deen)
          </span>
        </div>

        <p className="max-w-md mx-auto text-[#8D7E7A] leading-relaxed">
          দৈনন্দিন জীবনের প্রতিটি মুহূর্তে ইবাদত ও দ্বীনি দিকনির্দেশনার জন্য সম্পূর্ণ বিজ্ঞাপনমুক্ত ইসলামিক পোর্টাল।
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 font-semibold text-[#047857]">
          <Link href="/prayer" className="hover:underline">নামাজ</Link>
          <span>•</span>
          <Link href="/quran" className="hover:underline">কুরআন</Link>
          <span>•</span>
          <Link href="/qibla" className="hover:underline">কিবলা</Link>
          <span>•</span>
          <Link href="/tasbih" className="hover:underline">তাসবিহ</Link>
          <span>•</span>
          <Link href="/duas" className="hover:underline">দোয়া</Link>
          <span>•</span>
          <a
            href="https://githubxiansaiful.github.io/amar-deen-apk/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            গোপনীয়তা নীতি
          </a>
        </div>

        <div className="pt-2 text-[11px] text-[#8D7E7A] border-t border-[#E6DFD3]/60 flex items-center justify-between">
          <span>© 2026 আমার দ্বীন। সর্বস্বত্ব সংরক্ষিত।</span>
          <span className="flex items-center space-x-1">
            <span>উম্মাহর সেবায়</span>
            <Heart className="w-3 h-3 text-[#D97706] fill-[#D97706]" />
          </span>
        </div>
      </div>
    </footer>
  );
}
