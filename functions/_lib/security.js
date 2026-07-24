const RATE_LIMIT_BUCKETS = new Map();

function hashText(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function extractClientKey(request) {
  const forwarded = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")
    ?? "unknown";
  return hashText(forwarded.split(",")[0]?.trim() ?? "unknown");
}

function sweepExpiredBuckets(now) {
  for (const [key, bucket] of RATE_LIMIT_BUCKETS.entries()) {
    if (bucket.expiresAt <= now) {
      RATE_LIMIT_BUCKETS.delete(key);
    }
  }
}

export function checkRateLimit(request, scope, { limit = 8, windowMs = 60_000 } = {}) {
  const now = Date.now();
  if (RATE_LIMIT_BUCKETS.size > 500) {
    sweepExpiredBuckets(now);
  }

  const bucketKey = `${scope}:${extractClientKey(request)}`;
  const bucket = RATE_LIMIT_BUCKETS.get(bucketKey) ?? {
    count: 0,
    resetAt: now + windowMs,
    expiresAt: now + windowMs * 2,
  };

  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
    bucket.expiresAt = now + windowMs * 2;
  }

  bucket.count += 1;
  RATE_LIMIT_BUCKETS.set(bucketKey, bucket);

  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}
