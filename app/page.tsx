"use client";
import { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import { Search, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["全部", "陪伴类", "动物类", "公益类", "社区活动", "技能帮助", "心理陪伴"];

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  maxPeople: number;
  status: string;
  author: { name: string };
  _count: { registrations: number };
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [category, setCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tasks?category=${encodeURIComponent(category)}`)
      .then(r => r.json())
      .then(data => { setTasks(Array.isArray(data) ? data : []); setLoading(false); });
  }, [category]);

  const filtered = tasks.filter(t =>
    t.title.includes(search) || t.description.includes(search) || t.location.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" /> 意义驱动型社交平台
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">在这里，总有一件值得做的事</h1>
        <p className="text-gray-500 text-lg mb-6">找到同城有意义的活动，与志同道合的人建立真实连接</p>
        <Link href="/tasks/new" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-600 transition-colors">
          <PlusCircle className="w-5 h-5" /> 发布一件有意义的事
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索任务、地点..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-400 text-gray-700"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🌱</p>
          <p className="text-lg">暂无任务，快去发布第一个吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      )}
    </div>
  );
}
