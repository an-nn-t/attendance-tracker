import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    },
  },
});

async function main() {
  console.log("Seeding started...");

  try {
    await prisma.attendance.deleteMany();
    await prisma.score.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    // 無視
  }

  await prisma.user.create({
    data: {
      studentNumber: "admin",
      password: "admin",
      name: "担任",
      role: "ADMIN",
    },
  });

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
