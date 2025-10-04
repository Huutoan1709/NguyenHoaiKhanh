"use client";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import { laos } from "@/data/content";
import { motion } from "framer-motion";

export default function Founder() {
  return (
    <section id="founder" className="relative py-24">
      <Container className="relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-indigo-600 mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
            Nhà Sáng Lập
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Người sáng lập Vạn Đại - Metta và triết lý LAOS
          </p>
          
          {/* Decorative Line */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-6 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Company Section - Enhanced Design */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            {/* Gradient Top Bar */}
            <div className="h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-indigo-500"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-12 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            
            <div className="p-8">
              {/* Company Identity */}
              <div className="flex items-start gap-6 mb-8">
                {/* Enhanced Logo */}
                <div className="relative">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-4 ring-white">
                    <Image 
                      src="/images/LOGO.png" 
                      alt="Logo Vạn Đại" 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 border-3 border-white flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                {/* Company Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    Công ty TNHH Sản Xuất và Dịch Vụ Vạn Đại
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <svg className="h-4 w-4 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Thành lập 17/10/2023
                    </div>
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Đang hoạt động
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Company Description */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50">
                <p className="text-gray-700 leading-relaxed">
                  Doanh nghiệp tiên phong trong lĩnh vực sản xuất và phân phối thực phẩm, 
                  ứng dụng công nghệ và phương pháp nông nghiệp tuần hoàn, hướng đến 
                  sự phát triển cộng đồng và bảo vệ môi trường.
                </p>
              </div>
              
              {/* Enhanced Info Cards */}
              <div className="grid grid-cols-1 gap-4">
                {/* Business Areas */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-4 border border-primary-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Ngành nghề kinh doanh
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      Chế biến rau củ quả
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Sản xuất thực phẩm
                    </span>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      followvandai@gmail.com
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      MST: 4101634095
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Footer */}
            <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                © Vạn Đại 2023-2025
              </span>
              <a 
                href="https://www.vandai.vn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Trang web công ty
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
          
          {/* LAOS Philosophy - Enhanced Design */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            {/* Gradient Top Bar */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-12 w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-500"></div>
            
            <div className="p-8">
              {/* Philosophy Header */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
                  <span className="font-bold text-white text-lg">L</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    Triết lý LAOS
                  </h3>
                  <p className="text-sm text-gray-500">Living Awareness Operating System</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-gray-700 leading-relaxed">
                  LAOS – Living Awareness Operating System là hệ điều hành tỉnh biết, do tôi phát triển, đặt nền tảng cho quản trị bản thân, tổ chức và cộng đồng. Bốn giá trị cốt lõi: Sự sống – Vận hành – Kết nối – Hiện sinh
                </p>
              </div>
              
              {/* LAOS Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {laos.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-sm font-bold text-white">{item.title[0]}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{item.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Footer */}
            <div className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100 text-center">
              <a 
                href="blog/triet-ly-laos-living-awareness-operating-system"
                className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Tìm hiểu thêm về LAOS
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced Decorative Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <div className="relative">
            <div className="w-40 h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500 rounded-full"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-5 h-5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}