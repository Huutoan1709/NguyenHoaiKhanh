import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Xóa cookie admin-token
    cookies().delete("admin-token");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { error: "Không thể đăng xuất" },
      { status: 500 }
    );
  }
}