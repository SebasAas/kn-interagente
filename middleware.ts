import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "next-auth/react";
import { IncomingMessage } from "http";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // const pathname = request.nextUrl.pathname;
  // const session = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });
  // console.log("session", session);
  // if (!session) {
  //   // console.log(request.nextUrl.pathname);
  //   // Append before redirect the path to the callbackUrl
  //   const url = new URL("login", request.url);
  //   url.searchParams.append("callbackUrl", request.nextUrl.pathname);
  //   return NextResponse.redirect(url);
  // }
}
