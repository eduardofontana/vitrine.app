"use client";

import { useEffect, useState } from "react";

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  className?: string;
}

export function RotatingText({
  texts,
  rotationInterval = 2500,
  className = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 300);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  return (
    <span className={`relative inline-block min-w-[2ch] ${className}`}>
      <span
        className="inline-block transition-all duration-300 ease-in-out"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? "translateY(-10px)" : "translateY(0)",
        }}
      >
        {texts[index]}
      </span>
    </span>
  );
}
