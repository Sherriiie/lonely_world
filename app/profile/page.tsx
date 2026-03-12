"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Calendar, PlusCircle } from "lucide-react";

interface UserData {
  id: string; name: string; email: string; bio: string | null;
  meaningPoints: number; avatar: string | null;
}
interface Task {
  id: string; title: string; category: string; location: string; date: string; status: string;
}
interface Registration {
  task: Task; createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myRegs, setMyRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(async d => {
      if (!d.user) { router.push("/login"); return; }
      setUser(d.user);
      const [tasksRes, regsRes] = await Promise.all([
        fetch("/api/profile/tasks"),
        fetch("/api/profile/registrations"),
      ]);
      if (tasksRes.ok) setMyTasks(await tasksRes.json());
      if (regsRes.ok) setMyRegs(await regsRes.json());
      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );
  if (!user) return null;

  const level = user.meaningPoints < 50 ? "🌱 萌芽" : user.meaningPoints < 200 ? "🌿 成长" : user.meaningPoints < 500 ? "🌳 茁壮" : "🌟 榜样";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {user.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-emerald-100 text-sm mt-1">{user.email}</p>
            {user.bio && <p className="text-emerald-50 text-sm mt-2">{user.bio}</p>}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{user.meaningPoints}</div>
            <div className="text-emerald-100 text-sm">意义值</div>
            <div className="mt-1 text-sm">{level}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold">{myTasks.length}</div>
            <div className="text-emerald-100 text-sm">发布任务</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold">{myRegs.length}</div>
            <div className="text-emerald-100 text-sm">参与活动</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" /> 我的成就
        </h2>
        <div className="flex flex-wrap gap-3">
          {user.meaningPoints >= 10 && (
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">🌱 初次帮助</span>
          )}
          {myRegs.length >= 5 && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">⭐ 活跃参与者</span>
          )}
          {myTasks.length >= 3 && (
            <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">🔥 热心发布者</span>
          )}
          {user.meaningPoints >= 100 && (
            <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">💎 意义达人</span>
          )}
          {user.meaningPoints === 0 && myRegs.length === 0 && (
            <p className="text-gray-400 text-sm">参与活动获得你的第一个成就吧！</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Tasks */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">我发布的任务</h2>
            <Link href="/tasks/new" className="text-emerald-600 text-sm hover:underline flex items-center gap-1">
              <PlusCircle className="w-4 h-4" /> 发布
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">还没有发布任务</p>
          ) : (
            <div className="space-y-3">
              {myTasks.map(t => (
                <Link key={t.id} href={`/tasks/${t.id}`} className="block p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors">
                  <p className="font-medium text-gray-800 text-sm line-clamp-1">{t.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.location}</span>
                    <span className={`px-2 py-0.5 rounded-full ${t.status === "open" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                      {t.status === "open" ? "招募中" : t.status === "full" ? "已满员" : "已完成"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Registrations */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">我参与的活动</h2>
          {myRegs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">还没有参与任何活动</p>
          ) : (
            <div className="space-y-3">
              {myRegs.map((r, i) => (
                <Link key={i} href={`/tasks/${r.task.id}`} className="block p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors">
                  <p className="font-medium text-gray-800 text-sm line-clamp-1">{r.task.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.task.date).toLocaleDateString("zh-CN")}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.task.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
