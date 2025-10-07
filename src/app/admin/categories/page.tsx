"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryWithStats, CategoryFormData } from "@/types";
import CategoryList from "@/components/admin/categories/CategoryList";
import CategoryModal from "@/components/admin/categories/CategoryModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusIcon, 
  SearchIcon, 
  ChevronRightIcon, 
  HomeIcon, 
  X,
  BookOpen,
  Filter,
  BarChart3,
  TrendingUp,
  Folder,
  Hash,
  Menu,
  Grid3X3
} from 'lucide-react';
import useSweetAlert from "@/hooks/useSweetAlert";

export default function CategoriesPage() {
  const router = useRouter();
  const { toast, confirm, alert, loading } = useSweetAlert();
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithStats | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    fetchCategories();
  }, [pagination.page]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCategories(categories);
      return;
    }
    
    const searchLower = search.toLowerCase();
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchLower) || 
      category.slug?.toLowerCase().includes(searchLower) ||
      category.description?.toLowerCase().includes(searchLower)
    );
    
    setFilteredCategories(filtered);
  }, [search, categories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit)
      });

      if (search) {
        queryParams.append('search', search);
      }

      const response = await fetch(`/api/categories?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
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
        throw new Error(error.error || "Failed to fetch categories");
      }

      const data = await response.json();
      
      setCategories(data.items);
      setFilteredCategories(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));

    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError(error.message || "Không thể tải danh sách danh mục");
      
      alert({
        title: 'Lỗi!',
        text: error.message || "Không thể tải danh sách danh mục", 
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const loadingDialog = loading(selectedCategory ? 'Đang cập nhật...' : 'Đang thêm mới...');
      
      const url = selectedCategory 
        ? `/api/categories/${selectedCategory.id}`
        : "/api/categories";
      
      const response = await fetch(url, {
        method: selectedCategory ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
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
        throw new Error(error.error || "Failed to save category");
      }

      const savedCategory = await response.json();

      if (selectedCategory) {
        setCategories(categories.map(cat => 
          cat.id === savedCategory.id ? savedCategory : cat
        ));
        toast("Cập nhật danh mục thành công", "success");
      } else {
        setCategories([savedCategory, ...categories]);
        toast("Thêm danh mục mới thành công", "success");
      }

      setIsModalOpen(false);
      fetchCategories(); // Refresh data
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert({
        title: 'Lỗi!',
        text: error.message || "Không thể lưu danh mục",
        icon: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const isConfirmed = await confirm({
        title: 'Xác nhận xóa',
        text: "Bạn có chắc chắn muốn xóa danh mục này? Các bài viết liên quan sẽ không còn thuộc danh mục này nữa!",
        icon: 'warning',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });
      
      if (!isConfirmed) {
        return;
      }

      const loadingDialog = loading('Đang xóa...');
      
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
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
        throw new Error(error.error || "Failed to delete category");
      }

      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.id !== categoryId)
      );
      
      toast("Xóa danh mục thành công", "success");

      if (categories.length === 1 && pagination.page > 1) {
        setPagination(prev => ({
          ...prev,
          page: prev.page - 1
        }));
      } else if (categories.length <= 1) {
        fetchCategories();
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert({
        title: 'Lỗi!',
        text: error.message || "Không thể xóa danh mục",
        icon: 'error',
      });
    }
  };

  // Calculate statistics
  const stats = {
    total: pagination.total,
    withPosts: categories.filter(cat => (cat._count?.posts || 0) > 0).length,
    totalPosts: categories.reduce((acc, cat) => acc + (cat._count?.posts || 0), 0),
    averagePostsPerCategory: categories.length > 0 
      ? Math.round(categories.reduce((acc, cat) => acc + (cat._count?.posts || 0), 0) / categories.length * 10) / 10
      : 0
  };

  if (isLoading) {
    return (
      <div className="mt-2 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
        <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    Quản lý danh mục
                  </h1>
                  <div className="hidden sm:block text-sm text-gray-500">
                    Đang tải...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="py-12 sm:py-16 text-center">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-blue-600 animate-pulse"></div>
              <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu</h3>
            <p className="text-sm sm:text-base text-gray-600">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side - Title */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  Quản lý danh mục
                </h1>
                <div className="hidden sm:block text-sm text-gray-500">
                  {pagination.total} danh mục
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
                onClick={() => { setSelectedCategory(undefined); setIsModalOpen(true); }}
                className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-9 px-3 sm:h-10 sm:px-4"
              >
                <PlusIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Thêm danh mục</span>
              </Button>
            </div>
          </div>

          {/* Desktop Breadcrumb - Hidden on mobile */}
          <div className="hidden sm:flex items-center text-sm text-gray-500 pb-4">
            <button 
              onClick={() => router.push('/admin')}
              className="hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              <HomeIcon className="w-4 h-4" />
              Dashboard
            </button>
            <ChevronRightIcon className="w-4 h-4 mx-2" />
            <span className="text-gray-900">Danh mục</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Mobile-Optimized Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng danh mục</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Folder className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
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
                <p className="text-xs sm:text-sm font-medium text-gray-600">Có bài viết</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.withPosts}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
              {stats.total > 0 && (
                <span>{Math.round((stats.withPosts / stats.total) * 100)}% có nội dung</span>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Tổng bài viết</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalPosts}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Hash className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Trong tất cả danh mục</span>
              <span className="sm:hidden">Tất cả</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Trung bình</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.averagePostsPerCategory}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Bài viết/danh mục</span>
              <span className="sm:hidden">TB/danh mục</span>
            </div>
          </div>
        </div>

        {/* Mobile/Desktop Filters */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ${
          showFilters ? 'block' : 'hidden sm:block'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Tìm kiếm</h3>
            {search && (
              <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                {filteredCategories.length} kết quả
              </span>
            )}
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên, slug hoặc mô tả..."
                className="pl-10 h-11 sm:h-12 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
              />
            </div>
            
            {search && (
              <Button
                variant="outline"
                onClick={() => setSearch("")}
                className="h-11 sm:h-12 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Xóa</span>
              </Button>
            )}
          </div>
        </div>

        {/* Categories List Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          {error ? (
            <div className="p-6 sm:p-8">
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                <p className="text-sm sm:text-base text-red-700 mb-4">{error}</p>
                <Button 
                  onClick={fetchCategories}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          ) : (
            <CategoryList
              categories={search ? filteredCategories : categories}
              onEdit={(category) => { setSelectedCategory(category); setIsModalOpen(true); }}
              onDelete={handleDeleteCategory}
              pagination={pagination}
              onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedCategory(undefined); }}
        onSubmit={handleSubmit}
        category={selectedCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}