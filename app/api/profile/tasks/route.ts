import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { authorId: session.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}
