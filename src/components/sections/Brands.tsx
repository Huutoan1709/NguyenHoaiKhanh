"use client";
import { Container } from "@/components/ui/container";
import { brands } from "@/data/content";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function Brands() {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    if (brands) {
      setTotalSlides(Math.ceil(brands.length / 3));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (carouselRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - (carouselRef.current as HTMLDivElement).offsetLeft);
      setScrollLeft((carouselRef.current as HTMLDivElement).scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current as HTMLDivElement).offsetLeft;
    const walk = (x - startX) * 1.5;
    (carouselRef.current as HTMLDivElement).scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = (carouselRef.current as HTMLDivElement).clientWidth;
      const newActiveSlide = Math.round((carouselRef.current as HTMLDivElement).scrollLeft / slideWidth);
      setActiveSlide(newActiveSlide);
    }
  };

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = (carouselRef.current as HTMLDivElement).clientWidth;
      (carouselRef.current as HTMLDivElement).scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="brands" className="relative py-24">
      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Thương Hiệu Chiến Lược
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Các thương hiệu được phát triển dựa trên chiến lược và tầm nhìn dài hạn
          </p>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-8 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full"
          />
        </motion.div>
        
        {/* Rest of the component remains the same... */}
        {/* Carousel container and content unchanged */}
        <div className="relative">
          {activeSlide > 0 && (
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scrollToSlide(activeSlide - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 flex items-center justify-center text-gray-700 hover:text-primary-600 hover:bg-white transition-all duration-300"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}
          
          {activeSlide < totalSlides - 1 && (
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scrollToSlide(activeSlide + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 flex items-center justify-center text-gray-700 hover:text-primary-600 hover:bg-white transition-all duration-300"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
          
          <div 
            ref={carouselRef}
            className="overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-8 pb-4 -mx-4 px-4"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onScroll={handleScroll}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {[...Array(Math.ceil(brands.length / 3))].map((_, slideIndex) => (
              <div 
                key={`slide-${slideIndex}`} 
                className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-8 snap-center"
              >
                {brands.slice(slideIndex * 3, slideIndex * 3 + 3).map((brand, index) => (
                  <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="h-full group"
                  >
                    <div className="relative h-[300px] rounded-3xl overflow-hidden shadow-lg border border-white/50 bg-white/80 backdrop-blur-sm group cursor-pointer hover:shadow-2xl transition-all duration-500">
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500"></div>
                      
                      <div className="absolute top-6 right-6 w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-6 right-12 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                      
                      <div className="absolute inset-0 mt-2">
                        {brand.image ? (
                          <Image 
                            src={brand.image} 
                            alt={brand.name} 
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 via-blue-100 to-purple-100 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
                              <span className="text-3xl font-bold text-white">
                                {brand.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute top-4 left-4 right-4">
                        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-md mr-3">
                            <span className="text-sm font-bold text-white">
                              {brand.name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-gray-800 font-bold text-lg flex-1">{brand.name}</span>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end">
                        <div className="p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          <h4 className="text-white font-bold text-xl mb-3">{brand.name}</h4>
                          <p className="text-gray-200 text-sm leading-relaxed mb-4">{brand.desc}</p>
                          
                          <div className="flex items-center text-primary-300 text-sm font-semibold">
                            <span>Tìm hiểu thêm</span>
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center mt-8 gap-3">
            {[...Array(totalSlides)].map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeSlide === i 
                    ? 'bg-gradient-to-r from-primary-500 to-blue-600 w-8 shadow-md' 
                    : 'bg-gray-300 hover:bg-gray-400 w-3'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <div className="relative">
            <div className="w-32 h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-full"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-5 h-5 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </Container>
      
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
