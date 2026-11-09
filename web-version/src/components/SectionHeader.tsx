'use client';

import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  accentColor?: string; // hex, default #047857
  subtitle?: string;
  actionHref?: string;
  actionText?: string;
}

export default function SectionHeader({
  title,
  accentColor = '#047857',
  subtitle,
  actionHref,
  actionText,
}: SectionHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between px-1 py-1">
      <div className="flex items-center space-x-2.5">
        <div
          className="w-1 h-4.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <h2 className="text-base sm:text-lg font-bold text-[#2C2523]">
          {title}
        </h2>
      </div>

      {actionHref && actionText ? (
        <Link
          href={actionHref}
          className="text-xs sm:text-sm font-bold text-[#047857] hover:underline"
        >
          {actionText}
        </Link>
      ) : subtitle ? (
        <span className="text-xs text-[#6E615D] font-medium">{subtitle}</span>
      ) : null}
    </div>
  );
}
