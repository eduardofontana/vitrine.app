"use client";

import { useEffect, useRef, useState } from "react";

interface BlurTextProps {
  text: string;
  animateBy?: "words" | "chars";
  direction?: "top" | "bottom";
  delay?: number;
  threshold?: number;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export function BlurText({
  text,
  animateBy = "words",
  direction = "top",
  delay = 100,
  threshold = 0.1,
  className = "",
  tag = "h1",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
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

  const Component = tag;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <Component className="inline">
        {elements.map((item, i) => (
          <span
            key={i}
            className="inline-block transition-all duration-700 ease-out"
            style={{
              filter: visible ? "blur(0px)" : "blur(8px)",
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0)"
                : `translateY(${direction === "top" ? "-30px" : "30px"})`,
              transitionDelay: `${i * delay}ms`,
            }}
          >
            {item}
            {animateBy === "words" && i < elements.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </Component>
    </div>
  );
}
