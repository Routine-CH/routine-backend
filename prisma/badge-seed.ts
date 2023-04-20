import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // MEDITATION BADGES
  const meditationBadge1 = await prisma.badge.upsert({
    where: { id: 'cf6a30c1-0337-41f3-8b25-bc10a31f9877' },
    update: {},
    create: {
      id: 'cf6a30c1-0337-41f3-8b25-bc10a31f9877',
      title: 'Meditation Maverick',
      description: `You've dedicated 30 minutes to meditation, opening the door to inner peace and clarity. Keep cultivating mindfulness and sharing its benefits with others.`,
      imageUrl: null,
      activityType: 'meditations',
      requiredCountOrDuration: 1800,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const meditationBadge2 = await prisma.badge.upsert({
    where: { id: '9b4e0c60-d02c-4454-adaa-07d2f8dcaede' },
    update: {},
    create: {
      id: '9b4e0c60-d02c-4454-adaa-07d2f8dcaede',
      title: 'Meditation Mastermind',
      description: `With 60 minutes of meditation, you're unlocking the secrets of a calm and balanced mind. Continue to explore the depths of inner wisdom and inspire those around you.`,
      imageUrl: null,
      activityType: 'meditations',
      requiredCountOrDuration: 3600,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const meditationBadge3 = await prisma.badge.upsert({
    where: { id: '5aefb4c9-6660-4582-8b49-4f59629b5019' },
    update: {},
    create: {
      id: '5aefb4c9-6660-4582-8b49-4f59629b5019',
      title: 'Meditation Mentor',
      description: `By meditating for 120 minutes, you've become a guiding light for others seeking tranquility. Keep nurturing your inner peace and sharing your insights with the world.`,
      imageUrl: null,
      activityType: 'meditations',
      requiredCountOrDuration: 7200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const meditationBadge4 = await prisma.badge.upsert({
    where: { id: 'dc0df82e-8e49-4c85-a51e-64df0ab60a4e' },
    update: {},
    create: {
      id: 'dc0df82e-8e49-4c85-a51e-64df0ab60a4e',
      title: 'Meditation Maestro',
      description: `Your 240 minutes of meditation have honed your ability to focus and remain present. You're an embodiment of mindfulness, and your journey serves as an inspiration to others.`,
      imageUrl: null,
      activityType: 'meditations',
      requiredCountOrDuration: 10800,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const meditationBadge5 = await prisma.badge.upsert({
    where: { id: '3aba7bdc-f125-4233-b676-70ebb9e017ff' },
    update: {},
    create: {
      id: '3aba7bdc-f125-4233-b676-70ebb9e017ff',
      title: 'Meditation Mogul',
      description: `With 480 minutes spent in meditation, you've reached an extraordinary level of mental clarity and inner harmony. Your unwavering commitment to mindfulness is truly admirable.`,
      imageUrl: null,
      activityType: 'meditations',
      requiredCountOrDuration: 14400,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // POMODORO BADGES

  const pomodoroBadge1 = await prisma.badge.upsert({
    where: { id: '48429bfb-9e13-4337-8fbf-4cb46e66bc73' },
    update: {},
    create: {
      id: '48429bfb-9e13-4337-8fbf-4cb46e66bc73',
      title: 'Pomodoro Prodigy',
      description: `You've completed 30 minutes of focused work using the Pomodoro technique. Keep up the productivity and continue to achieve your goals, one Pomodoro at a time.`,
      imageUrl: null,
      activityType: 'pomodoro-timers',
      requiredCountOrDuration: 1800,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const pomodoroBadge2 = await prisma.badge.upsert({
    where: { id: 'f61ca0a6-e4c6-4d97-9fbb-84ebf808fc2c' },
    update: {},
    create: {
      id: 'f61ca0a6-e4c6-4d97-9fbb-84ebf808fc2c',
      title: 'Pomodoro Pro',
      description: `With 60 minutes of Pomodoro-powered work, your productivity is soaring. Keep harnessing the power of focused effort and inspiring others to do the same.`,
      imageUrl: null,
      activityType: 'pomodoro-timers',
      requiredCountOrDuration: 3600,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const pomodoroBadge3 = await prisma.badge.upsert({
    where: { id: '1f3a0435-0245-4583-a300-a00555ea14ff' },
    update: {},
    create: {
      id: '1f3a0435-0245-4583-a300-a00555ea14ff',
      title: 'Pomodoro Pioneer',
      description: `By dedicating 120 minutes to the Pomodoro technique, you've proven that with focus and determination, anything is possible. Continue to lead the way and show the world what you're capable of.`,
      imageUrl: null,
      activityType: 'pomodoro-timers',
      requiredCountOrDuration: 7200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const pomodoroBadge4 = await prisma.badge.upsert({
    where: { id: '20cc1ddb-8ea3-452c-9511-b948fb190713' },
    update: {},
    create: {
      id: '20cc1ddb-8ea3-452c-9511-b948fb190713',
      title: 'Pomodoro Paragon',
      description: `Your 240 minutes of Pomodoro-timed work reflect your unwavering commitment to efficiency and focus. You're a shining example of productivity and perseverance.`,
      imageUrl: null,
      activityType: 'pomodoro-timers',
      requiredCountOrDuration: 10800,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const pomodoroBadge5 = await prisma.badge.upsert({
    where: { id: '4af63692-899e-479f-ad74-ef8f79db6f0f' },
    update: {},
    create: {
      id: '4af63692-899e-479f-ad74-ef8f79db6f0f',
      title: 'Pomodoro Phenom',
      description: `With an incredible 480 minutes using the Pomodoro technique, your productivity knows no bounds. Your drive and discipline inspire others to strive for success.`,
      imageUrl: null,
      activityType: 'pomodoro-timers',
      requiredCountOrDuration: 14400,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // LOGIN STREAK BADGES

  const loginSreakBadge1 = await prisma.badge.upsert({
    where: { id: '' },
    update: {},
    create: {
      id: '',
      title: '',
      description: ``,
      imageUrl: null,
      activityType: '',
      requiredCountOrDuration: 1800,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log({
    meditationBadge1,
    meditationBadge2,
    meditationBadge3,
    meditationBadge4,
    meditationBadge5,
    pomodoroBadge1,
    pomodoroBadge2,
    pomodoroBadge3,
    pomodoroBadge4,
    pomodoroBadge5,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
