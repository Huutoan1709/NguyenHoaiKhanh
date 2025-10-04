"use client";

import { CategoryWithStats, CategoryFormData } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { BookOpen } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryWithStats;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  onSubmit,
  isSubmitting
}: CategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
        {/* Enhanced Dialog Header */}
        <DialogHeader className="p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {category 
                  ? "Cập nhật thông tin danh mục hiện có" 
                  : "Tạo danh mục mới để phân loại bài viết"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <CategoryForm
            category={category}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}