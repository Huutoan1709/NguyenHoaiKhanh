"use client";
import { Container } from "@/components/ui/container";
import { profile } from "@/data/content";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Overview() {
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  
  const toggleBlock = (index: number) => {
    setActiveBlock(activeBlock === index ? null : index);
  };

  const cardsData = [
    {
      title: "Vai trò chính",
      items: profile.roles,
      color: "blue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: "Các vai trò và trách nhiệm chính trong hoạt động nghề nghiệp"
    },
    {
      title: "Học vấn",
      items: profile.education,
      color: "emerald",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 14l9-5-9-5-9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      description: "Các bằng cấp, chứng chỉ và thành tựu học thuật"
    },
    {
      title: "Thành viên tổ chức",
      items: profile.memberships,
      color: "purple",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "Tham gia các tổ chức, hiệp hội và cộng đồng chuyên môn"
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: {
        bg: isActive ? 'from-blue-50 to-blue-50/20' : '',
        icon: isActive ? 'bg-blue-500/20 text-blue-600' : 'bg-blue-500/10 text-blue-600',
        badge: 'bg-blue-50 text-blue-700',
        ring: 'ring-blue-200',
        border: 'border-blue-100',
        number: 'bg-blue-100 text-blue-700'
      },
      emerald: {
        bg: isActive ? 'from-emerald-50 to-emerald-50/20' : '',
        icon: isActive ? 'bg-emerald-500/20 text-emerald-600' : 'bg-emerald-500/10 text-emerald-600',
        badge: 'bg-emerald-50 text-emerald-700',
        ring: 'ring-emerald-200',
        border: 'border-emerald-100',
        number: 'bg-emerald-100 text-emerald-700'
      },
      purple: {
        bg: isActive ? 'from-purple-50 to-purple-50/20' : '',
        icon: isActive ? 'bg-purple-500/20 text-purple-600' : 'bg-purple-500/10 text-purple-600',
        badge: 'bg-purple-50 text-purple-700',
        ring: 'ring-purple-200',
        border: 'border-purple-100',
        number: 'bg-purple-100 text-purple-700'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section id="overview" className="relative py-24">
      <Container className="relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Thông Tin Tổng Quan
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá các thông tin chi tiết về vai trò, học vấn và thành tựu chuyên môn
          </p>
          
          {/* Decorative Line */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-8 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
          />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {cardsData.map((card, index) => {
            const colorClasses = getColorClasses(card.color, activeBlock === index);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  activeBlock === index 
                    ? `ring-2 ${colorClasses.ring} shadow-2xl` 
                    : `hover:${colorClasses.border} hover:shadow-xl`
                }`}
                onClick={() => toggleBlock(index)}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Card Header */}
                <div className="relative p-6 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${colorClasses.icon} transition-all duration-300 shadow-sm`}>
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClasses.badge}`}>
                        {card.items.length}
                      </span>
                      <motion.div
                        animate={{ rotate: activeBlock === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-1"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <AnimatePresence>
                  {activeBlock === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: { 
                          opacity: { duration: 0.3, delay: 0.1 },
                          height: { duration: 0.4 }
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { 
                          opacity: { duration: 0.2 },
                          height: { duration: 0.3 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-white/50">
                        <div className="space-y-3">
                          {card.items.map((item, itemIndex) => (
                            <motion.div
                              key={itemIndex}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 + itemIndex * 0.1 }}
                              className="flex items-start space-x-4 p-3 rounded-xl hover:bg-white/80 transition-colors duration-200"
                            >
                              <div className={`w-8 h-8 rounded-full ${colorClasses.number} flex items-center justify-center flex-shrink-0 font-semibold text-sm`}>
                                {itemIndex + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800 font-medium leading-relaxed">{item}</p>
                                {itemIndex === 0 && index === 1 && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                                    Tốt nghiệp
                                  </span>
                                )}
                                {itemIndex === 0 && index === 2 && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                    Chính thức
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Modern Decorative Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-20"
        >
          <div className="relative">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
