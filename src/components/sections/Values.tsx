"use client";
import { Container } from "@/components/ui/container";
import { values } from "@/data/content";
import { motion } from "framer-motion";

export default function Values() {
  // Enhanced icons array with better styling
  const icons = [
    <svg key="quality" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    <svg key="influence" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>,
    <svg key="innovation" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>,
    <svg key="sustainability" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ];

  // Color schemes for each value card
  const colorSchemes = [
    {
      gradient: "from-blue-500 to-cyan-600",
      bg: "from-blue-50 to-cyan-50",
      icon: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20",
      accent: "bg-blue-500",
      hover: "group-hover:text-blue-600"
    },
    {
      gradient: "from-emerald-500 to-teal-600", 
      bg: "from-emerald-50 to-teal-50",
      icon: "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20",
      accent: "bg-emerald-500",
      hover: "group-hover:text-emerald-600"
    },
    {
      gradient: "from-purple-500 to-pink-600",
      bg: "from-purple-50 to-pink-50", 
      icon: "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20",
      accent: "bg-purple-500",
      hover: "group-hover:text-purple-600"
    },
    {
      gradient: "from-orange-500 to-red-600",
      bg: "from-orange-50 to-red-50",
      icon: "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20", 
      accent: "bg-orange-500",
      hover: "group-hover:text-orange-600"
    }
  ];

  return (
    <section id="values" className="relative py-24">
      <Container className="relative z-10">
        {/* Enhanced Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Giá Trị Định Vị
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Những giá trị cốt lõi định hình mọi hoạt động và quyết định của chúng tôi
          </p>
          
          {/* Decorative Line */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-8 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full"
          />
        </motion.div>
        
        {/* Enhanced Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => {
            const colors = colorSchemes[index];
            
            return (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Gradient Top Bar */}
                  <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  
                  <div className="relative p-8">
                    {/* Enhanced Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${colors.icon} flex items-center justify-center mb-6 shadow-sm transition-all duration-300`}>
                      {icons[index]}
                    </div>
                    
                    {/* Content */}
                    <h3 className={`text-xl font-bold text-gray-900 mb-4 ${colors.hover} transition-colors duration-300`}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.desc}
                    </p>
                    
                    {/* Enhanced Number Badge */}
                    <div className="absolute top-6 right-6">
                      <div className={`w-8 h-8 rounded-xl ${colors.accent} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Accent */}
                  <div className={`h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Enhanced Decorative Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
