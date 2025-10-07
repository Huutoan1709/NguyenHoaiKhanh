"use client"

import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { EditIcon, TrashIcon, ChevronLeft, ChevronRight, Folder, BarChart3, Calendar, FileText, Hash } from "lucide-react"
import type { CategoryWithStats } from "@/types"
import React from "react"

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
  viewMode?: 'table' | 'grid';
}

function formatDate(d: Date | string) {
  try {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: vi })
  } catch {
    return "-"
  }
}

// Mobile Card Component
const MobileCategoryCard = ({ category, onEdit, onDelete, index, pagination }: {
  category: CategoryWithStats;
  onEdit: (category: CategoryWithStats) => void;
  onDelete: (categoryId: string) => void;
  index: number;
  pagination: any;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200">
    <div className="flex gap-3">
      {/* Category Icon */}
      <div className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center border-2 border-white shadow-md bg-blue-50">
        <Folder className="w-6 h-6 text-blue-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 pr-2">
            {category.name}
          </h3>
          <span className="text-xs text-gray-400 font-medium flex-shrink-0">
            #{(pagination.page - 1) * pagination.limit + index + 1}
          </span>
        </div>

        {/* Description */}
        {category.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {category.description}
          </p>
        )}

        {/* Slug */}
        <div className="mb-2">
          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            /{category.slug}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span className="font-semibold text-blue-600">{category._count?.posts || 0} bài viết</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(category.updatedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
            onClick={() => onEdit(category)}
          >
            <EditIcon className="w-3 h-3 mr-1" />
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-lg"
            onClick={() => onDelete(category.id)}
          >
            <TrashIcon className="w-3 h-3 mr-1" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Desktop Table Row Component
const DesktopTableRow = ({ category, onEdit, onDelete, index, pagination }: {
  category: CategoryWithStats;
  onEdit: (category: CategoryWithStats) => void;
  onDelete: (categoryId: string) => void;
  index: number;
  pagination: any;
}) => (
  <tr className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
    <td className="px-6 py-4 text-sm font-medium text-gray-500">
      {(pagination.page - 1) * pagination.limit + index + 1}
    </td>
    
    <td className="px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-white shadow-md flex-shrink-0 bg-blue-50">
          <Folder className="w-6 h-6 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 line-clamp-1 mb-1">
            {category.name}
          </div>
          {category.description && (
            <div className="text-sm text-gray-600 line-clamp-1">
              {category.description}
            </div>
          )}
        </div>
      </div>
    </td>
    
    <td className="px-6 py-4">
      <span className="font-mono text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg border">
        /{category.slug}
      </span>
    </td>
    
    <td className="px-6 py-4 text-center">
      <div className="flex items-center justify-center gap-1">
        <BarChart3 className="w-4 h-4 text-blue-600" />
        <span className="font-semibold text-blue-600">
          {category._count?.posts || 0}
        </span>
      </div>
    </td>
    
    <td className="px-6 py-4">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(category.updatedAt)}</span>
      </div>
    </td>
    
    <td className="px-6 py-4">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
          title="Chỉnh sửa"
        >
          <EditIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category.id)}
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-lg"
          title="Xóa"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
    </td>
  </tr>
);

const CategoryList = ({ 
  categories, 
  pagination, 
  onPageChange, 
  onEdit, 
  onDelete, 
  viewMode = 'table'
}: CategoryListProps) => {
  const { page, totalPages, total } = pagination;

  // Grid view for both mobile and desktop
  if (viewMode === 'grid') {
    return (
      <div className="overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {categories.map((category, idx) => (
              <MobileCategoryCard
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                index={idx}
                pagination={pagination}
              />
            ))}
          </div>

          {categories.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
              <p className="text-gray-500">Tạo danh mục đầu tiên để phân loại bài viết.</p>
            </div>
          )}
        </div>

        {/* Pagination for grid view */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-medium">
                <span className="hidden sm:inline">Hiển thị </span>
                <span className="font-semibold text-gray-900">{categories.length}</span>
                <span className="hidden sm:inline"> / {total} danh mục</span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    page <= 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (page <= 3) {
                      pageNum = index + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = page - 2 + index;
                    }

                    const isCurrentPage = pageNum === page;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          isCurrentPage 
                            ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    page >= totalPages 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                  }`}
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="w-4 h-4 sm:ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Table view - Mobile cards for small screens, table for larger screens
  return (
    <div className="overflow-hidden">
      {/* Mobile Cards for small screens */}
      <div className="block sm:hidden p-4 space-y-4">
        {categories.map((category, idx) => (
          <MobileCategoryCard
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            index={idx}
            pagination={pagination}
          />
        ))}

        {categories.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
            <p className="text-gray-500">Tạo danh mục đầu tiên để phân loại bài viết.</p>
          </div>
        )}
      </div>

      {/* Desktop Table for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
              <th className="min-w-[280px] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
              <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
              <th className="w-32 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bài viết</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cập nhật</th>
              <th className="w-28 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category, idx) => (
              <DesktopTableRow
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                index={idx}
                pagination={pagination}
              />
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Folder className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
                    <p className="text-gray-500">Tạo danh mục đầu tiên để phân loại bài viết.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              <span className="hidden sm:inline">Hiển thị </span>
              <span className="font-semibold text-gray-900">{categories.length}</span>
              <span className="hidden sm:inline"> / {total} danh mục</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className={`inline-flex items-center px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200 ${
                  page <= 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Trước</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (page <= 3) {
                    pageNum = index + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = page - 2 + index;
                  }

                  const isCurrentPage = pageNum === page;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isCurrentPage 
                          ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className={`inline-flex items-center px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200 ${
                  page >= totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                }`}
              >
                <span className="hidden sm:inline">Sau</span>
                <ChevronRight className="w-4 h-4 sm:ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;