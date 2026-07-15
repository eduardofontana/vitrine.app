const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || "vitrine-csrf-fallback";
const ALGO = { name: "HMAC", hash: "SHA-256" } as const;
const EXPIRY_MS = 60 * 60 * 1000;

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(CSRF_SECRET),
    ALGO,
    false,
    ["sign", "verify"]
  );
}

export async function generateCsrfToken(): Promise<string> {
  const key = await getKey();
  const payload = `${Date.now()}`;
  const signature = await crypto.subtle.sign(ALGO.name, key, new TextEncoder().encode(payload));
  const sig = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${sig}`;
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;

    const ts = Number(payload);
    if (isNaN(ts) || Date.now() - ts > EXPIRY_MS) return false;

    const key = await getKey();
    const valid = await crypto.subtle.verify(
      ALGO.name,
      key,
      Uint8Array.from(sig.match(/.{2}/g)!.map((h) => parseInt(h, 16))),
      new TextEncoder().encode(payload)
    );
    return valid;
  } catch {
    return false;
  }
}
