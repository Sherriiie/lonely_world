"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, PlusCircle, User, LogOut, Menu, X, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
          <Heart className="w-6 h-6 fill-emerald-500 text-emerald-500" />
          <span>有事做</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm">
            发现任务
          </Link>

          {loading ? (
            <div className="w-24 h-8 bg-gray-100 rounded-full animate-pulse" />
          ) : user ? (
            <>
              <Link href="/tasks/new" className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 transition-colors text-sm">
                <PlusCircle className="w-4 h-4" /> 发布任务
              </Link>

              <Link href="/profile" className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 transition-colors px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name[0]}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-semibold">
                  <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  {user.meaningPoints}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-sm"
                title="退出登录"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-emerald-600 transition-colors text-sm">
                登录
              </Link>
              <Link href="/register" className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors text-sm font-medium">
                免费注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-2xl mb-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                {user.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  {user.meaningPoints} 意义值
                </p>
              </div>
            </div>
          )}
          <Link href="/" className="text-gray-700 py-1" onClick={() => setMenuOpen(false)}>发现任务</Link>
          {user ? (
            <>
              <Link href="/tasks/new" className="text-gray-700 py-1" onClick={() => setMenuOpen(false)}>发布任务</Link>
              <Link href="/profile" className="flex items-center gap-1 text-gray-700 py-1" onClick={() => setMenuOpen(false)}>
                <User className="w-4 h-4" /> 我的主页
              </Link>
              <button onClick={handleLogout} className="text-left text-red-500 py-1 flex items-center gap-1">
                <LogOut className="w-4 h-4" /> 退出登录
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 py-1" onClick={() => setMenuOpen(false)}>登录</Link>
              <Link href="/register" className="text-emerald-600 font-medium py-1" onClick={() => setMenuOpen(false)}>免费注册</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
