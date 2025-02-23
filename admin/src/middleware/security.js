const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "img-src 'self' data: https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export const applySecurityHeaders = () => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    document.head.appendChild(
      Object.assign(document.createElement('meta'), {
        httpEquiv: key,
        content: value
      })
    );
  });
}; 