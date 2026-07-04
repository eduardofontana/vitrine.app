"use client";

import { useEffect, useRef } from "react";

interface ParticlesProps {
  particleCount?: number;
  particleColors?: string[];
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
  className?: string;
}

export function Particles({
  particleCount = 150,
  particleColors = ["#3B82F6", "#06B6D4", "#8B5CF6", "#60A5FA"],
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 60,
  moveParticlesOnHover = true,
  alphaParticles = false,
  disableRotation = false,
  className,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
      rotationSpeed: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * particleBaseSize + 10,
        color:
          particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: alphaParticles ? Math.random() * 0.5 + 0.1 : Math.random() * 0.3 + 0.05,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    function drawParticle(p: Particle) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      if (!disableRotation) {
        ctx.rotate(p.rotation);
      }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (!disableRotation) {
          p.rotation += p.rotationSpeed;
        }

        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = h + p.size;
        if (p.y > h + p.size) p.y = -p.size;

        if (moveParticlesOnHover) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            p.vx -= dx * 0.00005;
            p.vy -= dy * 0.00005;
          }
        }

        drawParticle(p);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    function handleResize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    window.addEventListener("resize", handleResize);
    if (moveParticlesOnHover) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    particleCount,
    particleColors,
    particleSpread,
    speed,
    particleBaseSize,
    moveParticlesOnHover,
    alphaParticles,
    disableRotation,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className || ""}`}
      style={{ zIndex: 0 }}
    />
  );
}
