"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Post, Category, PostFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PostModal from "@/components/admin/posts/PostModal";
import PostList from "@/components/admin/posts/PostList";
import { 
  PlusIcon, 
  SearchIcon, 
  ChevronRightIcon, 
  HomeIcon, 
  X,
  FileText,
  Filter,
  BarChart3,
  TrendingUp,
  Menu,
  Grid3X3
} from 'lucide-react';
import useSweetAlert from "@/hooks/useSweetAlert";

export default function PostsPage() {
  const router = useRouter();
  const { toast, confirm, alert, loading } = useSweetAlert();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingState, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const [filters, setFilters] = useState({
    status: "",
    categoryId: "",
    search: ""
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [pagination.page]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, filters]);

  useEffect(() => {
    filterPosts();
  }, [filters.search, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit)
      });
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      
      if (filters.categoryId) {
        queryParams.append('categoryId', filters.categoryId);
      }

      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/posts?${queryParams.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          await alert({
            title: 'Phiên đăng nhập hết hạn',
            text: 'Vui lòng đăng nhập lại để tiếp tục',
            icon: 'warning',
            confirmButtonText: 'Đăng nhập',
          });
          router.push('/admin/login');
          return;
        }
        
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (error: any) {
      console.error("Fetch posts error:", error);
      setError(error.message || "Không thể tải danh sách bài viết");
      
      alert({
        title: 'Lỗi!',
        text: error.message || "Không thể tải danh sách bài viết",
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch categories");
      }

      const data = await response.json();
      const categoriesList = data.items || [];
      setCategories(categoriesList);
    } catch (error: any) {
      console.error("Fetch categories error:", error);
      setCategories([]);
      toast("Không thể tải danh mục", 'error');
    }
  };

  const filterPosts = () => {
    if (!filters.search) {
      setFilteredPosts(posts);
      return;
    }

    const searchLower = filters.search.toLowerCase();
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) || 
      post.excerpt?.toLowerCase().includes(searchLower) ||
      post.slug?.toLowerCase().includes(searchLower)
    );
    
    setFilteredPosts(filtered);
  };

  const handleFilterChange = (type: 'status' | 'categoryId' | 'search', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleCreatePost = async (data: PostFormData) => {
    try {
      const loadingDialog = loading('Đang xử lý...');
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      loadingDialog.close();

      if (!response.ok) {
        const error = await response.json();
        
        if (response.status === 401) {
          await alert({
            title: 'Phiên đăng nhập hết hạn',
            text: 'Vui lòng đăng nhập lại để tiếp tục',
            icon: 'warning',
            confirmButtonText: 'Đăng nhập',
          });
          router.push('/admin/login');
          return;
        }
        
        throw new Error(error.error || "Không thể tạo bài viết");
      }

      const newPost = await response.json();
      setPosts(prevPosts => [newPost, ...prevPosts]);
      fetchPosts();
      
      toast("Tạo bài viết thành công", 'success');
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Create post error:", error);
      
      alert({
        title: 'Lỗi!',
        text: error.message || "Không thể tạo bài viết",
        icon: 'error',
      });
      
      return Promise.reject(error.message);
    }
  };

  const handleUpdatePost = async (data: PostFormData) => {
    if (!selectedPost) return Promise.reject("No post selected");
    
    try {
      const loadingDialog = loading('Đang cập nhật...');
      
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      loadingDialog.close();

      if (!response.ok) {
        const error = await response.json();
        
        if (response.status === 401) {
          await alert({
            title: 'Phiên đăng nhập hết hạn',
            text: 'Vui lòng đăng nhập lại để tiếp tục',
            icon: 'warning',
            confirmButtonText: 'Đăng nhập',
          });
          router.push('/admin/login');
          return Promise.reject("Unauthorized");
        }
        
        throw new Error(error.error || "Không thể cập nhật bài viết");
      }

      const updatedPost = await response.json();
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        )
      );
      
      toast("Cập nhật thành công", 'success');
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Update post error:", error);
      
      alert({
        title: 'Lỗi!',
        text: error.message || "Không thể cập nhật bài viết",
        icon: 'error',
      });
      
      return Promise.reject(error.message);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const isConfirmed = await confirm({
        title: 'Xác nhận xóa',
        text: "Bạn có chắc chắn muốn xóa bài viết này? Dữ liệu sẽ không thể khôi phục!",
        icon: 'warning',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });
      
      if (!isConfirmed) {
        return;
      }

      setLoading(true);
      const loadingDialog = loading('Đang xóa...');

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      loadingDialog.close();

      if (!response.ok) {
        if (response.status === 401) {
          await alert({
            title: 'Phiên đăng nhập hết hạn',
            text: 'Vui lòng đăng nhập lại để tiếp tục',
            icon: 'warning',
            confirmButtonText: 'Đăng nhập',
          });
          router.push('/admin/login');
          return;
        }
        
        const error = await response.json();
        throw new Error(error.error || "Không thể xóa bài viết");
      }

      const data = await response.json();
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      toast(data.message || "Xóa bài viết thành công", 'success');
      
      if (posts.length === 1 && pagination.page > 1) {
        setPagination(prev => ({
          ...prev,
          page: prev.page - 1
        }));
      } else if (posts.length <= 1) {
        fetchPosts();
      }
    } catch (error: any) {
      console.error("Delete post error:", error);
      toast(error.message || "Không thể xóa bài viết", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: pagination.total,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((acc, p) => acc + (p.viewCount || 0), 0)
  };

  return (
    <div className="mt-2 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side - Title */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  Quản lý bài viết
                </h1>
                <div className="hidden sm:block text-sm text-gray-500">
                  {pagination.total} bài viết
                </div>
              </div>
            </div>
            
            {/* Right side - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Filter Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden w-9 h-9 p-0 rounded-lg"
              >
                <Filter className="w-4 h-4" />
              </Button>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'table' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>

              {/* Add Button */}
              <Button 
                onClick={() => { setSelectedPost(undefined); setIsModalOpen(true); }}
                className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-9 px-3 sm:h-10 sm:px-4"
              >
                <PlusIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Thêm bài viết</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Mobile-Optimized Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng bài viết</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm text-gray-600">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500" />
              <span className="hidden sm:inline">Đang hoạt động</span>
              <span className="sm:hidden">Hoạt động</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Đã xuất bản</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
              {stats.published > 0 && (
                <span>{Math.round((stats.published / stats.total) * 100)}% tổng số</span>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Bản nháp</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.draft}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Cần xem xét</span>
              <span className="sm:hidden">Cần xem</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalViews}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Tổng lượt xem</span>
              <span className="sm:hidden">Tổng xem</span>
            </div>
          </div>
        </div>
        
        {/* Mobile/Desktop Filters */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ${
          showFilters ? 'block' : 'hidden sm:block'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
            {(filters.status || filters.categoryId || filters.search) && (
              <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                {posts.length} kết quả
              </span>
            )}
          </div>
          
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {/* Search */}
            <div className="relative col-span-2 sm:col-span-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="pl-10 h-11 sm:h-12 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="h-11 sm:h-12 px-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
            
            {/* Category Filter */}
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="h-11 sm:h-12 px-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">Tất cả danh mục</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category._count?.posts || 0})
                  </option>
                ))
              ) : null}
            </select>

            {/* Clear Filters */}
            {(filters.status || filters.categoryId || filters.search) && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: "", categoryId: "", search: "" });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="h-11 sm:h-12 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        {/* Posts List Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          {loadingState ? (
            <div className="py-12 sm:py-16 text-center">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-blue-600 animate-pulse"></div>
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu</h3>
              <p className="text-sm sm:text-base text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
          ) : error ? (
            <div className="p-6 sm:p-8">
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                <p className="text-sm sm:text-base text-red-700 mb-4">{error}</p>
                <Button 
                  onClick={fetchPosts}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          ) : (
            <PostList
              posts={posts}
              onEdit={(post) => { setSelectedPost(post); setIsModalOpen(true) }}
              onDelete={handleDeletePost}
              pagination={pagination}
              onPageChange={(newPage) => {
                setPagination(prev => ({ ...prev, page: newPage }));
              }}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      {/* Post Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPost(undefined); }}
        onSubmit={selectedPost ? handleUpdatePost : handleCreatePost}
        post={selectedPost}
        categories={categories}
      />
    </div>
  );
}