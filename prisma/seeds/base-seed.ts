import { MoodType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function baseSeed() {
  // const user1 = await prisma.user.upsert({
  //   where: { email: 'max.muster@gmail.com' },
  //   update: {},
  //   create: {
  //     email: 'max.muster@gmail.com',
  //     username: 'Max',
  //     password: '123456',
  //     createdAt: new Date(),
  //   },
  // });

  // const goal1 = await prisma.goal.upsert({
  //   where: { id: '0f812163-4718-44e4-a01d-40f1b993968e' },
  //   update: {},
  //   create: {
  //     userId: user1.id,
  //     title: 'setting up PlanetScale',
  //     imageUrl: '',
  //     description:
  //       'Setting up planetscale and prisma to make them work together',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // });

  // const journal1 = await prisma.journal.upsert({
  //   where: { id: 'f270cd80-c128-4834-8e30-8a1577c0d7f3' },
  //   update: {},
  //   create: {
  //     userId: user1.id,
  //     title: 'First Journal',
  //     moodDescription: 'I am happy',
  //     activity: 'I am doing mindfulness staff',
  //     toImprove: 'I want to improve my mood',
  //     thoughtsAndIdeas: 'I have some thoughts and ideas',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // });

  const mood1 = await prisma.mood.upsert({
    where: { id: '13f29776-ad53-4aa2-b2f5-179549bea36c' },
    update: {},
    create: {
      id: '13f29776-ad53-4aa2-b2f5-179549bea36c',
      type: 'rage' as MoodType,
    },
  });

  const mood2 = await prisma.mood.upsert({
    where: { id: '1929e062-0d0a-4971-be14-daf5d0ef767e' },
    update: {},
    create: {
      id: '1929e062-0d0a-4971-be14-daf5d0ef767e',
      type: 'curiosity' as MoodType,
    },
  });

  const mood3 = await prisma.mood.upsert({
    where: { id: '27308057-5451-4a6d-a670-7f82b13eed74' },
    update: {},
    create: {
      id: '27308057-5451-4a6d-a670-7f82b13eed74',
      type: 'excitement' as MoodType,
    },
  });

  const mood4 = await prisma.mood.upsert({
    where: { id: '27b53f0f-3ccd-4b68-b91e-694478cd4f93' },
    update: {},
    create: {
      id: '27b53f0f-3ccd-4b68-b91e-694478cd4f93',
      type: 'sadness' as MoodType,
    },
  });

  const mood5 = await prisma.mood.upsert({
    where: { id: '31cf714a-32b4-4824-849c-344f5a1aa5a0' },
    update: {},
    create: {
      id: '31cf714a-32b4-4824-849c-344f5a1aa5a0',
      type: 'frustration' as MoodType,
    },
  });

  const mood6 = await prisma.mood.upsert({
    where: { id: '4d604693-ecfe-4c8f-9ce3-bb4f5e3428b7' },
    update: {},
    create: {
      id: '4d604693-ecfe-4c8f-9ce3-bb4f5e3428b7',
      type: 'fear' as MoodType,
    },
  });

  const mood7 = await prisma.mood.upsert({
    where: { id: '67ec7047-ef92-4d75-adb7-ddfbcde70ffc' },
    update: {},
    create: {
      id: '67ec7047-ef92-4d75-adb7-ddfbcde70ffc',
      type: 'anger' as MoodType,
    },
  });

  const mood8 = await prisma.mood.upsert({
    where: { id: '78694f2f-5657-42b5-8ad0-d7811c134c90' },
    update: {},
    create: {
      id: '78694f2f-5657-42b5-8ad0-d7811c134c90',
      type: 'pride' as MoodType,
    },
  });

  const mood9 = await prisma.mood.upsert({
    where: { id: 'aa44b851-03da-4e38-ad76-d0447e83d5f9' },
    update: {},
    create: {
      id: 'aa44b851-03da-4e38-ad76-d0447e83d5f9',
      type: 'joy' as MoodType,
    },
  });

  const mood10 = await prisma.mood.upsert({
    where: { id: 'effd4f9f-4dd7-44b7-af17-163f7ef058b4' },
    update: {},
    create: {
      id: 'effd4f9f-4dd7-44b7-af17-163f7ef058b4',
      type: 'calm' as MoodType,
    },
  });

  const mood11 = await prisma.mood.upsert({
    where: { id: 'f428c78a-6510-4348-b473-5aa66bf12c2b' },
    update: {},
    create: {
      id: 'f428c78a-6510-4348-b473-5aa66bf12c2b',
      type: 'bored' as MoodType,
    },
  });

  const tool1 = await prisma.tool.upsert({
    where: { id: '"8fe84749-a5e4-4674-81ed-f255b923c386' },
    update: {},
    create: {
      id: '"8fe84749-a5e4-4674-81ed-f255b923c386',
      titleKey: 'tool-cards.timer',
      screenName: 'Timer',
    },
  });

  const tool2 = await prisma.tool.upsert({
    where: { id: '0a0799ce-eb61-4f0e-813b-a751da2e1940' },
    update: {},
    create: {
      id: '0a0799ce-eb61-4f0e-813b-a751da2e1940',
      titleKey: 'tool-cards.journals',
      screenName: 'Journals',
    },
  });

  const tool3 = await prisma.tool.upsert({
    where: { id: 'c1fecefb-bfa2-416a-b22b-f7c1bdb43c5b' },
    update: {},
    create: {
      id: 'c1fecefb-bfa2-416a-b22b-f7c1bdb43c5b',
      titleKey: 'tool-cards.notes',
      screenName: 'Notes',
    },
  });

  const tool4 = await prisma.tool.upsert({
    where: { id: '76fd447b-9220-4efe-9a31-53f4dd877c32' },
    update: {},
    create: {
      id: '76fd447b-9220-4efe-9a31-53f4dd877c32',
      titleKey: 'tool-cards.goals',
      screenName: 'Goals',
    },
  });

  const tool5 = await prisma.tool.upsert({
    where: { id: 'c284d189-5763-4eb7-ac25-ddd23a8b22fa' },
    update: {},
    create: {
      id: 'c284d189-5763-4eb7-ac25-ddd23a8b22fa',
      titleKey: 'tool-cards.todos',
      screenName: 'Todos',
    },
  });

  // const todo1 = await prisma.todo.upsert({
  //   where: { id: 'f270cd80-c128-4834-8e30-8a1577c0d7f3' },
  //   update: {},
  //   create: {
  //     userId: user1.id,
  //     title: 'First Todo',
  //     description: 'First Todo Description',
  //     plannedDate: new Date(),
  //     completed: false,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // });

  console.log({
    // user1,
    // goal1,
    // journal1,
    // todo1,
    mood1,
    mood2,
    mood3,
    mood4,
    mood5,
    mood6,
    mood7,
    mood8,
    mood9,
    mood10,
    mood11,
    tool1,
    tool2,
    tool3,
    tool4,
    tool5,
  });
}
