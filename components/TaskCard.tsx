import Link from "next/link";
import { MapPin, Clock, Users, Tag } from "lucide-react";

const categoryColors: Record<string, string> = {
  陪伴类: "bg-pink-100 text-pink-700",
  动物类: "bg-orange-100 text-orange-700",
  公益类: "bg-blue-100 text-blue-700",
  社区活动: "bg-purple-100 text-purple-700",
  技能帮助: "bg-yellow-100 text-yellow-700",
  心理陪伴: "bg-teal-100 text-teal-700",
};

interface TaskCardProps {
  task: {
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
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const colorClass = categoryColors[task.category] || "bg-gray-100 text-gray-700";
  const isFull = task.status === "full" || task._count.registrations >= task.maxPeople;

  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
            {task.category}
          </span>
          {isFull && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">已满员</span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {task.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {task.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {new Date(task.date).toLocaleDateString("zh-CN")}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {task._count.registrations}/{task.maxPeople}人
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">发布者：{task.author.name}</span>
          <span className="text-xs text-emerald-500 font-medium group-hover:underline">查看详情 →</span>
        </div>
      </div>
    </Link>
  );
}
