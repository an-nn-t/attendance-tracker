import { PrismaClient } from "../src/generated/prisma"; // 相対パスで指定

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // データのリセット
  try {
    await prisma.attendance.deleteMany();
    await prisma.score.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log("No data to delete or database not initialized.");
  }

  // 1. 管理者作成
  await prisma.user.create({
    data: {
      studentNumber: "admin",
      password: "admin",
      name: "担任",
      role: "ADMIN",
    },
  });

  // 2. 生徒作成 (出席番号 1~5)
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
