'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles, SwitchCamera, Upload } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputFallbackRef = useRef<HTMLInputElement>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);

  // Stop camera tracks helper
  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    setIsStreamReady(false);
  };

  // Start camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    stopTracks();
    setErrorText('');
    setHasPermission(null);
    setIsStreamReady(false);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorText('Webcam / Camera API is not supported in this browser. Please use the file upload option below.');
      setHasPermission(false);
      return;
    }

    try {
      let stream: MediaStream;
      try {
        // Attempt with facingMode constraint (mobile rear vs front)
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        // Fallback to any default video device (e.g. desktop/laptop webcam)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        const videoEl = videoRef.current;
        videoEl.srcObject = stream;
        videoEl.muted = true;
        videoEl.setAttribute('playsinline', 'true');
        videoEl.setAttribute('autoplay', 'true');
        
        // Immediate play attempt
        videoEl.play().catch(() => {});
        videoEl.onloadedmetadata = () => {
          videoEl.play().catch(() => {});
          setIsStreamReady(true);
        };
        setIsStreamReady(true);
      }
      setHasPermission(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setErrorText(
        isDenied
          ? 'Camera permission was blocked. You can allow camera in your browser address bar or use the direct file upload below.'
          : 'Unable to access webcam: ' + (err.message || 'No video device found.')
      );
      setHasPermission(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopTracks();
    }
    return () => {
      stopTracks();
    };
  }, [isOpen, facingMode]);

  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const handleCapture = () => {
    if (!videoRef.current || isCapturing) return;
    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const width = video.videoWidth > 0 ? video.videoWidth : 1280;
      const height = video.videoHeight > 0 ? video.videoHeight : 720;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not create canvas 2D rendering context');
      }

      // If front camera, mirror for natural look
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `circuscan_${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          stopTracks();
          onCapture(file);
        } else {
          setErrorText('Snapshot failed to create image file.');
        }
        setIsCapturing(false);
      }, 'image/jpeg', 0.90);
    } catch (err: any) {
      console.error('Snapshot capture error:', err);
      setErrorText('Error capturing webcam frame: ' + err.message);
      setIsCapturing(false);
    }
  };

  const handleFallbackFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopTracks();
      onCapture(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Live WebCam & Mobile Scanner</h3>
              <p className="text-[10px] text-slate-400">Point at label, logo, or device backplate</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasPermission && (
              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                title="Switch Camera (Front / Rear)"
              >
                <SwitchCamera className="w-4 h-4 text-emerald-400" />
                <span className="hidden xs:inline text-[11px]">Flip</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                stopTracks();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Viewport Area */}
        <div className="relative w-full aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Active Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />

          {/* Scanner Reticle Overlay */}
          {hasPermission === true && (
            <>
              <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-emerald-400/60 rounded-2xl flex flex-col justify-between p-3 z-10">
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="self-center px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-sm border border-emerald-500/40 text-[11px] font-mono text-emerald-300 font-bold shadow-lg">
                  Align device label or backplate
                </div>
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              {/* Scanning laser line */}
              <div className="absolute inset-x-8 top-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10B981] animate-pulse z-10" />
            </>
          )}

          {/* Initializing indicator */}
          {hasPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 text-slate-400 text-xs z-20">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              <span>Connecting to webcam video stream...</span>
            </div>
          )}

          {/* Permission or Error Fallback Screen */}
          {hasPermission === false && (
            <div className="absolute inset-0 p-6 text-center flex flex-col items-center justify-center gap-3 bg-slate-950/95 max-w-sm mx-auto z-20">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Camera Access Required</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {errorText || 'Webcam permission was blocked or no camera was found.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Retry Camera
                </button>

                <button
                  type="button"
                  onClick={() => fileInputFallbackRef.current?.click()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                </button>
              </div>

              <input
                ref={fileInputFallbackRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFallbackFile}
              />
            </div>
          )}
        </div>

        {/* Shutter Button & Controls */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => fileInputFallbackRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Upload File Instead</span>
            <span className="sm:hidden">File</span>
          </button>
          <input
            ref={fileInputFallbackRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFallbackFile}
          />

          <button
            type="button"
            onClick={handleCapture}
            disabled={!hasPermission || isCapturing}
            className="group relative px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span>{isCapturing ? 'Snapping...' : 'Capture Photo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
