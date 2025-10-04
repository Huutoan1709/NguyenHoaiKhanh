"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryWithStats, CategoryFormData } from "@/types";
import { Link2, Zap, Save, X, BookOpen, Hash, FileText } from "lucide-react";
import { cn } from "@/lib/cn";

interface CategoryFormProps {
  category?: CategoryWithStats;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
      });
    }
  }, [category]);

  const generateSlug = () => {
    if (!formData.name.trim()) return;

    const slug = formData.name
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

    setFormData(prev => ({ ...prev, slug }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên danh mục là bắt buộc";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug là bắt buộc";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CategoryFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-8">
      {/* Category Name */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <span>Tên danh mục <span className="text-red-500">*</span></span>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                formData.name.length > 50 
                  ? "bg-amber-100 text-amber-700" 
                  : "bg-gray-100 text-gray-600"
              )}>
                {formData.name.length}/50
              </span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên danh mục"
              className={cn(
                "h-12 text-lg font-medium border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200",
                errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200"
              )}
              maxLength={50}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="slug" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <span>Đường dẫn URL <span className="text-red-500">*</span></span>
              <Button 
                type="button" 
                onClick={generateSlug} 
                variant="ghost" 
                size="sm"
                className="h-6 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
              >
                <Zap className="w-3 h-3 mr-1" />
                Tự động tạo
              </Button>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium px-3 py-3 bg-gray-100 rounded-xl border-2 border-gray-200">/</span>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^\w-]/g, '');
                  setFormData(prev => ({ ...prev, slug: value }));
                  if (errors.slug) {
                    setErrors(prev => ({ ...prev, slug: undefined }));
                  }
                }}
                placeholder="duong-dan-danh-muc"
                className={cn(
                  "flex-1 h-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200",
                  errors.slug ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200"
                )}
                required
              />
            </div>
            {errors.slug && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.slug}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="space-y-3">
          <label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Mô tả danh mục
            </span>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              (formData.description?.length || 0) > 200 
                ? "bg-red-100 text-red-700" 
                : "bg-gray-100 text-gray-600"
            )}>
              {formData.description?.length || 0}/200
            </span>
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả ngắn gọn về danh mục này (tùy chọn)"
            className="h-24 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 resize-none"
            maxLength={200}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6 -mx-6 -mb-6">
        <div className="flex justify-end items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200"
          >
            Hủy bỏ
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save size={16} />
                {category ? "Cập nhật danh mục" : "Tạo danh mục"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}