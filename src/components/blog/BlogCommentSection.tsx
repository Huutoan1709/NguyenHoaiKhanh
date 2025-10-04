"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BlogCommentSectionProps {
  postId: string;
}

export default function BlogCommentSection({ postId }: BlogCommentSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Đây chỉ là phần UI, bạn sẽ cần triển khai API xử lý comment sau
    setLoading(true);
    
    try {
      // Giả lập gửi comment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setName("");
      setEmail("");
      setComment("");
      setError(null);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bình luận</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Để lại bình luận</h3>
        
        {success && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
            Cảm ơn bạn đã gửi bình luận. Bình luận sẽ được hiển thị sau khi được phê duyệt.
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên của bạn <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Bình luận <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Nhập bình luận của bạn"
              className="h-32"
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi bình luận"}
          </Button>
        </form>
      </div>
      
      {/* Phần này sẽ hiển thị danh sách bình luận, bạn sẽ cần triển khai sau */}
      <div className="space-y-4">
        <p className="text-gray-500 text-center">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </p>
      </div>
    </div>
  );
}