"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    await refresh(); // 刷新全局登录状态
    router.push("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 fill-emerald-500 text-emerald-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">加入有事做</h1>
          <p className="text-gray-500 text-sm mt-1">开始你的意义之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "昵称", key: "name", type: "text", placeholder: "你的名字" },
            { label: "邮箱", key: "email", type: "email", placeholder: "your@email.com" },
            { label: "密码", key: "password", type: "password", placeholder: "至少6个字符" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                type={type} required value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                minLength={key === "password" ? 6 : 1}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 text-gray-700"
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {loading ? "注册中..." : "免费注册"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          已有账号？{" "}
          <Link href="/login" className="text-emerald-600 font-medium hover:underline">立即登录</Link>
        </p>
      </div>
    </div>
  );
}
