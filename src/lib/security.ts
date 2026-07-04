const INTERNAL_PATH_PATTERN = /^\/(?!\/)/;
const MAX_JSON_BODY_BYTES = 64 * 1024;

export function safeInternalPath(value: string | null, fallback = "/dashboard") {
  if (!value || !INTERNAL_PATH_PATTERN.test(value)) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(value);
    if (!INTERNAL_PATH_PATTERN.test(decoded) || decoded.includes("\\")) {
      return fallback;
    }
    return decoded;
  } catch {
    return fallback;
  }
}

export function isJsonBodyWithinLimit(request: Request, limit = MAX_JSON_BODY_BYTES) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return true;
  }

  const bytes = Number(contentLength);
  return Number.isFinite(bytes) && bytes <= limit;
}

export function getRequestOrigin(request: Request) {
  return new URL(request.url).origin;
}

export function sanitizeHttpUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
