interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit?: number; // max requests per window
  windowSeconds?: number; // window size in seconds
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetInSeconds: number } {
  const limit = options.limit ?? 5;
  const windowSeconds = options.windowSeconds ?? 600; // 10 minutes default
  const now = Date.now();

  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (record.count >= limit) {
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.count += 1;
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
  return {
    success: true,
    remaining: limit - record.count,
    resetInSeconds,
  };
}
