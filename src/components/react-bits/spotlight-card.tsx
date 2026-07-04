"use client";

import { useRef, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 130, 246, 0.15)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
    card.style.setProperty("--spotlight", spotlightColor);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--spotlight", "transparent");
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:border-blue-500/30 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: "rgb(15, 15, 35)",
        backgroundImage:
          "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), var(--spotlight, transparent), transparent 40%)",
      }}
    >
      {children}
    </div>
  );
}
