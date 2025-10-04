"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stats, User } from "@/types/index";
import AdminMenuCards from "@/components/admin/dashboard/AdminMenuCards";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import AdminWrapper from "./AdminWrapper";
import { motion } from "framer-motion";
import { BarChart3, Users, FileText, MessageSquare, Settings, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu đang chạy ở client-side
    if (typeof window !== 'undefined') {
      const fetchData = async () => {
        try {
          // Get user from localStorage
          const userData = localStorage.getItem("adminUser");
          let userObj = null;

          if (userData) {
            try {
              userObj = JSON.parse(userData);
              setUser(userObj);
            } catch (e) {
              console.error("Failed to parse user data", e);
            }
          } else {
            // Redirect to login if no user found
            router.push("/admin/login");
            return;
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("adminUser");
      router.push("/admin/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Dữ liệu mẫu cho stats
  const mockStats = {
    posts: 24,
    categories: 6,
    comments: 128,
    users: 42
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        {/* Enhanced Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700">Đang tải dữ liệu...</p>
            <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <AdminWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="fixed inset-0 z-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Animated geometric shapes */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl"
          />
          
          <motion.div 
            animate={{ 
              rotate: -180,
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              rotate: { duration: 35, repeat: Infinity, ease: "linear" },
              x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-40 left-32 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full"
          />

          {/* Floating Gradient Orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-6">
          <div className="container mx-auto max-w-7xl">
            
            {/* Header Section */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 mb-8 shadow-2xl"
              >
                <BarChart3 className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6"
              >
                Admin Dashboard
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Chào mừng trở lại, <span className="font-bold text-blue-600">{user?.name || 'Admin'}</span>! 
                Quản lý nội dung và hệ thống một cách hiệu quả.
              </motion.p>
              
              {/* Decorative Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="mx-auto h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
              />
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Thống kê tổng quan</h2>
                      <p className="text-gray-600">Dữ liệu cập nhật theo thời gian thực</p>
                    </div>
                  </div>
                  
                  {/* Time Badge */}
                  <div className="bg-emerald-50 px-4 py-2 rounded-full">
                    <span className="text-emerald-600 font-semibold text-sm">
                      Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                </div>
                
                <StatsCards stats={mockStats} />
              </div>
            </motion.div>

            {/* Menu Section */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Menu quản lý</h2>
                      <p className="text-gray-600">Truy cập nhanh các chức năng chính</p>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Tạo bài viết mới
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Xem báo cáo
                    </motion.button>
                  </div>
                </div>
                
                <AdminMenuCards />
              </div>
            </motion.div>

            {/* Quick Stats Footer */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-semibold">Hoạt động hôm nay</p>
                    <p className="text-2xl font-bold text-blue-700">12</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-semibold">Người dùng online</p>
                    <p className="text-2xl font-bold text-purple-700">8</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 font-semibold">Bình luận mới</p>
                    <p className="text-2xl font-bold text-emerald-700">23</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
            </motion.div>

            {/* Enhanced Decorative Element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex justify-center mt-16"
            >
              <div className="relative">
                <div className="w-40 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full"></div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}