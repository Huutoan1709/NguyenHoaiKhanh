"use client"

import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { EditIcon, TrashIcon, ChevronLeft, ChevronRight, Eye, Clock, User, Calendar } from "lucide-react"
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
  viewMode?: 'table' | 'grid';
}

function StatusBadge({ value }: { value: Post["status"] }) {
  const map = {
    published: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200",
    draft: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200",
  }
  return (
    <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-semibold ${map[value]}`}>
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

// Mobile Card Component
const PostCard = ({ post, onEdit, onDelete, index, pagination }: {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  index: number;
  pagination: any;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200">
    <div className="flex gap-3">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-sm">
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 pr-2">
            {post.title}
          </h3>
          <span className="text-xs text-gray-400 font-medium flex-shrink-0">
            #{(pagination.page - 1) * pagination.limit + index + 1}
          </span>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge value={post.status} />
          {post.category && (
            <span
              className="text-xs px-2 py-1 rounded-full border"
              style={{
                backgroundColor: `${post.category.color || "#E5E7EB"}20`,
                borderColor: `${post.category.color || "#E5E7EB"}40`,
                color: post.category.color || "#374151",
              }}
            >
              {post.category.name}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{post.viewCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.updatedAt)}</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-16">{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length ? (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg"
            onClick={() => onEdit(post)}
          >
            <EditIcon className="w-3 h-3 mr-1" />
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-lg"
            onClick={() => onDelete(post.id)}
          >
            <TrashIcon className="w-3 h-3 mr-1" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const PostList = ({ posts, pagination, onPageChange, onEdit, onDelete, viewMode = 'table' }: PostListProps) => {
  const { page, totalPages, total } = pagination;

  // Mobile/Grid view
  if (viewMode === 'grid') {
    return (
      <div className="overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post, idx) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
                index={idx}
                pagination={pagination}
              />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
              <p className="text-gray-500">Bắt đầu bằng cách tạo bài viết đầu tiên của bạn.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-medium">
                <span className="hidden sm:inline">Hiển thị </span>
                <span className="font-semibold text-gray-900">{posts.length}</span>
                <span className="hidden sm:inline"> / {total} bài viết</span>
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

  // Desktop table view
  return (
    <div className="overflow-hidden">
      {/* Mobile Cards for small screens */}
      <div className="block sm:hidden p-4 space-y-4">
        {posts.map((post, idx) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            index={idx}
            pagination={pagination}
          />
        ))}

        {posts.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-500">Bắt đầu bằng cách tạo bài viết đầu tiên của bạn.</p>
          </div>
        )}
      </div>

      {/* Desktop Table for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
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

                {/* Post info with thumbnail */}
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

                {/* Category */}
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

                {/* Status */}
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
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              <span className="hidden sm:inline">Hiển thị </span>
              <span className="font-semibold text-gray-900">{posts.length}</span>
              <span className="hidden sm:inline"> / {total} bài viết</span>
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

export default PostList;