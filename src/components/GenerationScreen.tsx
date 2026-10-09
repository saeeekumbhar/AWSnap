import React, { useEffect, useState } from 'react';
import { Terminal, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import {
  AvatarTraits,
  CardStats,
  generateMinecraftAvatar,
  DEFAULT_TRAITS,
  DEFAULT_STATS,
} from '../utils/avatarGenerator';

interface GenerationScreenProps {
  photoDataUrl: string;
  playerName: string;
  onGenerationComplete: (result: {
    avatarDataUrl: string;
    traits: AvatarTraits;
    stats: CardStats;
  }) => void;
  onRetake: () => void;
}

interface LogEntry {
  stage: number;
  message: string;
  status: 'pending' | 'active' | 'done' | 'error';
  timestamp: string;
}

export const GenerationScreen: React.FC<GenerationScreenProps> = ({
  photoDataUrl,
  playerName,
  onGenerationComplete,
  onRetake,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      stage: 1,
      message: 'Preparing image payload (512x512 JPEG base64)...',
      status: 'active',
      timestamp: '0.00s',
    },
    {
      stage: 2,
      message: 'POST /api/generate-avatar -> Gemini 3.8 Flash Vision...',
      status: 'pending',
      timestamp: '--',
    },
    {
      stage: 3,
      message: 'Synthesizing 8-bit Minecraft character sprite & traits...',
      status: 'pending',
      timestamp: '--',
    },
    {
      stage: 4,
      message: 'Composing final AWSnap collectible card layout...',
      status: 'pending',
      timestamp: '--',
    },
  ]);

  const [currentStage, setCurrentStage] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const runPipeline = async () => {
    setErrorMessage(null);
    const startTime = performance.now();

    const getElapsed = () =>
      `${((performance.now() - startTime) / 1000).toFixed(2)}s`;

    try {
      // Stage 1: Preparing image input
      setLogs((prev) =>
        prev.map((log) =>
          log.stage === 1
            ? { ...log, status: 'active', timestamp: getElapsed() }
            : log
        )
      );
      await new Promise((r) => setTimeout(r, 450));
      setLogs((prev) =>
        prev.map((log) =>
          log.stage === 1
            ? { ...log, status: 'done', timestamp: getElapsed() }
            : log.stage === 2
            ? { ...log, status: 'active', timestamp: getElapsed() }
            : log
        )
      );
      setCurrentStage(2);

      // Stage 2: Sending image to local backend API
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: photoDataUrl,
          playerName: playerName || 'PIXEL PLAYER',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }

      const result = await response.json();
      const traits: AvatarTraits = result.traits || DEFAULT_TRAITS;
      const stats: CardStats = result.stats || DEFAULT_STATS;

      setLogs((prev) =>
        prev.map((log) =>
          log.stage === 2
            ? { ...log, status: 'done', timestamp: getElapsed() }
            : log.stage === 3
            ? { ...log, status: 'active', timestamp: getElapsed() }
            : log
        )
      );
      setCurrentStage(3);

      // Stage 3: Synthesizing Minecraft blocky character
      await new Promise((r) => setTimeout(r, 600));
      const avatarDataUrl = generateMinecraftAvatar(traits, 512, true);

      setLogs((prev) =>
        prev.map((log) =>
          log.stage === 3
            ? { ...log, status: 'done', timestamp: getElapsed() }
            : log.stage === 4
            ? { ...log, status: 'active', timestamp: getElapsed() }
            : log
        )
      );
      setCurrentStage(4);

      // Stage 4: Composing final collectible card
      await new Promise((r) => setTimeout(r, 550));
      setLogs((prev) =>
        prev.map((log) =>
          log.stage === 4 ? { ...log, status: 'done', timestamp: getElapsed() } : log
        )
      );

      // Automatically transition to Screen Three
      setTimeout(() => {
        onGenerationComplete({
          avatarDataUrl,
          traits,
          stats,
        });
      }, 400);
    } catch (err: any) {
      console.error('Generation pipeline error:', err);
      setErrorMessage(
        err.message ||
          'Failed to transform photograph into pixel avatar. Please check connection and retry.'
      );
      setLogs((prev) =>
        prev.map((log) =>
          log.status === 'active' ? { ...log, status: 'error' } : log
        )
      );
    }
  };

  useEffect(() => {
    runPipeline();
  }, [isRetrying]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-6 sm:py-10">
      {/* Heading with Typing Animation */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F5F3FF] font-sans mb-2">
          <TypewriterText text="Creating your 8-bit twin..." speed={50} />
        </h1>
        <p className="text-sm sm:text-base text-[#B8AECF] font-medium tracking-wide">
          Reconstructing your look in pixels.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-6">
        {/* Photo Transformation Preview with Scanning Laser */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-xl overflow-hidden border-2 border-[#A855F7] shadow-[0_0_24px_rgba(168,85,247,0.3)] bg-[#121820]">
          <img
            src={photoDataUrl}
            alt="Captured photo"
            className="w-full h-full object-cover filter contrast-105"
          />

          {/* Pixel Grid Matrix Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(168, 85, 247, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.3) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Stepped Pixel Corner Accents */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-[#A855F7] z-10" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-[#A855F7] z-10" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#A855F7] z-10" />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#A855F7] z-10" />

          {/* Scanning Beam Animation */}
          {!errorMessage && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF9900] to-transparent animate-pulse shadow-[0_0_12px_#FF9900] z-20"
              style={{
                top: `${(currentStage * 25)}%`,
                transition: 'top 0.5s ease-in-out',
              }}
            />
          )}

          {/* Processing badge */}
          <div className="absolute bottom-3 inset-x-3 py-1.5 px-3 rounded bg-[#161D26]/90 backdrop-blur-sm border border-[#6B21A8] text-center font-pixel text-[10px] text-[#C084FC] z-20">
            PROCESSING STAGE {currentStage}/4
          </div>
        </div>

        {/* Compact Code Panel Showing Real Client-Side Processing Stages */}
        <div className="w-full bg-[#121820] rounded-xl border border-[#3B3252] overflow-hidden shadow-lg">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1A222D] border-b border-[#2E2640]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#A855F7]" />
              <span className="font-mono text-xs font-semibold text-[#F5F3FF]">
                pipeline.client.ts
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#B8AECF]">
              EXECUTION LOG
            </span>
          </div>

          {/* Logs List */}
          <div className="p-4 flex flex-col gap-2.5 font-mono text-xs">
            {logs.map((log) => {
              const isPending = log.status === 'pending';
              const isActive = log.status === 'active';
              const isDone = log.status === 'done';
              const isError = log.status === 'error';

              return (
                <div
                  key={log.stage}
                  className={`flex items-start justify-between gap-3 p-2 rounded transition-colors ${
                    isActive
                      ? 'bg-[#1E2633] text-[#F5F3FF] border-l-2 border-[#FF9900]'
                      : isDone
                      ? 'text-[#B8AECF] opacity-90'
                      : isError
                      ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                      : 'text-[#645B7F] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#FF9900] animate-ping" />
                    )}
                    {isDone && <span className="text-[#10B981] font-bold">✓</span>}
                    {isPending && <span className="text-[#645B7F]">○</span>}
                    {isError && <span className="text-red-400 font-bold">✗</span>}
                    <span>{log.message}</span>
                  </div>
                  <span className="text-[10px] text-[#A855F7] shrink-0 font-mono">
                    {log.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error State if API fails */}
        {errorMessage && (
          <div className="w-full p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex flex-col gap-3 text-center items-center">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Generation Failed</span>
            </div>
            <p className="text-xs text-red-200">{errorMessage}</p>
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => setIsRetrying((v) => !v)}
                className="px-4 py-2 rounded bg-[#A855F7] hover:bg-[#9333EA] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Request
              </button>
              <button
                onClick={onRetake}
                className="px-4 py-2 rounded bg-[#2E2640] hover:bg-[#3B3252] text-[#F5F3FF] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Retake Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
