import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { uploadAvatar } from "@/lib/cloudinary";

// Cấu hình để xử lý FormData và file uploads trong Next.js 13+
// ✅ Cấu hình mới cho App Router (thay cho export const config)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Xử lý upload avatar
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Lấy token từ cookie admin-token
    const token = request.cookies.get("admin-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Giải mã token để lấy thông tin người dùng
    let userFromToken;
    try {
      // Sử dụng jose để verify token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
      const { payload } = await jwtVerify(token, secret);
      userFromToken = payload;
      
      if (!userFromToken || !userFromToken.sub) {
        throw new Error("Token không hợp lệ");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { error: "Token không hợp lệ hoặc hết hạn" },
        { status: 401 }
      );
    }
    
    // Kiểm tra quyền truy cập
    if (userFromToken.sub !== id && userFromToken.role !== "admin") {
      return NextResponse.json(
        { error: "Không có quyền cập nhật avatar người dùng khác" },
        { status: 403 }
      );
    }
    
    // Xử lý file upload
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      
      if (!file) {
        return NextResponse.json(
          { error: "Không tìm thấy file" },
          { status: 400 }
        );
      }
      
      // Kiểm tra kích thước file
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Kích thước file quá lớn. Giới hạn 5MB" },
          { status: 400 }
        );
      }
      
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Chỉ chấp nhận file hình ảnh" },
          { status: 400 }
        );
      }
      
      // Đọc file như ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload lên Cloudinary
      const avatarUrl = await uploadAvatar(buffer);
      
      if (!avatarUrl) {
        return NextResponse.json(
          { error: "Lỗi khi tải lên hình ảnh" },
          { status: 500 }
        );
      }
      
      // Cập nhật URL avatar trong database
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { avatar: avatarUrl },
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      });
      
      return NextResponse.json({
        message: "Upload avatar thành công",
        avatar: updatedUser.avatar,
      });
    } catch (error) {
      console.error("Error processing file upload:", error);
      return NextResponse.json(
        { error: "Lỗi khi xử lý upload file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Không thể upload avatar" },
      { status: 500 }
    );
  }
}

// Xử lý xóa avatar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Lấy token từ cookie admin-token
    const token = request.cookies.get("admin-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Giải mã token để lấy thông tin người dùng
    let userFromToken;
    try {
      // Sử dụng jose để verify token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
      const { payload } = await jwtVerify(token, secret);
      userFromToken = payload;
      
      if (!userFromToken || !userFromToken.sub) {
        throw new Error("Token không hợp lệ");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { error: "Token không hợp lệ hoặc hết hạn" },
        { status: 401 }
      );
    }
    
    // Kiểm tra quyền truy cập
    if (userFromToken.sub !== id && userFromToken.role !== "admin") {
      return NextResponse.json(
        { error: "Không có quyền xóa avatar người dùng khác" },
        { status: 403 }
      );
    }
    
    // Cập nhật URL avatar trong database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { avatar: null },
      select: {
        id: true,
        name: true,
      },
    });
    
    return NextResponse.json({
      message: "Xóa avatar thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { error: "Không thể xóa avatar" },
      { status: 500 }
    );
  }
}