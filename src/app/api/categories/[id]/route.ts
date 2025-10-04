import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET /api/categories/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("[GET] /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin danh mục" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Tên và đường dẫn là bắt buộc" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        NOT: {
          id: params.id
        }
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Đường dẫn đã tồn tại" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    revalidatePath('/admin/categories');

    return NextResponse.json(category);
  } catch (error) {
    console.error("[PUT] /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật danh mục" },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description
      }
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("PATCH category error:", error);
    return NextResponse.json(
      { error: "Could not update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json(
      { error: "Could not delete category" },
      { status: 500 }
    );
  }
}