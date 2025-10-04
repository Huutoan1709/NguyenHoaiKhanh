"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui/container";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Post } from "@/types";

export default function BlogPreview() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const latestPosts = allPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).filter(Boolean);
    return Math.ceil(words.length / wordsPerMinute);
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts/published?limit=6');
        if (!res.ok) throw new Error('Failed to fetch posts');
        
        const data = await res.json();
        
        if (data.items && Array.isArray(data.items)) {
          setAllPosts(data.items);
        } else {
          throw new Error('Invalid data format');
        }
        
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError(error instanceof Error ? error.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="relative py-24">
      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-lg"
          >
            <BookOpen className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6"
          >
            Bài viết & Tin tức
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Khám phá những bài viết sâu sắc và chia sẻ kinh nghiệm
          </motion.p>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-8 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
          />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="animate-pulse"
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg">
                  <div className="bg-gray-200 rounded-2xl h-48 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-3 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 max-w-md mx-auto">
              <div className="text-red-500 text-lg font-semibold">{error}</div>
            </div>
          </motion.div>
        ) : latestPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {latestPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group h-full"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <article className="relative h-full bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600" />

                      <div className="relative h-48 overflow-hidden">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-blue-100 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                              <BookOpen className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        )}

                        {post.category && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full text-white backdrop-blur-sm border border-white/20"
                            style={{
                              backgroundColor: `${post.category.color || "#3b82f6"}CC`,
                            }}
                          >
                            {post.category.name}
                          </motion.span>
                        )}

                        <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <div className="flex items-center text-white text-xs font-semibold">
                            <Clock size={12} className="mr-1" />
                            {calculateReadTime(post.content)} phút
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
                          {post.excerpt || "Khám phá nội dung thú vị trong bài viết này..."}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <User size={12} className="mr-1" />
                              <span className="font-medium">{post.author?.name || "Admin"}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar size={12} className="mr-1" />
                              <span>
                                {formatDistanceToNow(new Date(post.createdAt), {
                                  addSuffix: true,
                                  locale: vi,
                                })}
                              </span>
                            </div>
                          </div>
                          
                          <motion.div
                            whileHover={{ x: 4 }}
                            className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:shadow-lg transition-shadow"
                          >
                            <ArrowRight size={12} className="text-white" />
                          </motion.div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {allPosts.length > 4 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <Link href="/blog">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <span>Xem tất cả {allPosts.length} bài viết</span>
                    <ArrowRight size={20} className="ml-2" />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-12 max-w-md mx-auto shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 text-lg font-medium">Chưa có bài viết nào</div>
              <p className="text-gray-400 text-sm mt-2">Hãy quay lại sau để đọc những bài viết mới nhất</p>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-20"
        >
          <div className="relative">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}