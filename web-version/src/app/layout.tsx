import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import { Hind_Siliguri, Amiri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const hindSiliguri = Hind_Siliguri({
  variable: '--font-bengali',
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const amiri = Amiri({
  variable: '--font-arabic',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'আমার দ্বীন - Amar Deen | নামাজের সময়সূচি, কুরআন ও ইসলামিক পোর্টাল',
  description:
    'বাংলাদেশের ৬৪ জেলা ও আন্তর্জাতিক শহরের নির্ভুল নামাজের সময়সূচি, সম্পূর্ণ ১১৪ সূরা বাংলা অনুবাদ ও অডিও তেলাওয়াত, কিবলা কম্পাস, ডিজিটাল তাসবিহ ও সহিহ মাসনূন দোয়া। সম্পূর্ণ বিজ্ঞাপনমুক্ত।',
  manifest: '/manifest.json',
  icons: {
    icon: '/app_icon.png',
    apple: '/app_icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#047857',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${amiri.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-bengali">
        <Suspense fallback={<div className="h-16 sm:h-20 bg-white border-b border-gray-100" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
