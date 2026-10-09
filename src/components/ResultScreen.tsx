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
    <div className="w-full max-w-6xl mx-auto flex items-center justify-center px-4 py-1">
      {/* Side-by-Side: Large Card on left, Title + Actions on right */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-16">
        {/* Left Side: Prominent Avatar Card (shifted slightly to the left) */}
        <div className="flex-shrink-0 md:-translate-x-2 lg:-translate-x-4 transition-transform">
          <AvatarCard
            playerName={playerName}
            avatarDataUrl={avatarDataUrl}
            stats={stats}
          />
        </div>

        {/* Right Side: Header Text on top of Download Card Buttons */}
        <div className="w-full max-w-[340px] sm:max-w-[380px] flex flex-col justify-center gap-4 sm:gap-5">
          {/* Heading Text moved above the action buttons */}
          <div className="text-left flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="font-pixel text-[10px] sm:text-[11px] text-[#A855F7] uppercase tracking-wider font-bold">
                GENERATION COMPLETE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F3FF] font-sans leading-tight">
              Your AWS avatar is ready.
            </h1>
            <p className="text-xs sm:text-sm text-[#B8AECF] font-medium leading-relaxed mt-0.5">
              Collectible 8-bit character card for AWS SBG NMIET
            </p>
          </div>

          {/* Action Buttons Panel */}
          <div className="w-full bg-[#121820]/90 border border-[#2E2640] rounded-2xl p-5 sm:p-6 flex flex-col justify-center gap-3.5 shadow-2xl">
            {/* Primary Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-4 px-6 rounded-xl bg-[#FF9900] hover:bg-[#FFA826] active:bg-[#E68A00] text-[#161D26] font-pixel text-xs sm:text-sm tracking-wider uppercase font-bold transition-all shadow-[0_4px_20px_rgba(255,153,0,0.35)] hover:shadow-[0_6px_28px_rgba(255,153,0,0.45)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 transform active:scale-[0.99]"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-5 h-5 text-[#161D26]" />
                  <span>DOWNLOADED!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-[#161D26]" />
                  <span>{isDownloading ? 'COMPOSING...' : 'DOWNLOAD CARD'}</span>
                </>
              )}
            </button>

            {/* Secondary Retake Button */}
            <button
              onClick={onRetake}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2E2640] hover:bg-[#3B3252] active:bg-[#251E34] text-[#F5F3FF] border border-[#6B21A8] font-pixel text-xs sm:text-sm tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-[0.99]"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#A855F7]" />
              <span>RETAKE PHOTO</span>
            </button>

            {/* Collectible Specs */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#645B7F] border-t border-[#2E2640]/50">
              <span>900 × 1200 PNG</span>
              <span>AWS SBG NMIET</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
