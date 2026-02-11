"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { FamilyMotto } from "@/data/types";
import { Heart, BookOpen, Users, Clock } from "lucide-react";

export default function AboutPage() {
  const [mottos, setMottos] = useState<FamilyMotto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch("/api/mottos");
      if (!active) return;
      const data = await res.json();
      setMottos(data.mottos || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-warm-400 animate-pulse text-lg">加载中...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-warm-50">
      <Header />

      <section className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className="text-3xl md:text-4xl font-bold text-warm-900 mb-3"
            style={{ fontFamily: "var(--font-serif-sc)" }}
          >
            关于时光记
          </h1>
          <p className="text-warm-500">为什么我们要记录家庭的故事</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-warm-100 mb-8"
        >
          <div
            className="text-warm-700 text-lg leading-loose space-y-6"
            style={{ fontFamily: "var(--font-serif-sc)" }}
          >
            <p>
              每个家庭都有属于自己的故事。可惜的是，大多数家庭的记忆如同散落的拼图，
              随着时间推移，一块一块地消失在岁月里。
            </p>
            <p>
              爷爷年轻时的故事，奶奶做菜的秘方，爸妈相识的经过——这些珍贵的记忆，
              往往只存在于某个人的脑海中。一旦那个人不在了，故事也就永远消失了。
            </p>
            <p>
              <strong className="text-accent">「时光记」</strong>
              的初衷很简单：把这些散落的记忆碎片收集起来，
              串成一条完整的时间线，让后来的人也能感受到这个家庭的温度。
            </p>
            <p>
              这不是一个严肃的族谱，也不是冰冷的档案。这是一本有温度的家庭故事集，
              记录着每一个平凡而珍贵的瞬间。
            </p>
          </div>
        </motion.div>

        {/* 核心理念 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            {
              icon: Clock,
              title: "留住时光",
              desc: "把流逝的时间变成可以翻阅的故事",
            },
            {
              icon: Users,
              title: "连接家人",
              desc: "让每一代人都能了解家庭的来路",
            },
            {
              icon: Heart,
              title: "传递温暖",
              desc: "在平凡的日子里看到爱的痕迹",
            },
            {
              icon: BookOpen,
              title: "传承记忆",
              desc: "让故事不随时间消失，代代相传",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100"
            >
              <item.icon size={24} className="text-accent mb-3" />
              <h3
                className="font-bold text-warm-800 mb-1"
                style={{ fontFamily: "var(--font-serif-sc)" }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-warm-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 家族格言 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-warm-800 rounded-3xl p-8 md:p-12 text-center"
        >
          <h2
            className="text-xl font-bold text-warm-100 mb-6"
            style={{ fontFamily: "var(--font-serif-sc)" }}
          >
            家族格言
          </h2>
          <div className="space-y-6">
            {mottos.map((motto: FamilyMotto, i: number) => (
              <div key={i}>
                <p
                  className="text-warm-100 text-lg md:text-xl italic"
                  style={{ fontFamily: "var(--font-serif-sc)" }}
                >
                  「{motto.content}」
                </p>
                <p className="text-warm-400 text-sm mt-1">—— {motto.source}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
