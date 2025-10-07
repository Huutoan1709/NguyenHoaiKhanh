"use client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/content";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
  const [imagePosition, setImagePosition] = useState("70% 30%");
  const isAdmin = false;
  
  return (
    <section id="top" className="relative h-[700px] w-full pt-20">
      {/* Background image với kích thước cố định */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full scale-x-[-1]">
          <Image
            src="/images/I9.jpg"
            alt="Banner background"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent"></div>
      </div>
      
      <Container className="relative z-10 h-full flex flex-col pt-16 md:pt-20">
        <div className="inline-block mb-4 md:mb-6">
          <span className="px-4 py-1.5 text-sm font-medium text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          Người kiến tạo hệ sinh thái Vạn Đại – Metta
          </span>
        </div>
        
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-white text-shadow-lg">
            {profile.name}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-lg text-shadow-sm leading-relaxed">
          Tôi chọn sống và làm việc trong tỉnh biết. </p>
          <p className="text-lg md:text-xl text-white/90 mb-7 max-w-lg text-shadow-sm leading-relaxed">
          Mỗi sản phẩm, mỗi dự án, mỗi bước đi đều là một cách để kết nối con người – cộng đồng – hành tinh trong vòng tuần hoàn bền vững.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <Button className="px-6 py-3 h-auto text-base font-medium shadow-lg hover:shadow-xl transition-all bg-white text-gray-900 hover:bg-white/90">
              Khám phá dịch vụ
            </Button>
            <Button 
              variant="outline" 
              className="px-6 py-3 h-auto text-base font-medium border-white/30 text-white bg-white/10 backdrop-blur-sm shadow-lg hover:bg-white/20"
              onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            >
              Liên hệ tư vấn
            </Button>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-4 gap-4 pb-20">
          {[
            { number: "10+", label: "Tác phẩm & Tham luận" },
            { number: "20+", label: "Dự án cộng đồng & quốc tế" },
            { number: "5+", label: "Thương hiệu thức tỉnh" },
            { number: "1+", label: "Hệ sinh thái tuần hoàn Metta" }
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => document.getElementById("overview")?.scrollIntoView({behavior:"smooth"})}
          className="animate-bounce bg-white/10 backdrop-blur-sm p-2 w-10 h-10 ring-1 ring-white/20 shadow-lg rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}
