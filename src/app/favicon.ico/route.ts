export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#020617"/>
    <path d="M18 20h28v6H18zM18 30h28v14H18z" fill="#10b981"/>
    <path d="M24 36h16" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
