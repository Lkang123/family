import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 py-6 md:py-8 mt-8 md:mt-16 mb-16 md:mb-0">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-warm-400 text-xs md:text-sm flex items-center justify-center gap-1">
          用 <Heart size={14} className="text-accent fill-accent" /> 记录家的每一刻
        </p>
        <p className="text-warm-300 text-xs mt-1.5 md:mt-2">
          家庭年鉴 · 时光记 © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
