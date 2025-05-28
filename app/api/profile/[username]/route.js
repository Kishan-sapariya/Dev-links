import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        profile: true,
        links: {
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });


    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { 
        error: 'Error fetching profile',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request, { params }) {
  try {
    const { username } = await params;
    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Action 1: Track link click
    if (body.linkId) {
      const { linkId } = body;

      const link = await prisma.link.findFirst({
        where: {
          id: linkId,
          userId: user.id,
        },
      });

      if (!link) {
        return NextResponse.json(
          { error: 'Link not found' },
          { status: 404 }
        );
      }

      const updatedLink = await prisma.link.update({
        where: {
          id: linkId,
        },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        { 
          success: true, 
          data: { 
            clicks: updatedLink.clicks,
            linkId: linkId
          },
          message: 'Click tracked successfully'
        },
        { status: 200 }
      );
    }

    // Action 2: Create new link
    if (body.title && body.url) {
      const { title, url, description } = body;

      const newLink = await prisma.link.create({
        data: {
          userId: user.id,
          title: title,
          url: url,
          ...(description && { description }),
        },
      });


      return NextResponse.json(
        { 
          success: true, 
          data: newLink,
          message: 'Link created successfully'
        },
        { status: 201 }
      );
    }

    // Action 3: Bulk create links
    if (body.links && Array.isArray(body.links)) {
      const { links } = body;

      const createdLinks = await prisma.link.createMany({
        data: links.map(link => ({
          userId: user.id,
          title: link.title,
          url: link.url,
          ...(link.description && { description: link.description }),
        })),
      });


      return NextResponse.json(
        { 
          success: true, 
          data: { count: createdLinks.count },
          message: `${createdLinks.count} links created successfully`
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid request. Provide linkId for click tracking, or title/url for link creation' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { 
        error: 'Error processing request',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
