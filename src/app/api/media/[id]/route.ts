import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kiểm tra xác thực
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
    
    // Chỉ admin mới được phép xóa media
    if (userFromToken.role !== "admin") {
      return NextResponse.json(
        { error: "Không có quyền xóa media" },
        { status: 403 }
      );
    }
    
    const publicId = params.id;
    
    if (!publicId) {
      return NextResponse.json(
        { error: "Missing public_id" },
        { status: 400 }
      );
    }
    
    // Xóa file từ Cloudinary
    await deleteFromCloudinary(publicId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Không thể xóa media" },
      { status: 500 }
    );
  }
}