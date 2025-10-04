import { NextRequest, NextResponse } from "next/server";

// Thêm export cho HTTP methods được phép
export const runtime = 'edge'; // Add this line
export const dynamic = 'force-dynamic'; // Add this line

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to base64
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64String,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Không thể upload file" },
      { status: 500 }
    );
  }
}