'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShieldCheck, Download, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-white mt-auto border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/30">
                <Image
                  src="/app_icon.png"
                  alt="Amar Deen"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                আমার দ্বীন <span className="text-amber-400 text-sm font-normal">(Amar Deen)</span>
              </span>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed max-w-md">
              দৈনন্দিন জীবনের প্রতিটি মুহূর্তে ইবাদত ও দ্বীনি দিকনির্দেশনার জন্য একটি পূর্ণাঙ্গ, বিজ্ঞাপনমুক্ত ইসলামিক প্ল্যাটফর্ম। সঠিক নামাজের ওয়াক্ত, সম্পূর্ণ বাংলা কুরআন, কিবলা কম্পাস, ডিজিটাল তাসবিহ এবং সহিহ হাদিস সম্বলিত মাসনূন দোয়া।
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>সহিহ হাদিস ও নির্ভুল গণনার নিশ্চয়তা • সম্পূর্ণ বিজ্ঞাপনমুক্ত</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">
              প্রধান বিভাগসমূহ
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-200">
              <li>
                <Link href="/prayer" className="hover:text-white transition">
                  নামাজের সময়সূচি ও হারাম ওয়াক্ত
                </Link>
              </li>
              <li>
                <Link href="/quran" className="hover:text-white transition">
                  পবিত্র কুরআনুল কারীম (১১৪ সূরা)
                </Link>
              </li>
              <li>
                <Link href="/qibla" className="hover:text-white transition">
                  কিবলা কম্পাস ও দিকদর্শন
                </Link>
              </li>
              <li>
                <Link href="/tasbih" className="hover:text-white transition">
                  ডিজিটাল তাসবিহ কাউন্টার
                </Link>
              </li>
              <li>
                <Link href="/duas" className="hover:text-white transition">
                  মাসনূন দোয়া ও সকাল-সন্ধ্যার জিকির
                </Link>
              </li>
              <li>
                <Link href="/ramadan" className="hover:text-white transition">
                  পবিত্র রমজান ও সিয়াম নির্দেশিকা
                </Link>
              </li>
            </ul>
          </div>

          {/* App Download & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
              মোবাইল অ্যাপ
            </h3>
            <p className="text-xs text-emerald-300">
              ইন্টারনেট ছাড়াই অফলাইনে সম্পূর্ণ অ্যাপ ব্যবহার করতে আপনার অ্যান্ড্রয়েড ডিভাইসে ইনস্টল করুন।
            </p>
            <a
              href="https://github.com/githubxiansaiful/amar-deen-apk/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Android APK ডাউনলোড</span>
            </a>
            <div className="pt-2 text-xs text-emerald-300 space-y-1">
              <div>
                <a
                  href="https://githubxiansaiful.github.io/amar-deen-apk/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center space-x-1"
                >
                  <span>গোপনীয়তা নীতি (Privacy Policy)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <Link href="/settings" className="hover:underline">
                  গণনা পদ্ধতি ও মাযহাব সেটিংস
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400">
          <p>© 2026 আমার দ্বীন (Amar Deen). সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>উম্মাহর সেবায় নিবেদিত</span>
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}
