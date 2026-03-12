import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!task) return NextResponse.json({ error: "任务不存在" }, { status: 404 });
    if (task.status !== "open") return NextResponse.json({ error: "任务已满或已完成" }, { status: 400 });
    if (task.authorId === session.userId) return NextResponse.json({ error: "不能报名自己的任务" }, { status: 400 });

    const reg = await prisma.registration.create({
      data: { userId: session.userId, taskId: id },
    });

    // Update task status if full
    if (task._count.registrations + 1 >= task.maxPeople) {
      await prisma.task.update({ where: { id }, data: { status: "full" } });
    }

    // Award meaning points
    await prisma.user.update({
      where: { id: session.userId },
      data: { meaningPoints: { increment: 10 } },
    });

    return NextResponse.json(reg, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002")
      return NextResponse.json({ error: "你已报名此任务" }, { status: 400 });
    return NextResponse.json({ error: "报名失败" }, { status: 500 });
  }
}
