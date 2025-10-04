import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ cookie
    const token = request.cookies.get("admin-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Không tìm thấy token" },
        { status: 401 }
      );
    }
    
    // Giải mã token
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
      const { payload } = await jwtVerify(token, secret);
      
      // Trả về thông tin token đã giải mã (không bao gồm các thông tin nhạy cảm)
      return NextResponse.json({
        sub: payload.sub,
        role: payload.role,
        name: payload.name,
        email: payload.email,
        iat: payload.iat,
        exp: payload.exp,
        isValid: true
      });
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({
        error: "Token không hợp lệ",
        isValid: false,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, { status: 401 });
    }
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Không thể debug token" },
      { status: 500 }
    );
  }
}