import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where = category && category !== "全部" ? { category } : {};

  const tasks = await prisma.task.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, category, location, date, maxPeople, contactInfo, reward } = body;
    if (!title || !description || !category || !location || !date || !contactInfo)
      return NextResponse.json({ error: "请填写必填字段" }, { status: 400 });

    const task = await prisma.task.create({
      data: {
        title, description, category, location,
        date: new Date(date),
        maxPeople: Number(maxPeople) || 5,
        contactInfo,
        reward: reward || null,
        authorId: session.userId,
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}
