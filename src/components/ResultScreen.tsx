import React, { useState } from 'react';
import { Download, RotateCcw, Check } from 'lucide-react';
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
          playerName: playerName || 'PIXEL PLAYER',
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-6 sm:py-10">
      {/* Short Heading */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F5F3FF] font-sans mb-1">
          Your AWS avatar is ready.
        </h1>
        <p className="text-xs sm:text-sm text-[#B8AECF] font-medium">
          Collectible 8-bit character card for AWS SBG NMIET
        </p>
      </div>

      {/* Prominently Displayed Avatar Card */}
      <div className="w-full flex justify-center mb-8">
        <AvatarCard
          playerName={playerName}
          avatarDataUrl={avatarDataUrl}
          stats={stats}
        />
      </div>

      {/* Action Controls (Sitting outside the exported card artwork) */}
      <div className="w-full max-w-[432px] flex flex-col sm:flex-row items-center gap-3">
        {/* Primary Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-lg bg-[#FF9900] hover:bg-[#FFA826] active:bg-[#E68A00] text-[#161D26] font-pixel text-xs sm:text-sm tracking-wider uppercase font-bold transition-all shadow-[0_4px_16px_rgba(255,153,0,0.3)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-[#161D26]" />
              <span>DOWNLOADED!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#161D26]" />
              <span>{isDownloading ? 'COMPOSING...' : 'DOWNLOAD PNG'}</span>
            </>
          )}
        </button>

        {/* Secondary Retake Button */}
        <button
          onClick={onRetake}
          className="w-full sm:w-auto py-3.5 px-6 rounded-lg bg-[#2E2640] hover:bg-[#3B3252] text-[#F5F3FF] border border-[#6B21A8] font-pixel text-xs sm:text-sm tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#A855F7]" />
          <span>RETAKE PHOTO</span>
        </button>
      </div>
    </div>
  );
};
