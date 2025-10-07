"use client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Send,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung tin nhắn';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Tin nhắn phải có ít nhất 10 ký tự';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Tin nhắn không được vượt quá 1000 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Cảm ơn bạn đã liên hệ! Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi trong vòng 24-48 giờ làm việc.'
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
        
        // Auto hide success message after 8 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 8000);
        
      } else {
        throw new Error(result.error || 'Có lỗi xảy ra khi gửi tin nhắn');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối mạng và thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear submit status when user starts typing again
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Enhanced Background with Image */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/i6.jpg"
            alt=""
            fill
            className="object-cover object-top-right"
            priority
          />
        </div>
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/85 to-gray-900/50"></div>
        
        {/* Floating Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Container className="relative z-10">
        {/* Enhanced Section Header */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Liên Hệ Với Chúng Tôi
          </h2>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Hãy liên hệ để trao đổi về cơ hội hợp tác, tham vấn dự án hoặc đơn giản là trò chuyện về các ý tưởng mới.
          </p>
          
          {/* Decorative Line */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-8 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent rounded-full"
          />
        </motion.div>
        
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Enhanced Contact Info Column */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              {/* Gradient Top Bar */}
              <div className="h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-cyan-500"></div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-8 text-white">Thông Tin Liên Lạc</h3>
                
                <div className="space-y-8">
                  {/* Email */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="group flex items-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary-500/20 to-blue-500/20 border border-primary-400/30 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Email</div>
                      <a 
                        href="mailto:followvandai@gmail.com" 
                        className="text-white font-semibold hover:text-primary-400 transition-colors duration-300"
                      >
                        followvandai@gmail.com
                      </a>
                    </div>
                  </motion.div>
                  
                  {/* Phone */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="group flex items-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Điện thoại</div>
                      <a 
                        href="tel:+84961625353" 
                        className="text-white font-semibold hover:text-emerald-400 transition-colors duration-300"
                      >
                        (+84) 961 625 353
                      </a>
                    </div>
                  </motion.div>
                  
                  {/* Address */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="group flex items-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Địa chỉ</div>
                      <div className="text-white font-medium leading-relaxed">
                        Gia Trị, Xã Hoài Ân,<br />
                        Tỉnh Gia Lai, Việt Nam
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Social Links */}
                <div className="mt-10 pt-8 border-t border-white/20">
                  <h4 className="text-lg font-semibold mb-4 text-white">Kết Nối Với Chúng Tôi</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="https://www.facebook.com/hesinhthaivandai?locale=vi_VN" 
                      className="group w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 flex items-center justify-center hover:scale-110 transition-all duration-300"
                      aria-label="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    
                    <a 
                      href="https://www.vandai.vn/" 
                      className="group w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 flex items-center justify-center hover:scale-110 transition-all duration-300"
                      aria-label="Website"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Form Column */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
              {/* Gradient Top Bar */}
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"></div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-8 text-white">Gửi Tin Nhắn</h3>
                
                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-8 p-6 rounded-2xl border backdrop-blur-sm shadow-lg ${
                        submitStatus.type === 'success' 
                          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100' 
                          : 'bg-red-500/20 border-red-400/40 text-red-100'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 p-2 rounded-full ${
                          submitStatus.type === 'success' 
                            ? 'bg-emerald-500/30' 
                            : 'bg-red-500/30'
                        }`}>
                          {submitStatus.type === 'success' ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <AlertCircle className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">
                            {submitStatus.type === 'success' ? 'Gửi thành công!' : 'Có lỗi xảy ra'}
                          </h4>
                          <p className="text-sm leading-relaxed opacity-90">
                            {submitStatus.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="name">
                        Họ và tên *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nhập họ tên của bạn"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 rounded-xl backdrop-blur-sm transition-all duration-200 ${
                          errors.name ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' : ''
                        }`}
                        disabled={isSubmitting}
                        required
                      />
                      {errors.name && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-300 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="email">
                        Email *
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 rounded-xl backdrop-blur-sm transition-all duration-200 ${
                          errors.email ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' : ''
                        }`}
                        disabled={isSubmitting}
                        required
                      />
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-300 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="phone">
                        Số điện thoại
                      </label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="0961 625 353"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 rounded-xl backdrop-blur-sm transition-all duration-200"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="subject">
                        Chủ đề
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Chủ đề tin nhắn"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 rounded-xl backdrop-blur-sm transition-all duration-200"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="message">
                      Nội dung tin nhắn *
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        ({formData.message.length}/1000)
                      </span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Nhập nội dung tin nhắn của bạn ở đây..."
                      className={`h-40 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 rounded-xl backdrop-blur-sm resize-none transition-all duration-200 ${
                        errors.message ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' : ''
                      }`}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      maxLength={1000}
                      required
                    />
                    {errors.message && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-300 flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </motion.p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Đang gửi tin nhắn...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 w-5 h-5" />
                          Gửi tin nhắn
                        </>
                      )}
                    </Button>
                    
                    <div className="text-right">
                      <span className="text-sm text-gray-300 block">
                        Phản hồi trong 24-48h
                      </span>
                      <span className="text-xs text-gray-400">
                        Thời gian làm việc
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center pt-4 border-t border-white/20">
                    <p className="text-sm text-gray-300">
                      Bằng việc gửi tin nhắn, bạn đồng ý với việc chúng tôi lưu trữ và xử lý thông tin của bạn để phản hồi yêu cầu.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
