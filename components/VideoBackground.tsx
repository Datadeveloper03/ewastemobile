'use client';
import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  src: string;
  stepName: string;
}

export default function VideoBackground({ src, stepName }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`Autoplay thwarted for ${src}:`, err);
        });
      }
    }
  }, [src, stepName]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover brightness-[0.88] contrast-[1.08] transition-opacity duration-700"
      />
      {/* High-transparency cinematic overlay: allows background video to be clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/70" />
      {/* Subtle radial ambient vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,11,14,0.65)_100%)]" />
    </div>
  );
}
