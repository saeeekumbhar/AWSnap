import React from 'react';
import { CardStats } from '../utils/avatarGenerator';

interface AvatarCardProps {
  playerName: string;
  avatarDataUrl: string;
  stats: CardStats;
  className?: string;
}

// 9x9 Grid layout of purple microchip blocks surrounding the center 5x5 image
const CHIP_BLOCKS = [
  // Top teeth (row 0)
  { r: 0, c: 2 }, { r: 0, c: 4 }, { r: 0, c: 6 },
  // Top base row (row 1)
  { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 },

  // Left teeth (col 0)
  { r: 2, c: 0 }, { r: 4, c: 0 }, { r: 6, c: 0 },
  // Left base col (col 1)
  { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 4, c: 1 }, { r: 5, c: 1 }, { r: 6, c: 1 },

  // Right base col (col 7)
  { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 },
  // Right teeth (col 8)
  { r: 2, c: 8 }, { r: 4, c: 8 }, { r: 6, c: 8 },

  // Bottom base row (row 7)
  { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 },
  // Bottom teeth (row 8)
  { r: 8, c: 2 }, { r: 8, c: 4 }, { r: 8, c: 6 },
];

export const AvatarCard: React.FC<AvatarCardProps> = ({
  playerName,
  avatarDataUrl,
  stats,
  className = '',
}) => {
  const displayName = playerName.trim() || 'Name';

  return (
    <div
      className={`relative w-full max-w-[350px] sm:max-w-[375px] bg-[#141A23] rounded-sm p-4 sm:p-5 flex flex-col items-center justify-between border border-[#273244] shadow-2xl select-none overflow-hidden ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        backgroundPosition: 'center',
      }}
    >
      {/* 1. Top Heading: Centered Pixel Name */}
      <div className="w-full text-center pt-0.5 pb-2">
        <h2 className="font-pixel text-base sm:text-lg font-bold tracking-wider text-[#A855F7] truncate drop-shadow-[0_2px_4px_rgba(168,85,247,0.4)]">
          {displayName}
        </h2>
      </div>

      {/* 2. Center Chip Frame with Microchip Teeth & Pixelated Avatar */}
      <div className="relative my-auto flex items-center justify-center">
        <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px]">
          {/* Purple block SVG frame */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 324 324"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {CHIP_BLOCKS.map(({ r, c }, idx) => (
              <rect
                key={idx}
                x={c * 36}
                y={r * 36}
                width={36}
                height={36}
                fill="#A855F7"
                stroke="#141A23"
                strokeWidth={1.5}
              />
            ))}
          </svg>

          {/* Centered Photo Cutout (Spanning 5x5 blocks: x=72..252, y=72..252) */}
          <div
            className="absolute overflow-hidden z-0"
            style={{
              left: '22.222%',
              top: '22.222%',
              width: '55.556%',
              height: '55.556%',
            }}
          >
            <img
              src={avatarDataUrl}
              alt="8-bit Character Avatar"
              className="w-full h-full object-cover pixelated"
            />
          </div>
        </div>
      </div>

      {/* 3. Stats Section: Raw Purple Pixel Text in Two Columns */}
      <div className="w-full max-w-[310px] px-2 pt-3 sm:pt-4 pb-2 flex justify-between items-center text-[#A855F7] font-pixel text-[8.5px] sm:text-[9.5px] leading-relaxed">
        {/* Left Column */}
        <div className="flex flex-col gap-1.5 text-left">
          <div>Rizz Level - {stats.rizzLevel || '10/10'}</div>
          <div>Flag Status - {stats.flagStatus || 'Green?'}</div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-1.5 text-left">
          <div>Aura Points - {stats.auraPoints || '1000+'}</div>
          <div>Social Battery - {stats.socialBattery || 'LOW'}</div>
        </div>
      </div>

      {/* 4. Footer: AWSnap by AWS SBG NMIET */}
      <div className="w-full text-center pt-1.5 pb-0.5 font-pixel text-[#A855F7]">
        <span className="text-xs sm:text-sm font-bold tracking-wider">AWSnap</span>{' '}
        <span className="text-[9px] sm:text-[10px] tracking-wide text-[#A855F7]">by AWS SBG NMIET</span>
      </div>
    </div>
  );
};
