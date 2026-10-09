import React from 'react';
import { CardStats } from '../utils/avatarGenerator';

interface AvatarCardProps {
  playerName: string;
  avatarDataUrl: string;
  stats: CardStats;
  className?: string;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  playerName,
  avatarDataUrl,
  stats,
  className = '',
}) => {
  const displayName = (playerName.trim() || 'PIXEL PLAYER').toUpperCase();

  return (
    <div
      className={`relative w-full max-w-[432px] aspect-[3/4] bg-[#161D26] rounded-lg p-6 sm:p-7 flex flex-col items-center justify-between border-2 border-[#362F4B] shadow-2xl select-none overflow-hidden ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* 1. Top Heading: Bold Purple Pixel Font */}
      <div className="w-full text-center pt-2">
        <h2 className="font-pixel text-base sm:text-lg font-bold tracking-wider text-[#A855F7] drop-shadow-[0_2px_4px_rgba(76,29,149,0.8)] truncate px-2">
          {displayName}
        </h2>
      </div>

      {/* 2. Central Avatar with Thick Geometric Stepped Pixel Purple Border */}
      <div className="relative my-auto flex items-center justify-center p-3">
        {/* SVG Geometric Stepped Pixel Frame with Rectangular Protrusions (Top, Bottom, Sides) */}
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Deep Purple Contour */}
            {/* Main Outer Box */}
            <rect x="16" y="16" width="208" height="208" fill="#6B21A8" stroke="#4C1D95" strokeWidth="4" />
            
            {/* Rectangular Protrusions: Top, Bottom, Left, Right Tabs */}
            {/* Top Tab */}
            <rect x="75" y="6" width="90" height="14" fill="#6B21A8" stroke="#4C1D95" strokeWidth="3" />
            <rect x="85" y="9" width="70" height="4" fill="#C084FC" />

            {/* Bottom Tab */}
            <rect x="75" y="220" width="90" height="14" fill="#6B21A8" stroke="#4C1D95" strokeWidth="3" />
            <rect x="85" y="227" width="70" height="4" fill="#C084FC" />

            {/* Left Tab */}
            <rect x="6" y="75" width="14" height="90" fill="#6B21A8" stroke="#4C1D95" strokeWidth="3" />
            <rect x="9" y="85" width="4" height="70" fill="#C084FC" />

            {/* Right Tab */}
            <rect x="220" y="75" width="14" height="90" fill="#6B21A8" stroke="#4C1D95" strokeWidth="3" />
            <rect x="227" y="85" width="4" height="70" fill="#C084FC" />

            {/* Stepped Pixel Corners: Notches */}
            <rect x="16" y="16" width="16" height="16" fill="#161D26" />
            <rect x="208" y="16" width="16" height="16" fill="#161D26" />
            <rect x="16" y="208" width="16" height="16" fill="#161D26" />
            <rect x="208" y="208" width="16" height="16" fill="#161D26" />

            {/* Inner Purple Inset Border (#A855F7) */}
            <rect x="24" y="24" width="192" height="192" stroke="#A855F7" strokeWidth="6" />
            <rect x="28" y="28" width="184" height="184" stroke="#3B0764" strokeWidth="2" />
          </svg>

          {/* Avatar Image in Center Cutout */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 bg-[#161D26] overflow-hidden rounded-xs z-0">
            <img
              src={avatarDataUrl}
              alt="8-bit Minecraft Character Avatar"
              className="w-full h-full object-cover pixelated"
            />
          </div>
        </div>
      </div>

      {/* 3. Stats Section: 4 Stat Labels Below Avatar in Compact Two-Column Layout */}
      <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 px-1 my-1">
        {/* Left Column */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="p-1.5 sm:p-2 rounded bg-[#A855F7]/10 border border-[#4C1D95] text-left">
            <span className="block font-pixel text-[9px] sm:text-[10px] text-[#C084FC] tracking-wider leading-tight">
              Rizz Level -
            </span>
            <span className="block font-pixel text-[10px] sm:text-[11px] text-[#F5F3FF] font-bold mt-1">
              {stats.rizzLevel || '10/10'}
            </span>
          </div>

          <div className="p-1.5 sm:p-2 rounded bg-[#A855F7]/10 border border-[#4C1D95] text-left">
            <span className="block font-pixel text-[9px] sm:text-[10px] text-[#C084FC] tracking-wider leading-tight">
              Flag Status -
            </span>
            <span className="block font-pixel text-[10px] sm:text-[11px] text-[#F5F3FF] font-bold mt-1">
              {stats.flagStatus || 'Green?'}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="p-1.5 sm:p-2 rounded bg-[#A855F7]/10 border border-[#4C1D95] text-left">
            <span className="block font-pixel text-[9px] sm:text-[10px] text-[#C084FC] tracking-wider leading-tight">
              Aura Points -
            </span>
            <span className="block font-pixel text-[10px] sm:text-[11px] text-[#F5F3FF] font-bold mt-1">
              {stats.auraPoints || '1000+'}
            </span>
          </div>

          <div className="p-1.5 sm:p-2 rounded bg-[#A855F7]/10 border border-[#4C1D95] text-left">
            <span className="block font-pixel text-[9px] sm:text-[10px] text-[#C084FC] tracking-wider leading-tight">
              Social Battery -
            </span>
            <span className="block font-pixel text-[10px] sm:text-[11px] text-[#F5F3FF] font-bold mt-1">
              {stats.socialBattery || 'LOW'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Footer: AWSnap by AWS SBG NMIET */}
      <div className="w-full text-center pb-2 pt-1">
        <span className="font-pixel text-base sm:text-lg font-bold text-[#A855F7] tracking-wider">
          AWSnap
        </span>
        <span className="block text-[11px] sm:text-xs text-[#B8AECF] font-semibold tracking-wide mt-0.5">
          by AWS SBG NMIET
        </span>
      </div>
    </div>
  );
};
