"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface FadeContentProps {
  children: ReactNode;
  threshold?: number;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function FadeContent({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 700,
  className = "",
  direction = "up",
}: FadeContentProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const directionMap = {
    up: { y: "40px", x: "0" },
    down: { y: "-40px", x: "0" },
    left: { y: "0", x: "40px" },
    right: { y: "0", x: "-40px" },
  };

  const dir = directionMap[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate(0, 0)"
          : `translate(${dir.x}, ${dir.y})`,
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
