"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { FamilyMotto } from "@/data/types";

export default function HeroSection() {
  const [motto, setMotto] = useState<FamilyMotto | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch("/api/mottos");
      if (!active) return;
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.mottos || [];
      if (arr.length) setMotto(arr[0]);
    })();
    return () => { active = false; };
  }, []);

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 md:py-32">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-0 w-48 md:w-64 h-48 md:h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-4 right-0 w-56 md:w-80 h-56 md:h-80 bg-warm-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-warm-400 text-xs sm:text-sm tracking-widest mb-3 md:mb-4">记录 · 传承 · 温暖</p>
          <h1
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-warm-900 mb-4 md:mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif-sc)" }}
          >
            我们家的
            <span className="text-accent">时光故事</span>
          </h1>
          <p className="text-warm-500 text-base sm:text-lg md:text-xl leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto">
            从1970年爷爷奶奶的相遇，到今天的我们。
            <br />
            每一个平凡的日子，都是家的温度。
          </p>
        </motion.div>

        {motto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-3 md:px-8 md:py-4 border border-warm-200"
          >
            <p
              className="text-warm-700 text-base sm:text-lg md:text-xl italic"
              style={{ fontFamily: "var(--font-serif-sc)" }}
            >
              「{motto.content}」
            </p>
            <p className="text-warm-400 text-xs sm:text-sm mt-1">—— {motto.source}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 md:mt-12 flex justify-center"
        >
          <div className="flex flex-col items-center gap-1 text-warm-400 animate-bounce">
            <span className="text-xs">向下滚动，开始时光之旅</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
