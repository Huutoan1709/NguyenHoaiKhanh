import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { uploadToCloudinary } from "@/lib/cloudinary";

// ✅ Sửa đổi: dùng Segment Config Export thay cho export const config
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 🛡️ Kiểm tra xác thực
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧩 Giải mã token để lấy thông tin người dùng
    let userFromToken;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");
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

    // 👮 Chỉ cho phép admin hoặc author upload
    if (userFromToken.role !== "admin" && userFromToken.role !== "author") {
      return NextResponse.json(
        { error: "Không có quyền upload media" },
        { status: 403 }
      );
    }

    // 📦 Xử lý form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 400 });
    }

    // ⚖️ Giới hạn kích thước file
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB video, 10MB ảnh

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File quá lớn. Kích thước tối đa: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // ✅ Kiểm tra loại file hợp lệ
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    const allowedVideoTypes = ["video/mp4", "video/webm"];

    if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json({ error: "Định dạng file không được hỗ trợ" }, { status: 400 });
    }

    // 📂 Chuyển file thành buffer để upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ☁️ Upload lên Cloudinary
    const url = await uploadToCloudinary(buffer, folder);

    if (!url) {
      return NextResponse.json({ error: "Không thể upload file" }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error in media upload:", error);
    return NextResponse.json({ error: "Không thể xử lý upload" }, { status: 500 });
  }
}
