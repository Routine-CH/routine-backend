import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// user1 and user2 testing
async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'max.muster@gmail.com' },
    update: {},
    create: {
      email: 'max.muster@gmail.com',
      username: 'Max',
      password: '*************************************',
      createdAt: new Date(),
    },
  });

  const goal1 = await prisma.goal.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      title: 'setting up PlanetScale',
      imageUrl: '',
      description:
        'Setting up planetscale and prisma to make them work together',
      importance: 'It is important to have a database',
      vision: 'I want to have a database',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const journal1 = await prisma.journal.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      title: 'First Journal',
      mood: 'happy',
      moodDescription: 'I am happy',
      activity: 'I am doing mindfulness staff',
      toImprove: 'I want to improve my mood',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const task1 = await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      title: 'First Task',
      description: 'First Task Description',
      plannedDate: new Date(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log({ user1, goal1, journal1, task1 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
