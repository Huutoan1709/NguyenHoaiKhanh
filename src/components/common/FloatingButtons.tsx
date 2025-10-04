"use client";

import { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingButtons() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300); // Hiện button khi cuộn xuống 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-8 z-50 flex flex-col gap-3"
        >
          {/* Zalo Button */}
          <motion.a
            href="https://zalo.me/0961625353"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 
              rounded-full shadow-lg hover:shadow-blue-500/25 hover:shadow-2xl 
              transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Chat Zalo với chúng tôi"
          >
            <div className="relative w-7 h-7 bg-white rounded-full p-1">
              <Image
                src="/images/zaloicon.png"
                alt="Zalo"
                fill
                className="object-contain"
              />
            </div>
          </motion.a>

          {/* Phone Button */}
          <motion.a
            href="tel:+84961625353"
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 
              rounded-full shadow-lg hover:shadow-green-500/25 hover:shadow-2xl 
              transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Gọi điện cho chúng tôi"
          >
            <PhoneCall className="w-6 h-6 text-white" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}