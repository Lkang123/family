"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("admin_auth", "true");
        router.push("/admin/dashboard");
      } else {
        setError("密码错误，请重试");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🏠</span>
          <h1
            className="text-2xl font-bold text-warm-800"
            style={{ fontFamily: "var(--font-serif-sc)" }}
          >
            时光记 · 管理后台
          </h1>
          <p className="text-warm-400 text-sm mt-2">请输入管理密码</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100">
          <div className="relative mb-4">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入管理密码"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-200 bg-warm-50 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "验证中..." : "进入后台"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-warm-300 text-xs mt-6">
          仅限管理员访问
        </p>
      </div>
    </div>
  );
}
