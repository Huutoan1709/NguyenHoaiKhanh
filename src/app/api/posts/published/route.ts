import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("category") || "";

    // Build where clause giống như posts route
    const where: any = {
      status: "published" // Chỉ lấy bài đã xuất bản
    };
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const total = await prisma.post.count({ where });
    const totalPages = Math.ceil(total / limit);

    // Get posts with pagination - sử dụng cấu trúc giống posts route
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          include: {
            _count: {
              select: {
                posts: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Trả về kết quả với cấu trúc giống posts route
    return NextResponse.json({
      items: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('GET published posts error:', error);
    return NextResponse.json(
      { error: "Không thể tải danh sách bài viết" },
      { status: 500 }
    );
  }
}