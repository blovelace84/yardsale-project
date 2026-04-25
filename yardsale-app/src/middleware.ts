import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const PUBLIC_WRITE_PATH_PREFIXES = ["/api/auth", "/api/register"];

function isPublicWritePath(pathname: string): boolean {
  return PUBLIC_WRITE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    return true;
  }

  const host = req.headers.get("host");
  if (!host) {
    return false;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  if (!WRITE_METHODS.has(req.method)) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (isPublicWritePath(pathname)) {
    return NextResponse.next();
  }

  if (!hasValidOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
