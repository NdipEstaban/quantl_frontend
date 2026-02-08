// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Configuration: Define your public routes
const publicRoutes = ["/login", "/signup", "/api/auth"];

// Secrets must be converted to Uint8Array for 'jose'
const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. Get tokens from cookies
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // 3. Fallback: If no tokens exist at all, redirect to login
  if (!accessToken && !refreshToken) {
    return redirectToLogin(req);
  }

  // 4. Verify Access Token Integrity
  if (accessToken) {
    try {
      await jwtVerify(accessToken, ACCESS_SECRET);
      // Token is valid and NOT expired
      return NextResponse.next();
    } catch (error: any) {
      // If it's a fake/tampered token, block immediately
      if (error.code !== "ERR_JWT_EXPIRED") {
        return redirectToLogin(req);
      }
      // If it IS expired, code continues to check the Refresh Token
    }
  }

  // 5. Verify Refresh Token Integrity (The safety net for expired Access Tokens)
  if (refreshToken) {
    try {
      await jwtVerify(refreshToken, REFRESH_SECRET);
      // Refresh token is valid!
      // We allow the request to proceed so the client-side Axios
      // interceptor can perform the silent refresh.
      return NextResponse.next();
    } catch (refreshError) {
      // Refresh token is also expired or invalid
      return redirectToLogin(req);
    }
  }

  return redirectToLogin(req);
}

// Helper to handle redirects and cleanup
function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.nextUrl);
  // Optional: Allow the user to return to their original page after login
  loginUrl.searchParams.set("from", req.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);
  // Clear cookies if they were invalid
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

// 6. Matcher Config
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (handled separately or public)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
