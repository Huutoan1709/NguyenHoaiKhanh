import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RssIcon, HomeIcon } from "lucide-react";

export default function BlogHeader() {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <HomeIcon size={18} className="mr-2" />
              Trang chủ
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/blog" 
                className="text-gray-900 font-medium"
              >
                Tất cả bài viết
              </Link>
              <Link 
                href="/blog/categories" 
                className="text-gray-600 hover:text-gray-900"
              >
                Danh mục
              </Link>
              <Link 
                href="/blog/tags" 
                className="text-gray-600 hover:text-gray-900"
              >
                Thẻ
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}