"use client";

import { CategoryWithStats } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Folder, Pencil, Trash2, ChevronLeft, ChevronRight, Clock, Hash, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface CategoryListProps {
  categories: CategoryWithStats[];
  onEdit: (category: CategoryWithStats) => void;
  onDelete: (categoryId: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

function formatDate(d: Date | string) {
  try {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: vi });
  } catch {
    return "-";
  }
}

const CategoryList = ({ 
  categories, 
  pagination, 
  onPageChange,
  onEdit, 
  onDelete 
}: CategoryListProps) => {
  const { page, totalPages, total } = pagination;

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
              <th className="min-w-[300px] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Đường dẫn</th>
              <th className="w-28 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bài viết</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tạo lúc</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cập nhật</th>
              <th className="w-28 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {categories.map((category, idx) => (
              <tr key={category.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  {(pagination.page - 1) * pagination.limit + idx + 1}
                </td>

                {/* Category Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 border-2 border-white shadow-md flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-600 line-clamp-2">{category.description}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300">
                    /{category.slug}
                  </span>
                </td>

                {/* Post Count */}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{category._count?.posts || 0}</span>
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(category.createdAt)}</span>
                  </div>
                </td>

                {/* Updated Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(category.updatedAt)}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
                      onClick={() => onEdit(category)}
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-lg"
                      onClick={() => onDelete(category.id)}
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
                    <p className="text-gray-500">Bắt đầu bằng cách tạo danh mục đầu tiên của bạn.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Results info */}
            <div className="text-sm text-gray-600 font-medium">
              Hiển thị <span className="font-semibold text-gray-900">{categories.length}</span> / {' '}
              <span className="font-semibold text-gray-900">{total}</span> danh mục
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  page <= 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                )}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  const isCurrentPage = pageNum === page;

                  // Show first, last, and pages around current page
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={cn(
                          "inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200",
                          isCurrentPage 
                            ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  }

                  // Show dots for page gaps
                  if (
                    (pageNum === 2 && page > 3) ||
                    (pageNum === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                  }

                  return null;
                })}
              </div>

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  page >= totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                )}
              >
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;