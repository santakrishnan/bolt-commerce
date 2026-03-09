import { type NextRequest, NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Example: Redirect to HTTPS in production
  // if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'http:') {
  //   return NextResponse.redirect(
  //     `https://${request.nextUrl.hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
  //     { status: 301 }
  //   )
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
