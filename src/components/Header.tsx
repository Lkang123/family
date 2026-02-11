"use client";

import Link from "next/link";
import { BookOpen, Users, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "时光轴", icon: Home },
  { href: "/members", label: "家人", icon: Users },
  { href: "/about", label: "关于", icon: BookOpen },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      {/* 桌面端顶部导航 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-warm-50/80 border-b border-warm-200">
        <div className="max-w-5xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl">🏠</span>
            <span className="font-bold text-base md:text-lg text-warm-800 group-hover:text-accent transition-colors"
                  style={{ fontFamily: "var(--font-serif-sc)" }}>
              时光记
            </span>
          </Link>
          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-warm-600 hover:text-warm-800 hover:bg-warm-100"
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 移动端底部导航栏 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-warm-50/90 backdrop-blur-lg border-t border-warm-200"
           style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                  isActive ? "text-accent" : "text-warm-400 active:text-warm-600"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] ${isActive ? "font-semibold" : ""}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
