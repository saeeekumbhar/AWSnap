import React, { useRef, useState, useEffect } from 'react';
import { Camera, AlertCircle, RefreshCw, Upload, Sparkles } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface CameraViewProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onCapture: (photoDataUrl: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  playerName,
  onPlayerNameChange,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);

  // Initialize camera
  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);

    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera initialization error:', err);
      let errorMsg = 'Could not access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is already in use by another application.';
      }
      setCameraError(errorMsg);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle countdown and capture
  const handleStartCapture = () => {
    if (isCapturing || countdown !== null) return;
    setIsCapturing(true);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        // Trigger capture flash and grab frame
        executeCapture();
      }
    }, 1000);
  };

  const executeCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 250);

    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      const size = Math.min(video.videoWidth || 640, video.videoHeight || 480);
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop square
        const sx = ((video.videoWidth || 640) - size) / 2;
        const sy = ((video.videoHeight || 480) - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, 512, 512);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        onCapture(dataUrl);
      }
    }
  };

  // Fallback file upload if camera is unavailable
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 512, 512);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          onCapture(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-6 sm:py-10">
      {/* Hidden canvas for capturing video frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Heading with Typing Animation */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F5F3FF] font-sans mb-2">
          <TypewriterText text="Get your AWS avatar." speed={60} />
        </h1>
        <p className="text-sm sm:text-base text-[#B8AECF] font-medium tracking-wide">
          Step in. Snap a photo. Meet your 8-bit self.
        </p>
      </div>

      {/* Camera Area Frame */}
      <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-square bg-[#121820] rounded-xl overflow-hidden border-2 border-[#6B21A8] shadow-[0_0_24px_rgba(107,33,168,0.25)] flex items-center justify-center">
        {/* Subtle decorative stepped pixel corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#A855F7] z-10 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#A855F7] z-10 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#A855F7] z-10 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#A855F7] z-10 pointer-events-none" />

        {/* Live Camera Feed */}
        {!cameraError && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]" // mirrored for natural selfie experience
          />
        )}

        {/* Loading Camera State */}
        {isInitializing && (
          <div className="absolute inset-0 bg-[#161D26]/90 flex flex-col items-center justify-center gap-3 z-10">
            <RefreshCw className="w-8 h-8 text-[#A855F7] animate-spin" />
            <p className="text-sm text-[#B8AECF] font-mono">Initializing camera feed...</p>
          </div>
        )}

        {/* Camera Permission / Error State */}
        {cameraError && (
          <div className="absolute inset-0 bg-[#161D26] p-6 flex flex-col items-center justify-center text-center gap-4 z-10">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F3FF] mb-1">Camera Unavailable</h3>
              <p className="text-xs sm:text-sm text-[#B8AECF] max-w-sm">{cameraError}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded bg-[#6B21A8] hover:bg-[#7E22CE] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded bg-[#2E2640] hover:bg-[#3B3252] text-[#F5F3FF] border border-[#A855F7]/40 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Countdown Overlay (3, 2, 1) */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="font-pixel text-7xl sm:text-9xl text-[#FF9900] animate-bounce drop-shadow-[0_4px_16px_rgba(255,153,0,0.6)]">
              {countdown}
            </div>
          </div>
        )}

        {/* Camera Shutter Flash */}
        {flash && (
          <div className="absolute inset-0 bg-white z-30 transition-opacity duration-150" />
        )}

        {/* Live indicator dot */}
        {!cameraError && !isInitializing && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded bg-[#161D26]/80 backdrop-blur-sm border border-[#A855F7]/30 text-[11px] font-mono text-[#F5F3FF] z-10 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>LIVE BOOTH</span>
          </div>
        )}
      </div>

      {/* Player Name Input Field */}
      <div className="w-full max-w-[540px] mt-6 flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#B8AECF] flex items-center justify-between">
          <span>Card Player Name</span>
          <span className="text-[10px] text-[#A855F7] font-mono">OPTIONAL</span>
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value.slice(0, 18))}
          placeholder="PIXEL PLAYER"
          className="w-full px-4 py-2.5 rounded-lg bg-[#121820] border border-[#3B3252] focus:border-[#A855F7] focus:outline-none text-[#F5F3FF] placeholder-[#645B7F] text-sm font-medium tracking-wide transition-colors"
        />
      </div>

      {/* Capture Interaction Button */}
      <div className="w-full max-w-[540px] mt-6">
        <button
          onClick={handleStartCapture}
          disabled={isCapturing || !!cameraError || isInitializing}
          className="w-full py-4 px-6 rounded-lg bg-[#FF9900] hover:bg-[#FFA826] active:bg-[#E68A00] disabled:bg-[#4B3E2F] disabled:text-[#8E7E6E] disabled:cursor-not-allowed text-[#161D26] font-pixel text-sm sm:text-base tracking-wider uppercase font-bold transition-all duration-150 transform active:scale-[0.99] shadow-[0_4px_20px_rgba(255,153,0,0.3)] flex items-center justify-center gap-3 cursor-pointer"
        >
          <Camera className="w-5 h-5 text-[#161D26]" />
          <span>{isCapturing ? 'SNAPPING...' : 'CAPTURE MY AVATAR'}</span>
        </button>

        {/* Alternative upload trigger if user prefers */}
        {!cameraError && (
          <div className="mt-3 text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#B8AECF] hover:text-[#A855F7] transition-colors underline cursor-pointer"
            >
              Or upload an existing photo from laptop
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};
