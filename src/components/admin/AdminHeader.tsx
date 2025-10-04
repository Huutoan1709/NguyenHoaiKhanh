"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/index";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  user?: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Kiểm tra nếu URL avatar là hợp lệ
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    
    // Kiểm tra nếu là URL đầy đủ (http:// hoặc https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    
    // Kiểm tra nếu là đường dẫn tương đối bắt đầu bằng "/"
    if (url.startsWith('/')) {
      return true;
    }
    
    return false;
  };

  // Tạo fallback avatar dựa trên tên người dùng
  const getFallbackAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
  };

  // Xác định avatar URL để sử dụng
  const getAvatarUrl = () => {
    if (!user) return '';
    
    if (imageError || !isValidImageUrl(user.avatar)) {
      return getFallbackAvatar(user.name);
    }
    
    return user.avatar;
  };

  const handleLogout = async () => {
    try {
      // Đóng menu dropdown
      setIsMenuOpen(false);
      
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("adminUser");
      router.push("/admin/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/admin" className="font-bold text-xl text-blue-600">
          Admin Dashboard
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/admin/posts" className="text-gray-600 hover:text-gray-900">
            Bài viết
          </Link>
          <Link href="/admin/categories" className="text-gray-600 hover:text-gray-900">
            Danh mục
          </Link>
          <Link href="/admin/media" className="text-gray-600 hover:text-gray-900">
            Media
          </Link>
        </nav>
        
        {user ? (
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="hidden md:inline-block">{user.name}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {isValidImageUrl(user.avatar) && !imageError ? (
                  <Image
                    src={user.avatar || ''}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                    onError={() => setImageError(true)}
                    unoptimized={!user.avatar?.startsWith('/')} // Tắt tối ưu cho URL bên ngoài
                  />
                ) : (
                  <Image
                    src={getFallbackAvatar(user.name)}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link href="/admin/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Hồ sơ
                </Link>
                <Link href="/admin/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Cài đặt
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/admin/login" className="text-blue-600 hover:text-blue-500">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}