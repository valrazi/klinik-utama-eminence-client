// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Get token from NextAuth (from cookie or header)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // If the user is NOT logged in and trying to access /backoffice/*
  if (!token && pathname.startsWith("/backoffice")) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Match all routes under /backoffice/*
export const config = {
  matcher: ["/backoffice/:path*"]
};
