"use client";
import Hero from "@/components/sections/Hero";
import Overview from "@/components/sections/Overview";
import Brands from "@/components/sections/Brands";
import Values from "@/components/sections/Values";
import Contact from "@/components/sections/Contact";
import Founder from "@/components/sections/Founder";
import BlogPreview from "@/components/sections/BlogPreview";
import FloatingButtons from "@/components/common/FloatingButtons";
import BackToTop from "@/components/common/BackToTop";


export default function Page() {
  return (
    <>
      <Hero />
      <Overview />
      <Founder />
      <BlogPreview/>
      <Values />
      <Contact />
      <FloatingButtons />
      <BackToTop />
    </>
  );
}
