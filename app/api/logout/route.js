import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json({ message: "Logged out successfully" });
  
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return response;
};
