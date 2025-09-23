import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.assignment.deleteMany();
  await prisma.route.deleteMany();
  await prisma.driver.deleteMany();

  await prisma.driver.createMany({
    data: [
      {
        id: "driver-1",
        name: "Samer Samora",
        licenseType: "A",
        availability: true,
      },
      {
        id: "driver-2",
        name: "Bob Ahmed",
        licenseType: "B",
        availability: true,
      },
      {
        id: "driver-3",
        name: "Charlie Zhang",
        licenseType: "C",
        availability: false,
      },
    ],
  });

  await prisma.route.createMany({
    data: [
      {
        startLocation: "Warehouse A",
        endLocation: "Store 1",
        distance: 12.5,
        estimatedTime: 25,
        requiredLicense: null,
      },
      {
        startLocation: "Warehouse A",
        endLocation: "Store 2",
        distance: 30.0,
        estimatedTime: 45,
        requiredLicense: null,
      },
    ],
  });

  console.log("Seeded sample drivers and routes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma Client.");
    await prisma.$disconnect();
  });
