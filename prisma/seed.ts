import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// user1 and user2 testing
async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'hadrian.chio@gmail.com' },
    update: {},
    create: {
      email: 'hadrian.chio@gmail.gom',
      username: 'Hadrian',
      password: '123456',
      createdAt: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah.candolfi@gmail.com' },
    update: {},
    create: {
      email: 'sarah.candolfi@gmail.gom',
      username: 'Sarah',
      password: '123456',
      createdAt: new Date(),
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
