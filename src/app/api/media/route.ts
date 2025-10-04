import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import cloudinary from "cloudinary";

export async function GET(request: NextRequest) {
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
    
    // Lấy danh sách resources từ Cloudinary
    const { resources } = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: "nextjs-blog/",
      max_results: 100,
    });
    
    // Chuyển đổi dữ liệu
    const media = resources.map((resource: any) => ({
      id: resource.asset_id,
      url: resource.secure_url,
      type: resource.resource_type === "image" ? "image" : "video",
      createdAt: resource.created_at,
      public_id: resource.public_id,
    }));
    
    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách media" },
      { status: 500 }
    );
  }
}