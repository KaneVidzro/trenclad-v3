import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client with Upstash URL and password
const redis = new Redis({
  url: "https://adapting-ladybird-34629.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Initialize RateLimiter with Redis as backend
export const ratelimit = new Ratelimit({
  redis, // Redis instance
  limiter: Ratelimit.slidingWindow(10, "1m"),
});
