/**
 * AWSnap by AWS SBG NMIET
 * 8-Bit Avatar Photo Booth for AWS Student Builders Guild community events
 */

import React, { useState } from 'react';
import { BrandHeader } from './components/BrandHeader';
import { CameraView } from './components/CameraView';
import { GenerationScreen } from './components/GenerationScreen';
import { ResultScreen } from './components/ResultScreen';
import {
  AvatarTraits,
  CardStats,
  DEFAULT_TRAITS,
  DEFAULT_STATS,
} from './utils/avatarGenerator';

type AppState = 'capture' | 'generating' | 'result';

export default function App() {
  const [appState, setAppState] = useState<AppState>('capture');
  const [playerName, setPlayerName] = useState<string>('PIXEL PLAYER');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  const [characterTraits, setCharacterTraits] = useState<AvatarTraits>(DEFAULT_TRAITS);
  const [cardStats, setCardStats] = useState<CardStats>(DEFAULT_STATS);

  // Transition from Screen One to Screen Two
  const handleCapturePhoto = (photoDataUrl: string) => {
    setCapturedPhotoUrl(photoDataUrl);
    setAppState('generating');
  };

  // Transition from Screen Two to Screen Three
  const handleGenerationComplete = (result: {
    avatarDataUrl: string;
    traits: AvatarTraits;
    stats: CardStats;
  }) => {
    setGeneratedAvatarUrl(result.avatarDataUrl);
    setCharacterTraits(result.traits);
    setCardStats(result.stats);
    setAppState('result');
  };

  // Retake photo: clear state and return to Screen One
  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    setGeneratedAvatarUrl(null);
    setAppState('capture');
  };

  return (
    <div className="min-h-screen bg-[#161D26] bg-tech-grid flex flex-col text-[#F5F3FF]">
      {/* Top Header with AWS SBG Logo & Branding */}
      <BrandHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        {appState === 'capture' && (
          <CameraView
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onCapture={handleCapturePhoto}
          />
        )}

        {appState === 'generating' && capturedPhotoUrl && (
          <GenerationScreen
            photoDataUrl={capturedPhotoUrl}
            playerName={playerName}
            onGenerationComplete={handleGenerationComplete}
            onRetake={handleRetake}
          />
        )}

        {appState === 'result' && generatedAvatarUrl && (
          <ResultScreen
            playerName={playerName}
            avatarDataUrl={generatedAvatarUrl}
            stats={cardStats}
            onRetake={handleRetake}
          />
        )}
      </main>

      {/* Understated Event Watermark Footer */}
      <footer className="w-full py-3 text-center border-t border-[#2E2640]/30 text-[11px] font-mono text-[#645B7F]">
        AWS Student Builders Guild - NMIET Event Edition - Local Photo Booth
      </footer>
    </div>
  );
}
