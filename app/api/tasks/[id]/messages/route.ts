import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "内容不能为空" }, { status: 400 });

  const msg = await prisma.message.create({
    data: { content, senderId: session.userId, taskId: id },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
  });
  return NextResponse.json(msg, { status: 201 });
}
