"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Phone, Tag, AlignLeft, Gift } from "lucide-react";

const CATEGORIES = ["陪伴类", "动物类", "公益类", "社区活动", "技能帮助", "心理陪伴"];

export default function NewTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", category: "陪伴类", location: "",
    date: "", maxPeople: "5", contactInfo: "", reward: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "发布失败");
      if (res.status === 401) router.push("/login");
      return;
    }
    router.push(`/tasks/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">发布有意义的事</h1>
        <p className="text-gray-500">让更多人参与进来，一起创造美好</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <AlignLeft className="w-4 h-4" /> 任务标题 *
          </label>
          <input
            required value={form.title} onChange={set("title")}
            placeholder="例：陪老人散步、喂流浪猫、图书馆整理..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" /> 分类 *
          </label>
          <select
            value={form.category} onChange={set("category")}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 bg-white"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <AlignLeft className="w-4 h-4" /> 详细描述 *
          </label>
          <textarea
            required value={form.description} onChange={set("description")}
            placeholder="描述一下这件事的意义、具体内容和注意事项..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" /> 地点 *
            </label>
            <input
              required value={form.location} onChange={set("location")}
              placeholder="例：朝阳区望京"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" /> 时间 *
            </label>
            <input
              required type="datetime-local" value={form.date} onChange={set("date")}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4" /> 人数上限
            </label>
            <input
              type="number" min="1" max="100" value={form.maxPeople} onChange={set("maxPeople")}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" /> 联系方式 *
            </label>
            <input
              required value={form.contactInfo} onChange={set("contactInfo")}
              placeholder="微信/电话"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Gift className="w-4 h-4" /> 奖励/答谢（可选）
          </label>
          <input
            value={form.reward} onChange={set("reward")}
            placeholder="例：爱心饭、感谢红包..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          {loading ? "发布中..." : "🌱 发布任务"}
        </button>
      </form>
    </div>
  );
}
