import { PrismaClient } from "@prisma/client";

// ここを修正：接続先URLを明示的に渡す
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL ?? "file:./dev.db",
});

async function main() {
  console.log("Seeding started...");

  // 既存データの削除
  try {
    await prisma.attendance.deleteMany();
    await prisma.score.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    // テーブルが存在しない場合は無視
  }

  // 1. 管理者作成 (ID: admin, Pass: admin)
  await prisma.user.create({
    data: {
      studentNumber: "admin",
      password: "admin",
      name: "担任",
      role: "ADMIN",
    },
  });

  // 2. 生徒作成 (No.1 ~ No.5)
  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        studentNumber: `No.${i}`,
        password: "pass",
        name: `学生${i}`,
        role: "STUDENT",
      },
    });
  }

  // 3. 科目作成
  const subjectsData = [
    { name: "数学II", units: 2, isStudyCredit: false },
    { name: "物理実験", units: 1, isStudyCredit: true },
    { name: "英語R", units: 2, isStudyCredit: false },
  ];

  for (const sub of subjectsData) {
    let total = sub.units * 15;
    if (sub.isStudyCredit) total = Math.ceil(total / 2);

    await prisma.subject.create({
      data: {
        name: sub.name,
        units: sub.units,
        isStudyCredit: sub.isStudyCredit,
        baseTotalClasses: total,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
