"use client";

import { useState, useEffect } from "react";
import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, Eye, MessageCircle, Bookmark, Share2, User, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useSweetAlert from "@/hooks/useSweetAlert";
import BackToTop from "@/components/common/BackToTop";
import { motion } from "framer-motion";

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const { toast } = useSweetAlert();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/by-slug/${params.slug}`);
        if (!res.ok) throw new Error("Không thể tải bài viết");
        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await fetch('/api/posts/published?limit=5&sort=latest');
        if (!res.ok) throw new Error("Không thể tải bài viết mới nhất");
        const data = await res.json();
        setLatestPosts(data.items.filter((p: Post) => p.id !== post?.id));
      } catch (err) {
        console.error("Error fetching latest posts:", err);
      }
    };

    if (post) {
      fetchLatestPosts();
    }
  }, [post]);

  const calcReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / 200); // 200 từ/phút
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(post?.title || "");
    const encodedUrl = encodeURIComponent(url);

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        toast("Đã sao chép liên kết bài viết!", "success");
      } catch (error) {
        toast("Không thể sao chép liên kết!", "error");
      }
    } else {
      let shareUrl = "";
      if (platform === "facebook")
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      if (platform === "twitter")
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
      if (platform === "linkedin")
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${text}`;
      window.open(shareUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-24">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
              <Skeleton className="h-8 w-3/4 mb-6 rounded-full" />
              <Skeleton className="h-6 w-1/2 mb-8 rounded-full" />
              <Skeleton className="h-[400px] w-full mb-8 rounded-2xl" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-24 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50/70 backdrop-blur-sm rounded-3xl p-8 border border-red-200/50 shadow-lg text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: -180,
            x: [0, 40, 0],
            y: [0, -25, 0]
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-32 left-32 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full"
        />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 pt-24">
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-8"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                  <div className="p-8 pb-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Link 
                        href="/blog" 
                        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 group transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                        Quay lại Blog
                      </Link>
                    </motion.div>
                    {post.category && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex px-4 py-2 rounded-full text-sm font-bold mb-6"
                        style={{
                          backgroundColor: `${post.category.color || "#3b82f6"}15`,
                          color: post.category.color || "#3b82f6",
                          border: `1px solid ${post.category.color || "#3b82f6"}30`
                        }}
                      >
                        {post.category.name}
                      </motion.span>
                    )}
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight"
                    >
                      {post.title}
                    </motion.h1>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-100"
                    >
                      {post.author && (
                        <div className="flex items-center">
                          <div className="relative w-12 h-12 mr-4">
                            {post.author.image ? (
                              <Image
                                src={post.author.image}
                                alt={post.author.name}
                                fill
                                className="rounded-full object-cover border-2 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                                {post.author.name?.[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{post.author.name}</div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDistanceToNow(new Date(post.createdAt), {
                                addSuffix: true,
                                locale: vi
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">{calcReadingTime(post.content)} phút đọc</span>
                        </span>
                        <span className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold">{post.viewCount || 0} lượt xem</span>
                        </span>
                        <span className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">{post._count?.comments || 0} bình luận</span>
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  {post.featuredImage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="relative aspect-video mx-8 mt-8 rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </motion.div>
                  )}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="p-8"
                  >
                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded">
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                  </motion.div>
                  {post.tags && post.tags.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="px-8 pb-8"
                    >
                      <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                            >
                              <Link
                                href={`/blog?tag=${tag}`}
                                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 text-gray-700 hover:text-blue-700 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
                              >
                                #{tag}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.article>
              <motion.aside 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:col-span-4 space-y-8"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Bài viết mới nhất
                    </h3>
                    <Link 
                      href="/blog" 
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Xem tất cả →
                    </Link>
                  </div>
                  <div className="space-y-6">
                    {latestPosts.map((latestPost, index) => (
                      <motion.div
                        key={latestPost.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      >
                        <Link
                          href={`/blog/${latestPost.slug}`}
                          className="flex gap-4 group hover:bg-white/50 p-3 rounded-2xl transition-all duration-300"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                            {latestPost.featuredImage ? (
                              <Image
                                src={latestPost.featuredImage}
                                alt={latestPost.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-blue-100 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2 leading-tight transition-colors">
                              {latestPost.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(new Date(latestPost.createdAt), {
                                  addSuffix: true,
                                  locale: vi
                                })}
                              </span>
                              {latestPost._count?.comments && latestPost._count.comments > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {latestPost._count.comments}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-xl"
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                    <Share2 className="w-5 h-5 mr-2 text-purple-600" />
                    Chia sẻ bài viết
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare("facebook")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 shadow-lg"
                    >
                      <Share2 className="w-4 h-4" /> Facebook
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare("twitter")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 font-semibold transition-all duration-300 shadow-lg"
                    >
                      <Share2 className="w-4 h-4" /> Twitter
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 font-semibold transition-all duration-300 shadow-lg"
                    >
                      <Share2 className="w-4 h-4" /> LinkedIn
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare("copy")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                    >
                      <Share2 className="w-4 h-4" /> Copy Link
                    </motion.button>
                  </div>
                </motion.div>       
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
}
