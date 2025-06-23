import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { csrfMiddleware } from "./lib/csrf"

export default withAuth(
  function middleware(req) {
    // Apply CSRF protection to API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return csrfMiddleware(req)
    }
    
    // Add security headers for all routes
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "connect-src 'self' https://api.openai.com https://api.anthropic.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ai-generator/:path*",
    "/calendar/:path*",
    "/messages/:path*",
    "/templates/:path*",
    "/documents/:path*",
    "/activity/:path*",
    "/strategy/:path*",
    "/admin/:path*",
    "/api/:path*", // Include API routes for CSRF protection
  ]
} 