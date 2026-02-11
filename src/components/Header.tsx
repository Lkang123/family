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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-warm-50/80 border-b border-warm-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-lg text-warm-800 group-hover:text-accent transition-colors"
                style={{ fontFamily: "var(--font-serif-sc)" }}>
            时光记
          </span>
        </Link>
        <nav className="flex items-center gap-1">
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
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
