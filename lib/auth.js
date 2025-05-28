import { NextResponse } from "next/server";

export const verifyToken = (req) => {
  const token = req.cookies.get("token")?.value;
  const isAuthenticated = !!token; 

  const { pathname } = req.nextUrl;

  const authRoutes = ["/login", "/signup"];
  const protectedRoutes = ["/profile"];

  // If user has token and trying to access auth routes (login/signup)
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user has no token and trying to access protected routes
  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};
