import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isConfigured =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

function createLimiter(window: Duration, max: number) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    analytics: true,
  });
}

export const rateLimiters = {
  login: createLimiter("60 s", 5),
  signup: createLimiter("1 h", 3),
  lead: createLimiter("1 h", 10),
  projectCreate: createLimiter("1 d", 5),
  adminAction: createLimiter("60 s", 30),
};

export type RateLimitKey = keyof typeof rateLimiters;

export async function checkRateLimit(
  key: RateLimitKey,
  identifier: string
): Promise<{ allowed: boolean; remaining: number }> {
  const limiter = rateLimiters[key];
  if (!limiter) return { allowed: true, remaining: 999 };

  const result = await limiter.limit(identifier);
  return {
    allowed: result.success,
    remaining: result.remaining,
  };
}
