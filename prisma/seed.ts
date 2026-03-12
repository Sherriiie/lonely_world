import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding database...");

  const pw = await bcrypt.hash("password123", 10);
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { name: "小爱", email: "alice@example.com", password: pw, bio: "热爱公益，喜欢小动物", meaningPoints: 80 },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { name: "小波", email: "bob@example.com", password: pw, bio: "社区志愿者", meaningPoints: 150 },
  });

  const tasks = [
    { title: "陪独居老人聊天散步", description: "社区里有几位独居老人，希望有人能每周来陪他们聊聊天、散散步。老人们很孤独，你的陪伴对他们意义重大。", category: "陪伴类", location: "北京朝阳区望京", date: new Date("2026-03-20T14:00:00"), maxPeople: 3, contactInfo: "微信：xiaoai2024", authorId: alice.id },
    { title: "流浪猫喂养和绝育行动", description: "小区附近有约20只流浪猫需要定期喂养，同时我们正在组织绝育行动，需要志愿者协助抓捕和护理。有爱心的朋友快来！", category: "动物类", location: "上海浦东新区", date: new Date("2026-03-22T09:00:00"), maxPeople: 6, contactInfo: "微信：bobo_volunteer", authorId: bob.id, reward: "爱心志愿者证书" },
    { title: "图书馆绘本整理志愿服务", description: "儿童图书馆有大量绘本需要整理归类，工作内容简单愉快，适合喜欢书籍的朋友。完成后可以免费借阅图书。", category: "公益类", location: "北京海淀区", date: new Date("2026-03-23T10:00:00"), maxPeople: 5, contactInfo: "电话：13800138001", authorId: alice.id, reward: "免费借阅权限一个月" },
    { title: "周末社区植树活动", description: "城市里需要更多绿色！我们组织社区植树活动，一起为城市增添一份绿意。工具和树苗都准备好了，你只需要带上热情！", category: "社区活动", location: "深圳南山区", date: new Date("2026-03-25T08:30:00"), maxPeople: 20, contactInfo: "微信：green_shenzhen", authorId: bob.id },
    { title: "免费教老年人使用智能手机", description: "有很多老年人不会用智能手机，需要有耐心的年轻人来教他们。内容包括：微信、支付宝、网上挂号等。", category: "技能帮助", location: "广州天河区", date: new Date("2026-03-28T15:00:00"), maxPeople: 4, contactInfo: "微信：tech4elder", authorId: alice.id },
    { title: "倾听者：陪聊减压服务", description: "如果你感到孤独或压力大，我是一名心理志愿者，可以提供纯倾听服务。不评判、不建议，只是好好听你说话。", category: "心理陪伴", location: "线上", date: new Date("2026-03-19T20:00:00"), maxPeople: 1, contactInfo: "微信：listener_bobo", authorId: bob.id },
  ];

  for (const t of tasks) {
    await prisma.task.create({ data: t });
  }

  console.log("✅ Seed complete! Sample users:");
  console.log("   Email: alice@example.com / Password: password123");
  console.log("   Email: bob@example.com   / Password: password123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
