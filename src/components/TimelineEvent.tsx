"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart, Baby, GraduationCap, Home, Star, Plane,
  Award, Camera, Briefcase, Globe, Calendar,
} from "lucide-react";
import type { FamilyEvent, FamilyMember } from "@/data/types";
import { categoryLabels, categoryColors } from "@/data/types";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart, Baby, GraduationCap, Home, Star, Plane,
  Award, Camera, Briefcase, Globe, Calendar,
};

interface Props {
  event: FamilyEvent;
  members: FamilyMember[];
  index: number;
}

export default function TimelineEvent({ event, members, index }: Props) {
  const isLeft = index % 2 === 0;
  const Icon = iconMap[event.icon] || Calendar;
  const color = categoryColors[event.category];
  const relatedMembers = members.filter((m) => event.memberIds.includes(m.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative flex items-center w-full mb-12 md:mb-16 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-row`}
    >
      {/* 时间轴圆点 */}
      <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 z-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          style={{ backgroundColor: color }}
        >
          <Icon size={18} className="text-white" />
        </div>
      </div>

      {/* 内容卡片 */}
      <div
        className={`ml-16 md:ml-0 md:w-[calc(50%-40px)] ${
          isLeft ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
        }`}
      >
        <Link href={`/event/${event.id}`} className="block group">
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-warm-100 group-hover:border-warm-200">
            {/* 年份标签 */}
            <div className={`flex items-center gap-2 mb-2 ${isLeft ? "md:justify-end" : ""}`}>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: color }}
              >
                {categoryLabels[event.category]}
              </span>
              <span className="text-xs text-warm-400">{event.date}</span>
            </div>

            {/* 标题 */}
            <h3
              className="text-lg font-bold text-warm-800 mb-2 group-hover:text-accent transition-colors"
              style={{ fontFamily: "var(--font-serif-sc)" }}
            >
              {event.title}
            </h3>

            {/* 照片预览 */}
            {event.photos.length > 0 && (
              <div className="flex gap-1.5 mb-3 overflow-hidden rounded-xl">
                {event.photos.slice(0, 3).map((url, i) => (
                  <div
                    key={url}
                    className={`relative overflow-hidden rounded-lg ${
                      event.photos.length === 1 ? "w-full h-40" : event.photos.length === 2 ? "w-1/2 h-32" : "w-1/3 h-28"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 2 && event.photos.length > 3 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium">
                        +{event.photos.length - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 描述 */}
            <p className="text-sm text-warm-600 leading-relaxed line-clamp-3 text-left">
              {event.description}
            </p>

            {/* 相关成员 */}
            {relatedMembers.length > 0 && (
              <div className={`flex items-center gap-1 mt-3 flex-wrap ${isLeft ? "md:justify-end" : ""}`}>
                {relatedMembers.map((m) => (
                  <span
                    key={m.id}
                    className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-600"
                  >
                    {m.avatar} {m.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* 占位 */}
      <div className="hidden md:block md:w-[calc(50%-40px)]" />
    </motion.div>
  );
}
