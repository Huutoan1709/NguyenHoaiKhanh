import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

// Hàm xác thực token và lấy thông tin người dùng
async function verifyAuth(request: NextRequest) {
  try {
    // Lấy token từ cookie
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    // Giải mã token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Lấy ID người dùng từ token
    const userId = payload.sub;
    
    if (!userId) {
      return { error: "Invalid user token", status: 401 };
    }

    // Kiểm tra người dùng có tồn tại không
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: {
        id: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    return { user };
  } catch (error) {
    console.error("Auth error:", error);
    return { error: "Authentication failed", status: 401 };
  }
}

// Lấy thông tin bài viết
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Find post by slug
    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: "published" // Only fetch published posts
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

    // Get related posts
    const relatedPosts = await prisma.post.findMany({
      where: {
        status: "published",
        id: { not: post.id },
        OR: [
          { categoryId: post.categoryId },
          { tags: { hasSome: post.tags } }
        ]
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true
          }
        },
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    return NextResponse.json({
      ...updatedPost,
      relatedPosts
    });

  } catch (error) {
    console.error("GET post detail error:", error);
    return NextResponse.json(
      { error: "Không thể tải thông tin bài viết" },
      { status: 500 }
    );
  }
}

// Cập nhật bài viết
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Xác thực người dùng
    const authResult = await verifyAuth(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user!;
    const postId = params.id;
    
    // Kiểm tra ID bài viết hợp lệ
    if (!postId) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    // Lấy dữ liệu cập nhật từ request
    const {
      title,
      content,
      excerpt,
      slug,
      featuredImage,
      status,
      tags,
      categoryId
    } = await request.json();

    // Kiểm tra các trường bắt buộc
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kiểm tra bài viết tồn tại không
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, slug: true }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền cập nhật (admin hoặc tác giả)
    const isAdmin = user.role === 'ADMIN';
    const isAuthor = existingPost.authorId === user.id;
    
    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Không có quyền cập nhật bài viết này" },
        { status: 403 }
      );
    }

    // Kiểm tra slug trùng lặp (nếu có thay đổi)
    if (slug !== existingPost.slug) {
      const slugExists = await prisma.post.findFirst({
        where: {
          slug: slug,
          id: { not: postId }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug đã tồn tại, vui lòng chọn slug khác" },
          { status: 400 }
        );
      }
    }

    // Cập nhật bài viết
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        slug,
        featuredImage: featuredImage || null,
        status: status || "draft",
        tags: tags || [],
        categoryId: categoryId || null,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("PATCH post error:", error);
    return NextResponse.json(
      { error: error.message || "Could not update post" },
      { status: 500 }
    );
  }
}

// Xóa bài viết
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Xác thực người dùng
    const authResult = await verifyAuth(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user!;
    const postId = params.id;
    
    // Kiểm tra ID bài viết hợp lệ
    if (!postId) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    // Kiểm tra bài viết tồn tại không
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, title: true }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền xóa (admin hoặc tác giả)
    const isAdmin = user.role === 'ADMIN';
    const isAuthor = existingPost.authorId === user.id;
    
    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Không có quyền xóa bài viết này" },
        { status: 403 }
      );
    }

    // Xóa bài viết
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: `Đã xóa bài viết "${existingPost.title}" thành công`,
      deletedPostId: postId
    });
  } catch (error: any) {
    console.error("DELETE post error:", error);
    return NextResponse.json(
      { error: error.message || "Could not delete post" },
      { status: 500 }
    );
  }
}