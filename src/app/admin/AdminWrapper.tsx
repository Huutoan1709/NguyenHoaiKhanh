"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types/index';

export default function AdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Kiểm tra người dùng đã đăng nhập chưa
        const userData = localStorage.getItem("adminUser");
        
        if (!userData && !pathname?.includes('/admin/login')) {
          router.replace('/admin/login');
          return false;
        }
        
        return !!userData;
      } catch (e) {
        return false;
      }
    };
    
    const isAuth = checkAuth();
    setIsAuthorized(isAuth);
  }, [pathname, router]);
  
  // Hiển thị loading trong khi kiểm tra xác thực
  if (isAuthorized === null && !pathname?.includes('/admin/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {children}
      {pathname && !pathname.includes('/admin/login') }
    </>
  );
}