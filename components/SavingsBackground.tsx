'use client';
import React, { useEffect, useRef } from 'react';

export default function SavingsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes representing saved energy, gold & carbon
    const PARTICLE_COUNT = 45;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2, // upward floating drift
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.3 ? '#34d399' : '#06b6d4', // emerald / cyan
    }));

    // Orbiting circular eco-rings
    let ringAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep cinematic gradient base
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, 'rgba(6, 78, 59, 0.45)');   // glowing emerald core
      bgGrad.addColorStop(0.4, 'rgba(8, 26, 31, 0.85)');  // dark cyan teal
      bgGrad.addColorStop(1, 'rgba(3, 7, 10, 0.96)');     // deep carbon black
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle rotating circular energy rings (circular economy motif)
      ringAngle += 0.003;
      ctx.save();
      ctx.translate(width * 0.5, height * 0.35);
      ctx.rotate(ringAngle);

      for (let r = 180; r <= 360; r += 90) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${0.08 - r * 0.00015})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([12, 18]);
        ctx.stroke();
      }
      ctx.restore();

      // Update and draw floating energy particles
      ctx.setLineDash([]);
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/80" />
    </div>
  );
}
