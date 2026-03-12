import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatar: true, bio: true } },
      registrations: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      messages: { include: { sender: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: "asc" } },
      _count: { select: { registrations: true } },
    },
  });
  if (!task) return NextResponse.json({ error: "任务不存在" }, { status: 404 });
  return NextResponse.json(task);
}
