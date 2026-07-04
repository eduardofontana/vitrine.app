interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function ShinyText({
  text,
  className = "",
  speed = 3,
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-white via-blue-300 to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
