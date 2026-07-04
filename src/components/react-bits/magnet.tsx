"use client";

import { useRef, type ReactNode } from "react";

interface MagnetProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnet({
  children,
  strength = 30,
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * (strength / 100)}px, ${y * (strength / 100)}px)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
    el.style.transition = "transform 0.3s ease-out";
  }

  function handleMouseEnter() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.1s ease-out";
  }

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
