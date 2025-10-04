"use client"

import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { EditIcon, TrashIcon, ChevronLeft, ChevronRight, Eye, Clock } from "lucide-react"
import type { Post } from "@/types"
import React from "react"

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

function StatusBadge({ value }: { value: Post["status"] }) {
  const map = {
    published: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200",
    draft: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[value]}`}>
      {value === "published" ? "Đã xuất bản" : "Bản nháp"}
    </span>
  )
}

function formatDate(d: Date | string) {
  try {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: vi })
  } catch {
    return "-"
  }
}

const PostList = ({ posts, pagination, onPageChange, onEdit, onDelete }: PostListProps) => {
  const { page, totalPages, total } = pagination;

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
              <th className="min-w-[320px] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bài viết</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
              <th className="w-36 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
              <th className="w-28 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Lượt xem</th>
              <th className="w-32 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bình luận</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tác giả</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cập nhật</th>
              <th className="w-28 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {posts.map((post, idx) => (
              <tr key={post.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  {(pagination.page - 1) * pagination.limit + idx + 1}
                </td>

                {/* Tiêu đề + Thumbnail + Slug + Tags */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-md flex-shrink-0">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Eye className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 line-clamp-2 mb-1">{post.title}</div>
                      <div className="text-xs text-gray-500 mb-2 font-mono bg-gray-100 px-2 py-1 rounded-md inline-block">
                        /{post.slug}
                      </div>
                      {post.tags?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </td>

                {/* Danh mục */}
                <td className="px-6 py-4">
                  {post.category ? (
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{
                        backgroundColor: `${post.category.color || "#E5E7EB"}20`,
                        borderColor: `${post.category.color || "#E5E7EB"}40`,
                        color: post.category.color || "#374151",
                      }}
                      title={post.category.name}
                    >
                      {post.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs italic bg-gray-100 px-3 py-1 rounded-full">
                      Chưa gán
                    </span>
                  )}
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  <StatusBadge value={post.status} />
                </td>

                {/* Views / Comments */}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{post.viewCount ?? 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-gray-900">{post.commentCount ?? 0}</span>
                </td>

                {/* Author */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0">
                      {post.author?.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author?.name || "author"}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                          {post.author?.name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 line-clamp-1">
                      {post.author?.name || "Không xác định"}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(post.updatedAt)}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
                      onClick={() => onEdit(post)}
                      title="Chỉnh sửa"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-lg"
                      onClick={() => onDelete(post.id)}
                      title="Xóa"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {posts.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
                    <p className="text-gray-500">Bắt đầu bằng cách tạo bài viết đầu tiên của bạn.</p>
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
              Hiển thị <span className="font-semibold text-gray-900">{posts.length}</span> / {' '}
              <span className="font-semibold text-gray-900">{total}</span> bài viết
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page <= 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                }`}
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
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isCurrentPage 
                            ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                        }`}
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
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page >= totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-md'
                }`}
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

export default PostList;