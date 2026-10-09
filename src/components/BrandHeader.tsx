import React from 'react';

export const BrandHeader: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between py-2.5 sm:py-3 px-6 sm:px-8 border-b border-[#2E2640]/50 bg-[#161D26] z-20 flex-shrink-0">
      {/* Brand Identity at top-left */}
      <div className="flex flex-col">
        <span className="font-pixel text-xl sm:text-2xl font-bold tracking-tight text-[#A855F7] leading-none">
          AWSnap
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#B8AECF] tracking-wide mt-1">
          by AWS SBG NMIET
        </span>
      </div>

      {/* Subtle Technical Badge on top-right */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border border-[#3B3252] bg-[#1E2633]/60 text-xs font-mono text-[#B8AECF]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C084FC] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C084FC] shadow-[0_0_8px_#C084FC]"></span>
        </span>
        <span>8-BIT PHOTOBOOTH LIVE</span>
      </div>
    </header>
  );
};
