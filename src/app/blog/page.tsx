"use client";

import { useState, useEffect } from "react";
import { Post } from "@/types";
import BlogList from "@/components/blog/BlogList";
import CategoryFilter from "@/components/blog/CategoryFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { SearchIcon, BookOpen, Filter, TrendingUp } from "lucide-react";
import BackToTop from "@/components/common/BackToTop";
import { motion } from "framer-motion";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, search, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      console.log('Client: Fetching posts with params:', params.toString());

      const response = await fetch(`/api/posts/published?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || "Không thể tải danh sách bài viết");
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data.items)) {
        console.error('Invalid API Response:', data);
        throw new Error("Invalid response format");
      }

      setPosts(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));

    } catch (error: any) {
      console.error("Fetch posts error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <div className="relative z-10 pt-20">
        {/* Enhanced Hero Section */}
        <div className="relative pb-16">
          <div className="container mx-auto px-4 py-16">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Hero Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 mb-8 shadow-2xl"
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6"
              >
                Bài viết
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Khám phá các bài viết, chia sẻ kinh nghiệm và kiến thức mới nhất từ cộng đồng
              </motion.p>
              
              {/* Stats Cards */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-8 justify-center mb-8"
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
                  <div className="flex items-center text-blue-600">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="font-bold text-lg">{pagination.total}</span>
                    <span className="text-sm text-gray-600 ml-1">bài viết</span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
                  <div className="flex items-center text-purple-600">
                    <Filter className="w-5 h-5 mr-2" />
                    <span className="font-bold text-lg">{selectedCategory ? '1' : 'Tất cả'}</span>
                    <span className="text-sm text-gray-600 ml-1">danh mục</span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
                  <div className="flex items-center text-emerald-600">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="font-bold text-lg">Hot</span>
                    <span className="text-sm text-gray-600 ml-1">trending</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className="mx-auto h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
              />
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Search & Filter Section */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl mb-12 border border-white/50"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelect={(categoryId) => {
                    setSelectedCategory(categoryId);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                />
              </div>
            </motion.div>

            {/* Loading State */}
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-white/50"
                  >
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3 rounded-full" />
                      <Skeleton className="h-4 w-full mb-2 rounded-full" />
                      <Skeleton className="h-4 w-2/3 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="bg-red-50/70 backdrop-blur-sm rounded-3xl p-8 inline-block border border-red-200/50 shadow-lg">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 mb-4 text-lg font-semibold">{error}</p>
                  <button 
                    onClick={fetchPosts}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Thử lại
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Results info */}
                {posts.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                  >
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                      <p className="text-gray-600 font-medium">
                        <span className="text-blue-600 font-bold">{posts.length}</span> trên tổng số <span className="text-purple-600 font-bold">{pagination.total}</span> bài viết
                        {search && (
                          <span className="text-emerald-600"> cho từ khóa "<span className="font-bold">{search}</span>"</span>
                        )}
                        {selectedCategory && (
                          <span className="text-orange-600"> trong danh mục đã chọn</span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-lg max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SearchIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">Không tìm thấy bài viết nào</p>
                      <p className="text-gray-400 text-sm">Hãy thử với từ khóa khác hoặc bỏ bộ lọc</p>
                    </div>
                  </motion.div>
                )}

                <BlogList posts={posts} />

                {/* Enhanced Pagination */}
                {pagination.totalPages > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-16"
                  >
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                          disabled={pagination.page === 1}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          ← Trước
                        </motion.button>
                        
                        {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                          const pageNum = i + 1;
                          const isActive = pagination.page === pageNum;
                          
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                              className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                                isActive
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                  : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                              }`}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                          disabled={pagination.page === pagination.totalPages}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          Sau →
                        </motion.button>
                      </div>
                      
                      {/* Page Info */}
                      <div className="text-center mt-4 text-sm text-gray-500">
                        Trang <span className="font-bold text-blue-600">{pagination.page}</span> / <span className="font-bold text-purple-600">{pagination.totalPages}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <BackToTop />
    </div>
  );
}

