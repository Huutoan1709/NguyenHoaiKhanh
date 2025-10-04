import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log("Fetching post with slug:", params.slug); // Debug log

    // Find post by slug
    const post = await prisma.post.findFirst({
      where: {
        slug: params.slug,
        status: "published"
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        },
        category: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Bài viết không tồn tại hoặc chưa được xuất bản" },
        { status: 404 }
      );
    }

    // Increment view count
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      ...post,
      viewCount: updatedPost.viewCount
    });

  } catch (error) {
    console.error("GET post by slug error:", error);
    return NextResponse.json(
      { error: "Không thể tải thông tin bài viết" },
      { status: 500 }
    );
  }
}