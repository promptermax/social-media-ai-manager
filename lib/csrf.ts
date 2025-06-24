// lib/csrf.ts
// Note: The library @edge-csrf/nextjs@2.5.3-cloudflare-rc1 seems to be deprecated.
// This code aligns with its expected usage as determined by previous logs and your input.
// Future consideration: Replace this library with a more actively maintained one if issues persist.
import { createCsrfProtect } from '@edge-csrf/nextjs'; // Confirmed named import

export const csrf = createCsrfProtect({
  token: {
    secret: process.env.CSRF_SECRET || 'a-very-long-and-random-secret-for-development-do-not-use-in-production-please-change-me',
    // IMPORTANT: Set CSRF_SECRET in your environment variables for production. This fallback is for development only.
  },
  // You can add other config options here like cookie, excludePathPrefixes, etc.
}); 