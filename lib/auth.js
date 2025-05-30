import { NextResponse } from "next/server";

export const verifyToken = (req) => {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Allow access to public routes
      const { pathname } = request.nextUrl;
      if (
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname.startsWith("/users") ||
        pathname.startsWith("/api/")
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to headers for server components
    const response = NextResponse.next();
    response.headers.set("x-user-id", decoded.userId.toString());

    return response;
  } catch (error) {
    console.error("Token verification failed:", error);
    const { pathname } = request.nextUrl;
    if (
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname.startsWith("/users")
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
};
