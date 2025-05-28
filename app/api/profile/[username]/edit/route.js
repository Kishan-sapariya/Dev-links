import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { username } = params;
    const { firstName, lastName, email, bio, title, avatar } =
      await request.json();

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        firstName,
        lastName,
        email,
        bio,
        avatar,
        profile: {
          upsert: {
            create: { title },
            update: { title },
          },
        },
      },
      include: {
        profile: true,
        links: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
