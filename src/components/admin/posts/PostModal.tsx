"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { 
  ImageIcon, X, CalendarIcon, Clock, Hash, Link2, AlertCircle, 
  Eye, Save, ChevronLeft, Upload, Trash2, Sparkles, BookOpen,
  Tag, Globe, Zap, FileText, Target, Menu, Grid3X3
} from 'lucide-react'
import { Post, PostFormData, Category, PostStatus } from "@/types"
import dynamic from 'next/dynamic'
import Image from "next/image"
import { cn } from "@/lib/cn"

// Dynamic import for the rich text editor to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="h-48 sm:h-64 border-2 border-gray-200 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-blue-600 animate-pulse"></div>
        <p className="text-gray-600 text-sm sm:text-base">Đang tải trình soạn thảo...</p>
      </div>
    </div>
  )
})
import 'react-quill/dist/quill.snow.css'

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => Promise<void>;
  post?: Post;
  categories: Category[];
}

export default function PostModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  post,
  categories: initialCategories = [],
}: PostModalProps) {
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    slug: post?.slug || "",
    featuredImage: post?.featuredImage || "",
    status: post?.status || "draft",
    tags: post?.tags || [],
    categoryId: post?.categoryId || ""
  });
  
  const [tagInput, setTagInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mobile detection and resize handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset preview mode when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPreviewMode(false);
    }
  }, [isOpen]);
  
  // Reset form data when post changes
  useEffect(() => {
    setFormData({
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      slug: post?.slug || "",
      featuredImage: post?.featuredImage || "",
      status: post?.status || "draft",
      tags: post?.tags || [],
      categoryId: post?.categoryId || ""
    });
  }, [post]);
  
  // Calculate word count, character count and reading time
  useEffect(() => {
    // Strip HTML tags for accurate counting
    const text = formData.content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean);
    const chars = text.replace(/\s/g, '').length;
    
    setWordCount(words.length);
    setCharCount(chars);
    // Estimate reading time (avg reading speed: 200 words per minute)
    setReadTime(Math.ceil(words.length / 200));
  }, [formData.content]);

  // Enhanced Quill editor modules and formats - Responsive toolbar
  const modules = {
    toolbar: isMobile ? [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ] : [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'blockquote', 'code-block',
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("/api/posts/upload", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
  
      if (!response.ok) {
        const error = await response.json();
        
        if (response.status === 401) {
          sessionStorage.setItem('pendingUpload', 'true');
          window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(window.location.href)}`;
          return;
        }
        
        throw new Error(error.error || "Upload failed");
      }
  
      const data = await response.json();
      setFormData(prevData => ({
        ...prevData,
        featuredImage: data.url
      }));
  
      toast.success("Upload ảnh thành công");
  
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Không thể tải ảnh lên");
    } finally {
      setLoading(false);
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        })
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const generateSlug = async () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề trước");
      return;
    }
    
    const baseSlug = formData.title
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

    try {
      setFormData(prev => ({ ...prev, slug: baseSlug }));
      toast.success("Đã tạo slug từ tiêu đề");
    } catch (error) {
      console.error('Error generating slug:', error);
      toast.error('Không thể tạo slug tự động');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.slug) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      toast.success(post ? "Cập nhật bài viết thành công" : "Tạo bài viết mới thành công");
      onClose();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Mobile Image Upload Component
  const MobileImageUpload = () => (
    <div className="bg-white rounded-xl border p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-900">
        <ImageIcon size={16} className="mr-2" />
        Ảnh đại diện
      </h3>
      
      {formData.featuredImage ? (
        <div className="relative">
          <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={formData.featuredImage}
              alt="Featured"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, featuredImage: "" })}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50 flex flex-col items-center justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <Upload className="w-5 h-5 text-white" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {loading ? "Đang tải..." : "Tải ảnh lên"}
            </span>
            <span className="text-xs text-gray-500 mt-1">PNG, JPG (max 5MB)</span>
          </button>
        </div>
      )}
    </div>
  );

  // Desktop Image Upload Component (existing)
  const ImageUploadSection = () => (
    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border-2 border-blue-100/50">
      <h3 className="text-sm font-semibold mb-4 flex items-center text-gray-900">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
          <ImageIcon size={16} className="text-white" />
        </div>
        Ảnh đại diện bài viết
      </h3>
      
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {formData.featuredImage ? (
          <div className="relative group">
            <div className="w-48 h-32 rounded-xl overflow-hidden border-2 border-white shadow-lg">
              <img
                src={formData.featuredImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featuredImage: "" })}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Xóa ảnh"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-48 h-32 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50 flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  <Upload className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                {loading ? "Đang tải..." : "Tải ảnh lên"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG (max 5MB)
              </span>
            </button>
          </div>
        )}

        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-600" />
            Hướng dẫn tối ưu:
          </div>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Kích thước tối đa: <span className="font-medium">5MB</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Định dạng: <span className="font-medium">PNG, JPG, WEBP</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Kích thước khuyến nghị: <span className="font-medium">1200x630px</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Tỷ lệ khung hình: <span className="font-medium">16:9 hoặc 4:3</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Format the current date for the preview
  const formatPostDate = (dateString?: string | Date) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Toggle preview mode
  const togglePreview = () => {
    if (!formData.title || !formData.content) {
      toast.error("Vui lòng nhập tiêu đề và nội dung bài viết để xem trước");
      return;
    }
    setPreviewMode(!previewMode);
  };

  // Find category by ID
  const getCategory = () => {
    if (!formData.categoryId) return null;
    return initialCategories.find(cat => cat.id === formData.categoryId) || null;
  };

  // Enhanced Preview component for blog post
  const PostPreview = () => {
    const category = getCategory();
    
    return (
      <div className="flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        {/* Enhanced Preview Header */}
        <div className="bg-white/90 backdrop-blur-sm py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200/50 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={togglePreview}
              className="gap-1 sm:gap-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 h-8 sm:h-auto px-2 sm:px-3"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Quay lại chỉnh sửa</span>
              <span className="sm:hidden">Sửa</span>
            </Button>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Bản xem trước - một số tính năng có thể không hoạt động</span>
            <span className="sm:hidden">Xem trước</span>
          </div>
        </div>
        
        {/* Enhanced Article Preview */}
        <div className="overflow-y-auto max-h-[calc(90vh-10rem)] bg-white">
          <article className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
            {/* Featured Image */}
            {formData.featuredImage && (
              <div className="mb-6 sm:mb-12 relative h-48 sm:h-[400px] w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
                <img
                  src={formData.featuredImage}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
            
            {/* Enhanced Header */}
            <header className="mb-6 sm:mb-12">
              {/* Category */}
              {category && (
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-2 border-blue-200">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {category.name}
                  </span>
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {formData.title}
              </h1>
              
              {/* Enhanced Meta info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                  <CalendarIcon size={14} className="text-blue-600 sm:w-4 sm:h-4" />
                  <span className="font-medium">{formatPostDate()}</span>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                  <Clock size={14} className="text-green-600 sm:w-4 sm:h-4" />
                  <span className="font-medium">{readTime} phút đọc</span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                  <Hash size={14} className="text-purple-600 sm:w-4 sm:h-4" />
                  <span className="font-medium">{wordCount} từ</span>
                </div>
              </div>

              {/* Tags Preview */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                  {formData.tags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-blue-200"
                    >
                      <Tag className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            
            {/* Enhanced Content */}
            <div 
              className="prose prose-sm sm:prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-blockquote:border-l-blue-500 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
            
            {/* Enhanced Tags Section */}
            {formData.tags.length > 0 && (
              <div className="mt-8 sm:mt-16 pt-4 sm:pt-8 border-t-2 border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2 sm:mr-3">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Từ khóa bài viết
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {formData.tags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded-xl font-medium hover:from-blue-100 hover:to-indigo-100 hover:text-blue-800 transition-all duration-200 cursor-pointer text-sm sm:text-base"
                    >
                      <Hash className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "overflow-hidden p-0 gap-0",
        isMobile 
          ? "w-[95vw] h-[95vh] max-w-none rounded-lg" 
          : "sm:max-w-[1000px] max-h-[95vh] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30"
      )}>
        {previewMode ? (
          <PostPreview />
        ) : (
          <>
            {/* Mobile/Desktop Adaptive Header */}
            <DialogHeader className={cn(
              "border-b border-gray-200/50 sticky top-0 z-10",
              isMobile 
                ? "p-4 bg-white" 
                : "p-6 pb-4 bg-white/80 backdrop-blur-sm"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={cn(
                    "rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center",
                    isMobile ? "w-8 h-8" : "w-10 h-10"
                  )}>
                    <FileText className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                  </div>
                  <div>
                    <DialogTitle className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-xl")}>
                      {post ? "Sửa bài viết" : "Tạo bài viết"}
                    </DialogTitle>
                    {!isMobile && (
                      <p className="text-sm text-gray-600 mt-1">
                        {post ? "Cập nhật nội dung và thông tin bài viết" : "Viết và xuất bản bài viết mới"}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Mobile close button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className={cn(
              "overflow-y-auto",
              isMobile ? "max-h-[calc(95vh-8rem)]" : "max-h-[calc(95vh-8rem)]"
            )}>
              <div className={cn("space-y-6", isMobile ? "p-4" : "p-6 space-y-8")}>
                {/* Title & Slug Section - Mobile Optimized */}
                <div className={cn(
                  "rounded-2xl border shadow-lg",
                  isMobile 
                    ? "bg-white p-4 border-gray-200" 
                    : "bg-white/80 backdrop-blur-sm p-6 border-white/20"
                )}>
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className={cn(
                      "rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center",
                      isMobile ? "w-6 h-6" : "w-8 h-8"
                    )}>
                      <Sparkles className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
                    </div>
                    <h3 className={cn("font-semibold text-gray-900", isMobile ? "text-base" : "text-lg")}>
                      Thông tin cơ bản
                    </h3>
                  </div>

                  <div className={cn("gap-4", isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2 gap-6")}>
                    <div className="space-y-3">
                      <label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                        <span>Tiêu đề <span className="text-red-500">*</span></span>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          formData.title.length > 70 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {formData.title.length}/70
                        </span>
                      </label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Nhập tiêu đề hấp dẫn"
                        className={cn(
                          "font-medium border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200",
                          isMobile ? "h-11 text-base" : "h-12 text-lg"
                        )}
                        required
                      />
                      {formData.title.length > 70 && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                          <AlertCircle size={12} />
                          <span>Tiêu đề nên dưới 70 ký tự</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="slug" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                        <span>URL <span className="text-red-500">*</span></span>
                        <Button 
                          type="button" 
                          onClick={generateSlug} 
                          variant="ghost" 
                          size="sm"
                          className="h-6 px-2 sm:px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Tự động</span>
                        </Button>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-gray-400 text-sm font-medium bg-gray-100 rounded-xl border-2 border-gray-200",
                          isMobile ? "px-2 py-2.5" : "px-3 py-3"
                        )}>/</span>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') })}
                          placeholder="url-bai-viet"
                          className={cn(
                            "flex-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200",
                            isMobile ? "h-11" : "h-12"
                          )}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Excerpt Section - Mobile Optimized */}
                <div className={cn(
                  "rounded-2xl border shadow-lg",
                  isMobile 
                    ? "bg-white p-4 border-gray-200" 
                    : "bg-white/80 backdrop-blur-sm p-6 border-white/20"
                )}>
                  <div className="space-y-3">
                    <label htmlFor="excerpt" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Tóm tắt
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        (formData.excerpt?.length || 0) > 160 
                          ? "bg-red-100 text-red-700" 
                          : "bg-gray-100 text-gray-600"
                      )}>
                        {formData.excerpt?.length || 0}/160
                      </span>
                    </label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Tóm tắt ngắn gọn về bài viết"
                      className={cn(
                        "border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 resize-none",
                        isMobile ? "h-16" : "h-20"
                      )}
                      maxLength={160}
                    />
                  </div>
                </div>

                {/* Content Editor - Mobile Optimized */}
                <div className={cn(
                  "rounded-2xl border shadow-lg",
                  isMobile 
                    ? "bg-white p-4 border-gray-200" 
                    : "bg-white/80 backdrop-blur-sm p-6 border-white/20"
                )}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="content" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Nội dung <span className="text-red-500">*</span>
                      </label>
                      {!isMobile && (
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <Hash size={12} />
                            <span className="font-medium">{wordCount} từ</span>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="font-medium">{charCount} ký tự</span>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <Clock size={12} />
                            <span className="font-medium">{readTime} phút đọc</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        modules={modules}
                        formats={formats}
                        placeholder="Viết nội dung bài viết..."
                        className={isMobile ? "h-64 mb-12" : "h-96 mb-12"}
                      />
                    </div>
                    {/* Mobile stats */}
                    {isMobile && (
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <span>{wordCount} từ</span>
                        <span>•</span>
                        <span>{readTime} phút đọc</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Two Columns Layout - Mobile Stack */}
                <div className={cn("gap-6", isMobile ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-8")}>
                  {/* Left Column */}
                  <div className={cn("gap-6", isMobile ? "space-y-6" : "space-y-8")}>
                    {/* Image Upload - Mobile/Desktop Adaptive */}
                    {isMobile ? <MobileImageUpload /> : <ImageUploadSection />}
                    
                    {/* Category - Mobile Optimized */}
                    <div className={cn(
                      "rounded-2xl border shadow-lg",
                      isMobile 
                        ? "bg-white p-4 border-gray-200" 
                        : "bg-white/80 backdrop-blur-sm p-6 border-white/20"
                    )}>
                      <div className="space-y-4">
                        <label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <div className={cn(
                            "rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center",
                            isMobile ? "w-5 h-5" : "w-6 h-6"
                          )}>
                            <BookOpen className={cn("text-white", isMobile ? "w-2.5 h-2.5" : "w-3 h-3")} />
                          </div>
                          Danh mục
                        </label>
                        <select
                          id="category"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          className={cn(
                            "w-full px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200",
                            isMobile ? "h-11" : "h-12"
                          )}
                        >
                          <option value="">Chọn danh mục</option>
                          {initialCategories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name} {category._count?.posts ? `(${category._count.posts})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className={cn("gap-6", isMobile ? "space-y-6" : "space-y-8")}>
                    {/* Tags - Mobile Optimized */}
                    <div className={cn(
                      "rounded-2xl border shadow-lg",
                      isMobile 
                        ? "bg-white p-4 border-gray-200" 
                        : "bg-white/80 backdrop-blur-sm p-6 border-white/20"
                    )}>
                      <div className="space-y-4">
                        <label htmlFor="tags" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <div className={cn(
                              "rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center",
                              isMobile ? "w-5 h-5" : "w-6 h-6"
                            )}>
                              <Tag className={cn("text-white", isMobile ? "w-2.5 h-2.5" : "w-3 h-3")} />
                            </div>
                            Tags
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {formData.tags.length}
                          </span>
                        </label>
                        
                        <div className={cn(
                          "bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200",
                          isMobile ? "min-h-12 p-3" : "min-h-16 p-4"
                        )}>
                          {formData.tags.length === 0 ? (
                            <div className={cn(
                              "flex items-center justify-center text-xs text-gray-400",
                              isMobile ? "h-6" : "h-8"
                            )}>
                              <Tag className="w-4 h-4 mr-2" />
                              Chưa có tag
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {formData.tags.map(tag => (
                                <span
                                  key={tag}
                                  className={cn(
                                    "inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full font-medium border border-blue-200 gap-2",
                                    isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
                                  )}
                                >
                                  <Hash className="w-3 h-3" />
                                  {tag}
                                  <button 
                                    type="button" 
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-red-600 transition-colors p-0.5 hover:bg-red-100 rounded-full"
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleAddTag}
                              placeholder="Nhập tag và Enter"
                              className={cn(
                                "pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200",
                                isMobile ? "h-11" : "h-12"
                              )}
                            />
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => {
                              if (tagInput.trim()) {
                                if (!formData.tags.includes(tagInput.trim())) {
                                  setFormData({
                                    ...formData,
                                    tags: [...formData.tags, tagInput.trim()]
                                  });
                                }
                                setTagInput("");
                              }
                            }}
                            className={cn(
                              "bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl",
                              isMobile ? "h-11 px-4" : "h-12 px-6"
                            )}
                          >
                            <Tag className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Thêm tag</span>
                            </Button>
                        </div>
                      </div>
                    </div>

                    {/* Status - Mobile Optimized */}
                    <div className={cn(
                      "rounded-2xl border shadow-lg",
                      isMobile 
                        ? "bg-white p-4 border-gray-200" 
                        : "bg-white/80 backdrop-blur-sm p-6 border-white/20"
                    )}>
                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <div className={cn(
                            "rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center",
                            isMobile ? "w-5 h-5" : "w-6 h-6"
                          )}>
                            <Globe className={cn("text-white", isMobile ? "w-2.5 h-2.5" : "w-3 h-3")} />
                          </div>
                          Trạng thái
                        </label>
                        <div className={cn("gap-3", isMobile ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4")}>
                          <div
                            className={cn(
                              "border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md",
                              isMobile ? "p-3" : "p-4",
                              formData.status === 'draft' 
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            )}
                            onClick={() => setFormData({ ...formData, status: 'draft' })}
                          >
                            <div className="flex items-center mb-2">
                              <div className={cn(
                                "rounded-full mr-2 sm:mr-3",
                                isMobile ? "w-4 h-4" : "w-5 h-5",
                                formData.status === 'draft' 
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                  : 'bg-gray-300'
                              )}></div>
                              <span className={cn("font-semibold text-gray-900", isMobile ? "text-sm" : "")}>
                                Bản nháp
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Lưu nhưng chưa công khai
                            </p>
                          </div>
                          
                          <div
                            className={cn(
                              "border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md",
                              isMobile ? "p-3" : "p-4",
                              formData.status === 'published' 
                                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            )}
                            onClick={() => setFormData({ ...formData, status: 'published' })}
                          >
                            <div className="flex items-center mb-2">
                              <div className={cn(
                                "rounded-full mr-2 sm:mr-3",
                                isMobile ? "w-4 h-4" : "w-5 h-5",
                                formData.status === 'published' 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                  : 'bg-gray-300'
                              )}></div>
                              <span className={cn("font-semibold text-gray-900", isMobile ? "text-sm" : "")}>
                                Xuất bản
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Công khai ngay lập tức
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* SEO Preview - Mobile Optimized */}
                {!isMobile && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Xem trước SEO</h3>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="text-blue-600 text-lg font-medium line-clamp-1 hover:underline cursor-pointer">
                        {formData.title || "Tiêu đề bài viết sẽ hiển thị ở đây"}
                      </div>
                      <div className="text-green-600 text-sm line-clamp-1 mt-1">
                        {typeof window !== 'undefined' ? window.location.origin : "https://yourdomain.com"}/{formData.slug || "duong-dan-url-bai-viet"}
                      </div>
                      <div className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {formData.excerpt || "Mô tả ngắn gọn về bài viết sẽ xuất hiện trong kết quả tìm kiếm. Thêm mô tả để tối ưu SEO và thu hút người đọc click vào bài viết của bạn."}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - Mobile/Desktop Adaptive */}
              <div className={cn(
                "sticky bottom-0 bg-white border-t border-gray-200/50",
                isMobile ? "p-4" : "p-6 bg-white/90 backdrop-blur-sm"
              )}>
                <div className={cn(
                  "flex items-center",
                  isMobile ? "flex-col gap-3" : "justify-between"
                )}>
                  {!isMobile && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose}
                      className="px-6 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200"
                    >
                      Hủy bỏ
                    </Button>
                  )}
                  
                  <div className={cn("flex gap-3", isMobile ? "w-full" : "")}>
                    {isMobile && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        className="flex-1 h-12"
                      >
                        Hủy
                      </Button>
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={togglePreview}
                      disabled={!formData.title || !formData.content}
                      className={cn(
                        "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200 gap-2",
                        isMobile ? "flex-1 h-12" : "px-6 py-3"
                      )}
                    >
                      <Eye size={16} />
                      <span className={isMobile ? "text-sm" : ""}>
                        {isMobile ? "Xem" : "Xem trước"}
                      </span>
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className={cn(
                        "font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl gap-2",
                        isMobile ? "flex-1 h-12" : "px-8 py-3",
                        formData.status === 'published' 
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white" 
                          : "bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white"
                      )}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                          <span className="text-sm sm:text-base">
                            {isMobile ? "Đang lưu..." : "Đang xử lý..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span className="text-sm sm:text-base">
                            {isMobile 
                              ? (formData.status === 'published' ? 'Xuất bản' : 'Lưu nháp')
                              : (formData.status === 'published' 
                                  ? (post ? "Cập nhật & Xuất bản" : "Xuất bản ngay") 
                                  : (post ? "Lưu thay đổi" : "Lưu bản nháp")
                                )
                            }
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}