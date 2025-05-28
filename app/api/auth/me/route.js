import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (request) => {
  try {
    const token = request.cookies.get("token")?.value;    

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No authentication token provided" }, 
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid token" }, 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
        profile: {
          select: {
            title: true,
            description: true,
          }
        },
        links: {
          select: {
            id: true,
            title: true,
            url: true,
            clicks: true,
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching user data",
        details: error.message,
      },
      { status: 500 }
    );
  }
};
