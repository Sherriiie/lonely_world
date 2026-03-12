"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Phone, ArrowLeft, Send, Gift, CheckCircle } from "lucide-react";

interface Task {
  id: string; title: string; description: string; category: string;
  location: string; date: string; maxPeople: number; contactInfo: string;
  reward: string | null; status: string;
  author: { id: string; name: string; bio: string | null };
  registrations: { user: { id: string; name: string } }[];
  messages: { id: string; content: string; createdAt: string; sender: { id: string; name: string } }[];
  _count: { registrations: number };
}

const categoryColors: Record<string, string> = {
  陪伴类: "bg-pink-100 text-pink-700", 动物类: "bg-orange-100 text-orange-700",
  公益类: "bg-blue-100 text-blue-700", 社区活动: "bg-purple-100 text-purple-700",
  技能帮助: "bg-yellow-100 text-yellow-700", 心理陪伴: "bg-teal-100 text-teal-700",
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [me, setMe] = useState<{ id: string } | null>(null);
  const [msg, setMsg] = useState("");
  const [registering, setRegistering] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [registered, setRegistered] = useState(false);

  const loadTask = () =>
    fetch(`/api/tasks/${id}`).then(r => r.json()).then(setTask);

  useEffect(() => {
    loadTask();
    fetch("/api/auth/me").then(r => r.json()).then(d => setMe(d.user));
  }, [id]);

  useEffect(() => {
    if (task && me) {
      setRegistered(task.registrations.some(r => r.user.id === me.id));
    }
  }, [task, me]);

  const handleRegister = async () => {
    if (!me) { router.push("/login"); return; }
    setRegistering(true); setFeedback("");
    const res = await fetch(`/api/tasks/${id}/register`, { method: "POST" });
    const data = await res.json();
    setRegistering(false);
    if (!res.ok) { setFeedback(data.error); return; }
    setFeedback("报名成功！🎉 +10 意义值"); setRegistered(true);
    loadTask();
  };

  const handleSendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) { router.push("/login"); return; }
    if (!msg.trim()) return;
    setSending(true);
    const res = await fetch(`/api/tasks/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: msg }),
    });
    setSending(false);
    if (res.ok) { setMsg(""); loadTask(); }
  };

  if (!task) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;

  const isFull = task.status === "full" || task._count.registrations >= task.maxPeople;
  const isAuthor = me?.id === task.author.id;
  const colorClass = categoryColors[task.category] || "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${colorClass}`}>{task.category}</span>
              {isFull && <span className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full">已满员</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{task.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" />{task.location}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" />{new Date(task.date).toLocaleString("zh-CN")}</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-500" />{task._count.registrations}/{task.maxPeople} 人已报名</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" />{task.contactInfo}</span>
            </div>
            {task.reward && (
              <div className="mt-4 flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-sm">
                <Gift className="w-4 h-4" /> 奖励：{task.reward}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">任务讨论 ({task.messages.length})</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {task.messages.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">暂无留言，来第一个发言吧！</p>
              ) : task.messages.map(m => (
                <div key={m.id} className={`flex gap-3 ${m.sender.id === me?.id ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-medium shrink-0">
                    {m.sender.name[0]}
                  </div>
                  <div className={`max-w-xs ${m.sender.id === me?.id ? "items-end" : "items-start"} flex flex-col`}>
                    <span className="text-xs text-gray-400 mb-1">{m.sender.name}</span>
                    <div className={`px-3 py-2 rounded-2xl text-sm ${m.sender.id === me?.id ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700"}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMsg} className="flex gap-2">
              <input
                value={msg} onChange={e => setMsg(e.target.value)}
                placeholder={me ? "说点什么..." : "登录后留言"}
                disabled={!me}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 text-sm disabled:bg-gray-50"
              />
              <button type="submit" disabled={sending || !me} className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Register */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>报名进度</span>
                <span>{task._count.registrations}/{task.maxPeople}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (task._count.registrations / task.maxPeople) * 100)}%` }}
                />
              </div>
            </div>

            {feedback && (
              <div className={`text-sm px-3 py-2 rounded-lg mb-3 ${feedback.includes("成功") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {feedback}
              </div>
            )}

            {!isAuthor && (
              registered ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 py-3 rounded-xl font-medium">
                  <CheckCircle className="w-5 h-5" /> 已报名
                </div>
              ) : (
                <button
                  onClick={handleRegister} disabled={isFull || registering}
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {registering ? "报名中..." : isFull ? "已满员" : "✋ 我要参与"}
                </button>
              )
            )}
          </div>

          {/* Author */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">发布者</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                {task.author.name[0]}
              </div>
              <div>
                <p className="font-medium text-gray-800">{task.author.name}</p>
                {task.author.bio && <p className="text-xs text-gray-400">{task.author.bio}</p>}
              </div>
            </div>
          </div>

          {/* Participants */}
          {task.registrations.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">参与者 ({task.registrations.length})</p>
              <div className="flex flex-wrap gap-2">
                {task.registrations.map(r => (
                  <div key={r.user.id} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-medium text-emerald-700">
                      {r.user.name[0]}
                    </div>
                    {r.user.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
