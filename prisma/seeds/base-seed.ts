import { MoodType, PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function baseSeed() {
  const user1 = await prisma.user.upsert({
    where: { email: 'max.muster@gmail.com' },
    update: {},
    create: {
      email: 'max.muster@gmail.com',
      username: 'Max',
      password: '123456',
      createdAt: new Date(),
    },
  });

  const goal1 = await prisma.goal.upsert({
    where: { id: '0f812163-4718-44e4-a01d-40f1b993968e' },
    update: {},
    create: {
      userId: user1.id,
      title: 'setting up PlanetScale',
      imageUrl: '',
      description:
        'Setting up planetscale and prisma to make them work together',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const journal1 = await prisma.journal.upsert({
    where: { id: 'f270cd80-c128-4834-8e30-8a1577c0d7f3' },
    update: {},
    create: {
      userId: user1.id,
      title: 'First Journal',
      moodDescription: 'I am happy',
      activity: 'I am doing mindfulness staff',
      toImprove: 'I want to improve my mood',
      thoughtsAndIdeas: 'I have some thoughts and ideas',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const moodTypes = ['angry', 'frustrated', 'happy', 'relaxed', 'glum', 'sad'];

  for (const moodType of moodTypes) {
    const moodId = uuidv4();
    await prisma.mood.upsert({
      where: { id: moodId },
      update: {},
      create: {
        id: moodId,
        type: moodType as MoodType,
      },
    });

    await prisma.journalMood.create({
      data: {
        moodId,
        journalId: journal1.id,
      },
    });
  }

  const todo1 = await prisma.todo.upsert({
    where: { id: 'f270cd80-c128-4834-8e30-8a1577c0d7f3' },
    update: {},
    create: {
      userId: user1.id,
      title: 'First Todo',
      description: 'First Todo Description',
      plannedDate: new Date(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log({ user1, goal1, journal1, todo1 });
}
