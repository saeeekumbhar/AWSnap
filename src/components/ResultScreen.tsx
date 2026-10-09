import React, { useState } from 'react';
import { Download, RotateCcw, Check, Sparkles } from 'lucide-react';
import { AvatarCard } from './AvatarCard';
import { CardStats } from '../utils/avatarGenerator';
import { downloadComposedCardPng } from '../utils/composeCard';

interface ResultScreenProps {
  playerName: string;
  avatarDataUrl: string;
  stats: CardStats;
  onRetake: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  playerName,
  avatarDataUrl,
  stats,
  onRetake,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadComposedCardPng(
        {
          playerName: playerName || 'Name',
          avatarImageDataUrl: avatarDataUrl,
          stats,
        },
        'awsnap-avatar.png'
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-1">
      {/* Short Compact Heading */}
      <div className="text-center mb-2.5 sm:mb-3.5">
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#F5F3FF] font-sans mb-0.5">
          Your AWS avatar is ready.
        </h1>
        <p className="text-[11px] sm:text-xs text-[#B8AECF] font-medium">
          Collectible 8-bit character card for AWS SBG NMIET
        </p>
      </div>

      {/* Side-by-Side: Card shifted to left, Action Buttons on right */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12">
        {/* Left Side: Avatar Card (shifted a bit to the left) */}
        <div className="flex-shrink-0 md:-translate-x-4 lg:-translate-x-6 transition-transform">
          <AvatarCard
            playerName={playerName}
            avatarDataUrl={avatarDataUrl}
            stats={stats}
          />
        </div>

        {/* Right Side: Action Buttons Panel */}
        <div className="w-full max-w-[280px] sm:max-w-[310px] bg-[#121820]/80 border border-[#2E2640] rounded-xl p-4 sm:p-5 flex flex-col justify-center gap-3.5 shadow-xl">
          <div className="flex flex-col gap-1 pb-2 border-b border-[#2E2640]/70">
            <span className="font-pixel text-[11px] sm:text-xs text-[#A855F7] tracking-wider uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9900]" />
              Card Actions
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#B8AECF] leading-tight">
              Download your collectible 900x1200 card or snap another photo.
            </span>
          </div>

          {/* Primary Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3.5 px-5 rounded-lg bg-[#FF9900] hover:bg-[#FFA826] active:bg-[#E68A00] text-[#161D26] font-pixel text-xs sm:text-sm tracking-wider uppercase font-bold transition-all shadow-[0_4px_16px_rgba(255,153,0,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform active:scale-[0.99]"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#161D26]" />
                <span>DOWNLOADED!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#161D26]" />
                <span>{isDownloading ? 'COMPOSING...' : 'DOWNLOAD CARD'}</span>
              </>
            )}
          </button>

          {/* Secondary Retake Button */}
          <button
            onClick={onRetake}
            className="w-full py-3 px-5 rounded-lg bg-[#2E2640] hover:bg-[#3B3252] active:bg-[#251E34] text-[#F5F3FF] border border-[#6B21A8] font-pixel text-xs sm:text-sm tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4 text-[#A855F7]" />
            <span>RETAKE PHOTO</span>
          </button>

          {/* Collectible Specs */}
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#645B7F]">
            <span>900 × 1200 PNG</span>
            <span>AWS SBG NMIET</span>
          </div>
        </div>
      </div>
    </div>
  );
};
