import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const regs = await prisma.registration.findMany({
    where: { userId: session.userId },
    include: { task: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(regs);
}
