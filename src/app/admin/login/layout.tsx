import React from 'react';

export const metadata = {
  title: 'Đăng nhập quản trị | Nguyễn Hoài Khánh',
  description: 'Trang đăng nhập vào khu vực quản trị',
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-login-layout">
      {children}
    </div>
  )
}