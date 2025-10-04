"use client";

import Link from "next/link";

export default function AdminMenuCards() {  // Đổi thành AdminMenuCards để nhất quán
  const menuItems = [
    {
      title: "Quản lý bài viết",
      description: "Thêm, sửa, xóa bài viết",
      link: "/admin/posts",  // Thêm đường dẫn thực tế
      icon: "📝"
    },
    {
      title: "Quản lý danh mục",
      description: "Thêm, sửa, xóa danh mục",
      link: "/admin/categories",
      icon: "📁"
    },
    {
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản người dùng",
      link: "/admin/users",
      icon: "👥"
    },
    {
      title: "Quản lý media",
      description: "Upload và quản lý file media",
      link: "/admin/media",
      icon: "🖼️"
    },
    {
      title: "Cài đặt",
      description: "Cấu hình website",
      link: "/admin/settings",
      icon: "⚙️"
    }
  ];

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {menuItems.map((item) => (
        <Link key={item.title} href={item.link} className="block">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}