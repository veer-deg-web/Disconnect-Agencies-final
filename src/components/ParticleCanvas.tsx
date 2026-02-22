'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  color?: string;
  shadowColor?: string;
  lineRgb?: string; /* e.g. "255,138,0" */
  background?: string;
}

export default function ParticleCanvas({
  color = '#ff5a00',
  shadowColor = '#ff8a00',
  lineRgb = '255,138,0',
  background = '#0a0a12'
}: ParticleCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];
    const mouse = { x: null as number | null, y: null as number | null };
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from(
        { length: Math.floor((canvas.width * canvas.height) / 9000) },
        () => ({
          x: Math.random() * canvas.width, 
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.7, 
          vy: (Math.random() - 0.5) * 0.7,
          r: Math.random() * 2 + 0.5,
        })
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const R = (canvas.width / 80) * (canvas.height / 80);
      
      for (const p of particles) {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) {
            if (mouse.x < p.x && p.x < canvas.width - p.r * 10) p.x += 3;
            if (mouse.x > p.x && p.x > p.r * 10) p.x -= 3;
            if (mouse.y < p.y && p.y < canvas.height - p.r * 10) p.y += 3;
            if (mouse.y > p.y && p.y > p.r * 10) p.y -= 3;
          }
        }
        p.x += p.vx; 
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const LINK = Math.min(canvas.width, canvas.height) * 0.15;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${lineRgb},${(1 - d / LINK) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize(); 
    draw();

    const mm = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const mo = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseout', mo);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseout', mo);
      window.removeEventListener('resize', resize);
    };
  }, [color, shadowColor, lineRgb]);

  return (
    <>
      <canvas ref={ref} className="particle-canvas" />
      <style>{`
        .particle-canvas {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          background: ${background};
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
