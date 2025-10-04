"use client";

import { Container } from "@/components/ui/container";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { JSX } from "react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-500/8 to-cyan-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-16">
        <Container>
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Section - Simplified */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                  <Image 
                    src="/images/LOGO.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-white">
                  Nguyễn Hoài Khánh
                </h3>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Người kiến tạo hệ sinh thái Vạn Đại – Metta. Sống và làm việc trong tinh thần 
                <span className="text-blue-300"> "Cái biết cũng là duyên"</span>.
              </p>
              
{/* Mission Statement */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-sm text-gray-200 italic">
                "Kết nối con người – cộng đồng – hành tinh trong một vòng tuần hoàn bền vững"
                </p>
              </div>
            </motion.div>
            
            {/* Quick Links - Clean */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-semibold text-white mb-6">Liên kết nhanh</h4>
              
              <ul className="space-y-3">
                {[
                  { title: "Giới thiệu", id: "#overview" },
                  { title: "Sáng lập", id: "#founder" },
                  { title: "Thương hiệu", id: "#brands" },
                  { title: "Bài viết & Tin tức", href: "/blog" }
                ].map((link, index) => (
                  <motion.li 
                    key={link.id || link.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    {link.href ? (
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.title}
                      </Link>
                    ) : (
                      <a 
                        href={link.id}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          document.querySelector(link.id!)?.scrollIntoView({behavior: "smooth"});
                        }}
                      >
                        {link.title}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Contact Info - Minimal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-semibold text-white mb-6">Thông tin liên hệ</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a href="mailto:followvandai@gmail.com" className="text-sm text-gray-300 hover:text-white transition-colors">
                      followvandai@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Điện thoại</p>
                    <a href="tel:+84961625353" className="text-sm text-gray-300 hover:text-white transition-colors">
                      (+84) 961 625 353
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                    <p className="text-sm text-gray-300">
                      Xã Hoài Ân, Tỉnh Gia Lai, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Social & Newsletter - Simplified */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-semibold text-white mb-6">Kết nối</h4>
              
              {/* Social Links - Clean */}
              <div className="flex gap-3 mb-8">
                <SocialLink 
                  href="https://www.facebook.com/hesinhthaivandai?locale=vi_VN" 
                  icon="facebook" 
                  label="Facebook"
                />
                <SocialLink 
                  href="#" 
                  icon="twitter" 
                  label="Twitter"
                />
                <SocialLink 
                  href="#" 
                  icon="instagram" 
                  label="Instagram"
                />
                <SocialLink 
                  href="#" 
                  icon="linkedin" 
                  label="LinkedIn"
                />
              </div>
              
              
              {/* Simple Newsletter */}
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-gray-400 mb-3">Nhận thông tin mới nhất</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Email của bạn..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Footer Bottom - Clean */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Nguyễn Hoài Khánh. Tất cả quyền được bảo lưu.</p>
              
              <div className="flex items-center gap-2">
                <span>Thiết kế bởi</span>
                <p className="text-gray-400 hover:text-white font-medium transition-colors">
                  Nguyễn Hữu Toàn
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>
    </footer>
  );
}

// Simplified Social Link Component
type IconType = 'facebook' | 'twitter' | 'instagram' | 'linkedin';

interface SocialLinkProps {
  href: string;
  icon: IconType;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  const icons: Record<IconType, JSX.Element> = {
    facebook: <Facebook className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
  };

  const colors: Record<IconType, string> = {
    facebook: 'bg-blue-600 hover:bg-blue-700',
    twitter: 'bg-sky-500 hover:bg-sky-600',
    instagram: 'bg-pink-500 hover:bg-pink-600',
    linkedin: 'bg-blue-700 hover:bg-blue-800',
  };

  return (
    <motion.a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-9 h-9 rounded-lg ${colors[icon]} flex items-center justify-center text-white transition-colors`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      {icons[icon]}
    </motion.a>
  );
}
