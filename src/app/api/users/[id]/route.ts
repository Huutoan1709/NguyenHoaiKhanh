import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { uploadAvatar } from "@/lib/cloudinary";

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  website?: string;
  [key: string]: string | undefined;
}

// Lấy thông tin người dùng theo ID
export async function GET(
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
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }
    
    // Lấy thông tin người dùng
    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!userData) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}

// Cập nhật thông tin người dùng
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
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
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }
    
    // Lọc dữ liệu được phép cập nhật
    const allowedFields: Record<string, any> = {
      name: data.name,
      bio: data.bio,
    };
    
    // Xử lý avatar nếu có
    if (data.avatar) {
      allowedFields.avatar = data.avatar;
    }
    
    // Xử lý socialLinks nếu có
    if (data.socialLinks) {
      // Đảm bảo định dạng đúng cho socialLinks
      const socialLinks: SocialLinks = {};
      
      // Xác thực và làm sạch các URL xã hội
      if (typeof data.socialLinks === 'object' && data.socialLinks !== null) {
        // Danh sách các mạng xã hội được hỗ trợ
        const allowedSocialPlatforms = [
          'facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube', 'website'
        ];
        
        for (const platform of allowedSocialPlatforms) {
          if (data.socialLinks[platform]) {
            // Kiểm tra định dạng URL
            try {
              const url = new URL(data.socialLinks[platform]);
              if (url.protocol === 'http:' || url.protocol === 'https:') {
                socialLinks[platform] = data.socialLinks[platform];
              }
            } catch (e) {
              // URL không hợp lệ, bỏ qua
            }
          }
        }
        
        allowedFields.socialLinks = socialLinks;
      }
    }
    
    // Chỉ admin mới có thể cập nhật email và role
    if (userFromToken.role === "admin") {
      if (data.email) allowedFields.email = data.email;
      if (data.role) allowedFields.role = data.role;
    }
    
    // Cập nhật thông tin người dùng
    const updatedUser = await prisma.user.update({
      where: { id },
      data: allowedFields,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật thông tin người dùng" },
      { status: 500 }
    );
  }
}

// Xóa người dùng
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
    
    // Chỉ admin mới có thể xóa người dùng
    if (userFromToken.role !== "admin") {
      return NextResponse.json(
        { error: "Không có quyền xóa người dùng" },
        { status: 403 }
      );
    }
    
    // Xóa người dùng
    await prisma.user.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Không thể xóa người dùng" },
      { status: 500 }
    );
  }
}

// Thêm API endpoint để upload avatar
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File | null;
    
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
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }
    
    // Xử lý upload avatar
    if (!avatarFile) {
      return NextResponse.json(
        { error: "Không tìm thấy file avatar" },
        { status: 400 }
      );
    }
    
    // Kiểm tra kích thước và định dạng file
    if (avatarFile.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json(
        { error: "Kích thước file quá lớn (tối đa 5MB)" },
        { status: 400 }
      );
    }
    
    // Kiểm tra định dạng file
    const fileType = avatarFile.type;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(fileType)) {
      return NextResponse.json(
        { error: "Định dạng file không hỗ trợ (chỉ hỗ trợ JPEG, PNG, GIF, WEBP, SVG)" },
        { status: 400 }
      );
    }
    
    // Chuyển đổi File thành Buffer để upload lên Cloudinary
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload lên Cloudinary
    const avatarUrl = await uploadAvatar(buffer);
    
    if (!avatarUrl) {
      return NextResponse.json(
        { error: "Không thể upload avatar" },
        { status: 500 }
      );
    }
    
    // Cập nhật avatar trong database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        avatar: avatarUrl,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Không thể upload avatar" },
      { status: 500 }
    );
  }
}