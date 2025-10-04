"use client";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { works } from "@/data/content";
import { motion } from "framer-motion";

export default function Works() {
  return (
    <section id="works" className="relative py-24">
      <Container className="relative z-10">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Dự án & Tác phẩm
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Những tác phẩm và dự án đã thực hiện trong hành trình phát triển
          </p>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-8 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
          />
        </motion.div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-gray-100 bg-white/80 backdrop-blur-sm rounded-3xl h-full">
              <h3 className="text-2xl font-bold text-primary-700 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                  </svg>
                </div>
                Sách & Xuất bản
              </h3>
              <ul className="space-y-4">
                {works.books.map((book, index) => (
                  <motion.li 
                    key={book}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start group"
                  >
                    <div className="mr-3 mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:scale-125 transition-transform"></div>
                    <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{book}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-gray-100 bg-white/80 backdrop-blur-sm rounded-3xl">
                <h3 className="text-2xl font-bold text-primary-700 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                    </svg>
                  </div>
                  Ứng dụng & Công nghệ
                </h3>
                <ul className="space-y-4">
                  {works.applications.map((app, index) => (
                    <motion.li 
                      key={app}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start group"
                    >
                      <div className="mr-3 mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 group-hover:scale-125 transition-transform"></div>
                      <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{app}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-gray-100 bg-white/80 backdrop-blur-sm rounded-3xl">
                <h3 className="text-2xl font-bold text-primary-700 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                    </svg>
                  </div>
                  Chiến lược & Tư vấn
                </h3>
                <ul className="space-y-4">
                  {works.strategies.map((strategy, index) => (
                    <motion.li 
                      key={strategy}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start group"
                    >
                      <div className="mr-3 mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 group-hover:scale-125 transition-transform"></div>
                      <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{strategy}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
