import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import { Hind_Siliguri, Amiri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import BottomNavBar from '@/components/BottomNavBar';
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
  title: 'আমার দ্বীন - Amar Deen | দৈনন্দিন ইসলামিক পোর্টাল',
  description:
    'বাংলাদেশের ৬৪ জেলা ও আন্তর্জাতিক শহরের নির্ভুল নামাজের সময়সূচি, সম্পূর্ণ ১১৪ সূরা বাংলা উচ্চারণ ও অর্থ সহ কুরআন, কিবলা কম্পাস, ডিজিটাল তাসবিহ ও মাসনূন দোয়া।',
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
      <body className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#2C2523] antialiased font-bengali">
        <Suspense fallback={<div className="h-16 bg-[#FAF8F3] border-b border-[#E6DFD3]" />}>
          <Navbar />
        </Suspense>

        <main className="flex-1 pb-16">{children}</main>

        <Suspense fallback={null}>
          <BottomNavBar />
        </Suspense>

        <Footer />
      </body>
    </html>
  );
}
