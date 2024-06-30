import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const host = request.nextUrl.host;
  const protocol = `${request.nextUrl.protocol}//`;

  // Bypass middleware for static files and API routes
  if (path.startsWith("/_next") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  // Fetch session details
  const sessionResponse = await fetch(`${protocol}${host}/api/auth/session`, {
    headers: {
      "content-type": "application/json",
      cookie: request.cookies.toString(),
    },
  });
  const sessionData = await sessionResponse.json();
  const hasSession = sessionResponse.ok && Object.keys(sessionData).length > 0;

  // Redirect logic based on session and profile
  if (!hasSession && !path.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next).*)"], // Update the matcher to correctly exclude API and static file requests
};
