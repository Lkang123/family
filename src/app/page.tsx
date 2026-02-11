"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TimelineEvent from "@/components/TimelineEvent";
import YearDivider from "@/components/YearDivider";
import Footer from "@/components/Footer";
import type { FamilyEvent, FamilyMember } from "@/data/types";

// 按年份分组
function groupByYear(events: FamilyEvent[]) {
  const sorted = [...events].sort((a, b) => a.year - b.year);
  const groups: { year: number; events: FamilyEvent[] }[] = [];
  let currentYear = -1;

  for (const evt of sorted) {
    if (evt.year !== currentYear) {
      groups.push({ year: evt.year, events: [evt] });
      currentYear = evt.year;
    } else {
      groups[groups.length - 1].events.push(evt);
    }
  }
  return groups;
}

export default function Home() {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const [evtRes, memRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/members"),
      ]);
      if (!active) return;
      setEvents(await evtRes.json());
      setMembers(await memRes.json());
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

  const yearGroups = groupByYear(events);
  let eventIndex = 0;

  return (
    <div className="min-h-screen bg-warm-50">
      <Header />
      <HeroSection />

      {/* 时间轴 */}
      <section className="relative max-w-5xl mx-auto px-4 pb-16">
        <div className="timeline-line" />

        {yearGroups.map((group) => (
          <div key={group.year}>
            <YearDivider year={group.year} />
            {group.events.map((event) => {
              const idx = eventIndex++;
              return (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  members={members}
                  index={idx}
                />
              );
            })}
          </div>
        ))}

        {/* 时间轴终点 */}
        <div className="relative flex justify-center mt-8">
          <div className="bg-accent text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg z-10">
            故事还在继续...
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
