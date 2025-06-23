import csrf from 'next-csrf';

const options = {
  secret: process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production',
  tokenKey: 'csrf-token',
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  ignorePaths: ['/api/auth', '/api/webhooks'], // Exclude auth and webhook endpoints
};

export const { csrf: csrfMiddleware, csrfToken } = csrf(options); 