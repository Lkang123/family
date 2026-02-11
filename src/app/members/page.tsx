"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import membersData from "@/data/members.json";
import eventsData from "@/data/events.json";
import type { FamilyMember, FamilyEvent } from "@/data/types";
import { Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

const members = membersData as FamilyMember[];
const events = eventsData as FamilyEvent[];

function getAge(birthday: string) {
  const birth = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function getMemberEvents(memberId: string) {
  return events.filter((e) => e.memberIds.includes(memberId));
}

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-12">
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
            我们的家人
          </h1>
          <p className="text-warm-500">每一位家人，都是故事里不可缺少的主角</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, i) => {
            const memberEvents = getMemberEvents(member.id);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100 hover:shadow-md hover:border-warm-200 transition-all group"
              >
                {/* 头像 */}
                <div className="flex items-center gap-4 mb-4">
                  {member.photo ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: member.color }}>
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner"
                      style={{ backgroundColor: member.color + "20" }}
                    >
                      {member.avatar}
                    </div>
                  )}
                  <div>
                    <h2
                      className="text-xl font-bold text-warm-800"
                      style={{ fontFamily: "var(--font-serif-sc)" }}
                    >
                      {member.name}
                    </h2>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.relation}
                    </span>
                  </div>
                </div>

                {/* 信息 */}
                <div className="flex items-center gap-2 text-sm text-warm-500 mb-3">
                  <Calendar size={14} />
                  <span>{member.birthday}</span>
                  <span className="text-warm-300">·</span>
                  <span>{getAge(member.birthday)} 岁</span>
                </div>

                {/* 简介 */}
                <p className="text-sm text-warm-600 leading-relaxed mb-4">
                  {member.bio}
                </p>

                {/* 相关事件 */}
                <div className="border-t border-warm-100 pt-3">
                  <div className="flex items-center gap-1 text-xs text-warm-400 mb-2">
                    <BookOpen size={12} />
                    <span>参与了 {memberEvents.length} 个故事</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {memberEvents.slice(0, 3).map((evt) => (
                      <Link
                        key={evt.id}
                        href={`/event/${evt.id}`}
                        className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-600 hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        {evt.title}
                      </Link>
                    ))}
                    {memberEvents.length > 3 && (
                      <span className="text-xs text-warm-400 px-1">
                        +{memberEvents.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
