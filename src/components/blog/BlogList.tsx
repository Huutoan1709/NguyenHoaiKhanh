"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, User } from "lucide-react";
import { Post } from "@/types";

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  // Tính thời gian đọc
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).filter(Boolean);
    return Math.ceil(words.length / wordsPerMinute);
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-4">
          <Image
            src="/images/empty-posts.svg" 
            alt="Không có bài viết"
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Không tìm thấy bài viết nào
        </h3>
        <p className="text-gray-500 mt-2">
          Vui lòng thử tìm kiếm với từ khóa khác hoặc xem tất cả bài viết
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article
          key={post.id} 
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <a href={`/blog/${post.slug}`} className="block">
            <div className="relative h-48 w-full">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center text-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Category badge */}
              {post.category && (
                <span
                  className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: `${post.category.color || "#3b82f6"}90`,
                    color: "#ffffff",
                  }}
                >
                  {post.category.name}
                </span>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center text-xs text-gray-500 gap-3 flex-wrap">
                {/* Author */}
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{post.author?.name}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>

                {/* Read time */}
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{calculateReadTime(post.content)} phút đọc</span>
                </div>
              </div>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}