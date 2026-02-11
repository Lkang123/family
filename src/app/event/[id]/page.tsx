"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart, Baby, GraduationCap, Home, Star, Plane,
  Award, Camera, Briefcase, Globe, Calendar,
  ArrowLeft, ArrowRight, ChevronLeft,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import eventsData from "@/data/events.json";
import membersData from "@/data/members.json";
import type { FamilyEvent, FamilyMember } from "@/data/types";
import { categoryLabels, categoryColors } from "@/data/types";

const allEvents = (eventsData as FamilyEvent[]).sort((a, b) => a.year - b.year);
const members = membersData as FamilyMember[];

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart, Baby, GraduationCap, Home, Star, Plane,
  Award, Camera, Briefcase, Globe, Calendar,
};

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const eventIndex = allEvents.findIndex((e) => e.id === eventId);
  const event = allEvents[eventIndex];

  if (!event) {
    return (
      <div className="min-h-screen bg-warm-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <p className="text-warm-500 text-lg">找不到这个故事 😢</p>
          <Link href="/" className="text-accent hover:underline mt-4 inline-block">
            返回时光轴
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[event.icon] || Calendar;
  const color = categoryColors[event.category];
  const relatedMembers = members.filter((m) => event.memberIds.includes(m.id));
  const prevEvent = eventIndex > 0 ? allEvents[eventIndex - 1] : null;
  const nextEvent = eventIndex < allEvents.length - 1 ? allEvents[eventIndex + 1] : null;

  return (
    <div className="min-h-screen bg-warm-50">
      <Header />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* 返回 */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-accent transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          返回时光轴
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 标题区 */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-warm-100 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: color }}
              >
                <Icon size={28} className="text-white" />
              </div>
              <div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: color }}
                >
                  {categoryLabels[event.category]}
                </span>
                <p className="text-sm text-warm-400 mt-1">{event.date}</p>
              </div>
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold text-warm-900 mb-6 leading-tight"
              style={{ fontFamily: "var(--font-serif-sc)" }}
            >
              {event.title}
            </h1>

            <div className="prose prose-warm max-w-none">
              <p className="text-warm-700 text-lg leading-loose">
                {event.description}
              </p>
            </div>

            {/* 照片画廊 */}
            {event.photos.length > 0 && (
              <div className="mt-8 pt-6 border-t border-warm-100">
                <h3 className="text-sm font-medium text-warm-500 mb-3">📷 珍贵瞬间</h3>
                <div className={`grid gap-3 ${
                  event.photos.length === 1 ? "grid-cols-1" : event.photos.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
                }`}>
                  {event.photos.map((url) => (
                    <div key={url} className="relative rounded-2xl overflow-hidden bg-warm-100 aspect-[4/3]">
                      <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 相关家人 */}
            {relatedMembers.length > 0 && (
              <div className="mt-8 pt-6 border-t border-warm-100">
                <h3 className="text-sm font-medium text-warm-500 mb-3">故事中的家人</h3>
                <div className="flex flex-wrap gap-3">
                  {relatedMembers.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 bg-warm-50 rounded-xl px-4 py-2 border border-warm-100"
                    >
                      {m.photo ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-warm-200 flex-shrink-0">
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-2xl">{m.avatar}</span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-warm-800">{m.name}</p>
                        <p className="text-xs text-warm-400">{m.relation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 上一篇/下一篇 */}
          <div className="flex gap-4">
            {prevEvent ? (
              <Link
                href={`/event/${prevEvent.id}`}
                className="flex-1 group bg-white rounded-2xl p-5 shadow-sm border border-warm-100 hover:border-warm-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-warm-400 mb-1">
                  <ArrowLeft size={12} />
                  <span>上一个故事</span>
                </div>
                <p className="text-sm font-medium text-warm-700 group-hover:text-accent transition-colors truncate">
                  {prevEvent.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {nextEvent ? (
              <Link
                href={`/event/${nextEvent.id}`}
                className="flex-1 group bg-white rounded-2xl p-5 shadow-sm border border-warm-100 hover:border-warm-200 hover:shadow-md transition-all text-right"
              >
                <div className="flex items-center justify-end gap-2 text-xs text-warm-400 mb-1">
                  <span>下一个故事</span>
                  <ArrowRight size={12} />
                </div>
                <p className="text-sm font-medium text-warm-700 group-hover:text-accent transition-colors truncate">
                  {nextEvent.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
}
