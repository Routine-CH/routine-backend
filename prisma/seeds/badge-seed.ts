import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function badgeSeed() {
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
    where: { id: '289b185c-3e4e-4484-a51e-e31c85c161b5' },
    update: {},
    create: {
      id: '289b185c-3e4e-4484-a51e-e31c85c161b5',
      title: 'Streak Starter',
      description: `You've logged in for 7 consecutive days, showing your dedication to personal growth. Keep the momentum going and continue to reach new heights.`,
      imageUrl: null,
      activityType: 'login-streak',
      requiredCountOrDuration: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginSreakBadge2 = await prisma.badge.upsert({
    where: { id: '285e6b4c-feb1-47d8-9e4a-847aad5214ee' },
    update: {},
    create: {
      id: '285e6b4c-feb1-47d8-9e4a-847aad5214ee',
      title: 'Fortnight Fanatic',
      description: `Your 14-day login streak demonstrates an unwavering commitment to progress. Keep nurturing your potential and inspiring others with your dedication.`,
      imageUrl: null,
      activityType: 'login-streak',
      requiredCountOrDuration: 14,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginSreakBadge3 = await prisma.badge.upsert({
    where: { id: '66141fdb-d7b8-461b-a565-53d844ae94b0' },
    update: {},
    create: {
      id: '66141fdb-d7b8-461b-a565-53d844ae94b0',
      title: 'Three-week Thriver',
      description: `You've logged in for 21 days straight, proving that consistency is key to success. Continue to thrive and make every day count.`,
      imageUrl: null,
      activityType: 'login-streak',
      requiredCountOrDuration: 21,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginSreakBadge4 = await prisma.badge.upsert({
    where: { id: '0de7e6b5-c00d-4ef4-968a-c662a23e9e7b' },
    update: {},
    create: {
      id: '0de7e6b5-c00d-4ef4-968a-c662a23e9e7b',
      title: 'Month-long Master',
      description: `With a 28-day login streak, you've mastered the art of consistency. Your dedication to growth and self-improvement is truly commendable.`,
      imageUrl: null,
      activityType: 'login-streak',
      requiredCountOrDuration: 28,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginSreakBadge5 = await prisma.badge.upsert({
    where: { id: '96904cdb-2e77-4bc4-b1e8-4334a7a7a3c8' },
    update: {},
    create: {
      id: '96904cdb-2e77-4bc4-b1e8-4334a7a7a3c8',
      title: 'Streak Superstar',
      description: `Logging in for 35 consecutive days is no small feat. You're a Streak Superstar, and your unwavering commitment to progress is an inspiration to us all.`,
      imageUrl: null,
      activityType: 'login-streak',
      requiredCountOrDuration: 35,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // LOGIN COUNT BADGES

  const loginCountBadge1 = await prisma.badge.upsert({
    where: { id: 'a1c0cb9f-40e1-46e1-8dc3-ed76348f51af' },
    update: {},
    create: {
      id: 'a1c0cb9f-40e1-46e1-8dc3-ed76348f51af',
      title: 'Login Novice',
      description: `You've logged in 10 times, taking the first steps on your journey of self-improvement. Keep up the enthusiasm and continue to unlock your potential.`,
      imageUrl: null,
      activityType: 'login-count',
      requiredCountOrDuration: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginCountBadge2 = await prisma.badge.upsert({
    where: { id: '73845633-3d74-45de-ada1-459dfc7912dd' },
    update: {},
    create: {
      id: '73845633-3d74-45de-ada1-459dfc7912dd',
      title: 'Login Enthusiast',
      description: `With 25 logins, your passion for growth and learning is evident. Keep cultivating your curiosity and make every login count.`,
      imageUrl: null,
      activityType: 'login-count',
      requiredCountOrDuration: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginCountBadge3 = await prisma.badge.upsert({
    where: { id: '762372b7-8c93-4691-901a-9efd7a12f56a' },
    update: {},
    create: {
      id: '762372b7-8c93-4691-901a-9efd7a12f56a',
      title: 'Login Expert',
      description: `Your 50 logins showcase your dedication to progress and self-improvement. Keep pushing forward and inspiring others with your determination.`,
      imageUrl: null,
      activityType: 'login-count',
      requiredCountOrDuration: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginCountBadge4 = await prisma.badge.upsert({
    where: { id: '89838b5e-b476-46bf-9f71-c7e38fa6c61d' },
    update: {},
    create: {
      id: '89838b5e-b476-46bf-9f71-c7e38fa6c61d',
      title: 'Login Master',
      description: `By logging in 75 times, you've demonstrated an unwavering commitment to personal growth. Continue to lead by example and empower others to follow in your footsteps.`,
      imageUrl: null,
      activityType: 'login-count',
      requiredCountOrDuration: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const loginCountBadge5 = await prisma.badge.upsert({
    where: { id: '480f50fc-9786-457d-ae94-457dfac41806' },
    update: {},
    create: {
      id: '480f50fc-9786-457d-ae94-457dfac41806',
      title: 'Login Legend',
      description: `With an astonishing 100 logins, you've become a true legend in your pursuit of self-improvement. Your dedication and consistency serve as an inspiration to us all. Continue to forge ahead and conquer new heights.`,
      imageUrl: null,
      activityType: 'login-count',
      requiredCountOrDuration: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // GOALS BADGES

  const goalsBadge1 = await prisma.badge.upsert({
    where: { id: 'c4656f54-8594-4a9d-9b09-e3ab14aec1d2' },
    update: {},
    create: {
      id: 'c4656f54-8594-4a9d-9b09-e3ab14aec1d2',
      title: 'Goal Getter',
      description: `You've reached an impressive milestone of 10 goals, showing your commitment to personal growth. Keep striving for greatness and continue to set your sights high!`,
      imageUrl: null,
      activityType: 'goals',
      requiredCountOrDuration: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const goalsBadge2 = await prisma.badge.upsert({
    where: { id: '2957465a-c4a3-45d6-80d5-357aa56d97eb' },
    update: {},
    create: {
      id: '2957465a-c4a3-45d6-80d5-357aa56d97eb',
      title: 'Goal Guru',
      description: `With 25 goals under your belt, you've demonstrated your ability to dream big and stay focused on what matters most. Your dedication to self-improvement is truly inspiring.`,
      imageUrl: null,
      activityType: 'goals',
      requiredCountOrDuration: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const goalsBadge3 = await prisma.badge.upsert({
    where: { id: 'ab3d937f-54e5-4408-8131-874ca68e4b69' },
    update: {},
    create: {
      id: 'ab3d937f-54e5-4408-8131-874ca68e4b69',
      title: 'Goal Gladiator',
      description: `By accomplishing 50 goals, you've shown immense resilience and determination. Your relentless pursuit of excellence is a testament to your strength of character.`,
      imageUrl: null,
      activityType: 'goals',
      requiredCountOrDuration: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const goalsBadge4 = await prisma.badge.upsert({
    where: { id: '69fb255c-f20b-41db-bcd1-7b9cc69f4644' },
    update: {},
    create: {
      id: '69fb255c-f20b-41db-bcd1-7b9cc69f4644',
      title: 'Goal Grandmaster',
      description: `Achieving 75 goals is no small feat. You're a shining example of perseverance and the power of setting your mind to anything you desire.`,
      imageUrl: null,
      activityType: 'goals',
      requiredCountOrDuration: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const goalsBadge5 = await prisma.badge.upsert({
    where: { id: '21747988-b35b-4b87-b2f0-9bc1c55b7e69' },
    update: {},
    create: {
      id: '21747988-b35b-4b87-b2f0-9bc1c55b7e69',
      title: 'Goal God',
      description: `An extraordinary achievement, reaching 100 goals is a true testament to your relentless pursuit of greatness. You've proven that the sky's the limit when it comes to personal growth.`,
      imageUrl: null,
      activityType: 'goals',
      requiredCountOrDuration: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // todos BADGES

  const todosBadge1 = await prisma.badge.upsert({
    where: { id: 'b521bd0b-de5a-40c0-ac2f-7718b0052ba1' },
    update: {},
    create: {
      id: 'b521bd0b-de5a-40c0-ac2f-7718b0052ba1',
      title: 'Todo Tackler',
      description: `Congratulations on completing 10 todo’s! Your commitment to tackling challenges head-on is a testament to your strong work ethic. Keep up the good work!`,
      imageUrl: null,
      activityType: 'todos',
      requiredCountOrDuration: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const todosBadge2 = await prisma.badge.upsert({
    where: { id: '9391a32c-9394-4ccf-a150-469677861b44' },
    update: {},
    create: {
      id: '9391a32c-9394-4ccf-a150-469677861b44',
      title: 'Todo Titan',
      description: `With 25 todo’s under your belt, you've shown incredible dedication to overcoming obstacles and getting things done. You're a true force to be reckoned with.`,
      imageUrl: null,
      activityType: 'todos',
      requiredCountOrDuration: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const todosBadge3 = await prisma.badge.upsert({
    where: { id: '7ba2a956-7ba4-4d4c-94f2-d24779b1c7c6' },
    update: {},
    create: {
      id: '7ba2a956-7ba4-4d4c-94f2-d24779b1c7c6',
      title: 'Todo Terminator',
      description: `By completing 50 todo’s, you've proven that no challenge is too great for you. Your unwavering determination is truly commendable. Keep crushing those todo’s!`,
      imageUrl: null,
      activityType: 'todos',
      requiredCountOrDuration: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const todosBadge4 = await prisma.badge.upsert({
    where: { id: '002bf14e-d451-4660-b6a0-7c108b6bd446' },
    update: {},
    create: {
      id: '002bf14e-d451-4660-b6a0-7c108b6bd446',
      title: 'Todo Trailblazer',
      description: `Finishing 75 todo’s is a remarkable accomplishment. Your steadfast dedication and focus have brought you to new heights. Keep blazing the trail to success!`,
      imageUrl: null,
      activityType: 'todos',
      requiredCountOrDuration: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const todosBadge5 = await prisma.badge.upsert({
    where: { id: '6cba4981-0fe1-4c30-b627-1857b28622f2' },
    update: {},
    create: {
      id: '6cba4981-0fe1-4c30-b627-1857b28622f2',
      title: 'Todo Tornado',
      description: `A whirlwind of accomplishment, completing 100 todo’s showcases your incredible drive and determination. You're a force of nature when it comes to getting things done!`,
      imageUrl: null,
      activityType: 'todos',
      requiredCountOrDuration: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // JOURNAL BADGES

  const journalsBadge1 = await prisma.badge.upsert({
    where: { id: 'cb7cea64-2c9e-4d07-ab53-7a2eab26890a' },
    update: {},
    create: {
      id: 'cb7cea64-2c9e-4d07-ab53-7a2eab26890a',
      title: 'Journaling Journeyman',
      description: `You've journaled 10 times, showing your commitment to self-reflection and personal growth. Keep exploring your thoughts and continue to cultivate self-awareness!`,
      imageUrl: null,
      activityType: 'journals',
      requiredCountOrDuration: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const journalsBadge2 = await prisma.badge.upsert({
    where: { id: '03f785ca-6b8b-47cc-aba1-47ceb484fcef' },
    update: {},
    create: {
      id: '03f785ca-6b8b-47cc-aba1-47ceb484fcef',
      title: 'Journaling Jedi',
      description: `With 25 journal entries, you've demonstrated the power of mindfulness and introspection. Your dedication to self-discovery is truly inspiring.`,
      imageUrl: null,
      activityType: 'journals',
      requiredCountOrDuration: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const journalsBadge3 = await prisma.badge.upsert({
    where: { id: '14ba3080-95d0-43d3-8467-3a93fa8b5364' },
    update: {},
    create: {
      id: '14ba3080-95d0-43d3-8467-3a93fa8b5364',
      title: 'Journaling Genius',
      description: `By completing 50 journal entries, you've shown the immense benefits of consistent self-reflection. Your wisdom and dedication are commendable.`,
      imageUrl: null,
      activityType: 'journals',
      requiredCountOrDuration: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const journalsBadge4 = await prisma.badge.upsert({
    where: { id: '622a9627-a574-4715-90b4-6571acb1fa0a' },
    update: {},
    create: {
      id: '622a9627-a574-4715-90b4-6571acb1fa0a',
      title: 'Journaling Juggernaut',
      description: `Penning down 75 journal entries is an incredible accomplishment. You're a force to be reckoned with when it comes to self-awareness and personal growth.`,
      imageUrl: null,
      activityType: 'journals',
      requiredCountOrDuration: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const journalsBadge5 = await prisma.badge.upsert({
    where: { id: '02674e06-327b-412e-a5c8-cc08f00d7aaa' },
    update: {},
    create: {
      id: '02674e06-327b-412e-a5c8-cc08f00d7aaa',
      title: 'Journaling Jumbo',
      description: `An extraordinary achievement, completing 100 journal entries is a testament to your unwavering commitment to self-discovery. Your journey of self-reflection knows no bounds!`,
      imageUrl: null,
      activityType: 'journals',
      requiredCountOrDuration: 100,
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
    loginSreakBadge1,
    loginSreakBadge2,
    loginSreakBadge3,
    loginSreakBadge4,
    loginSreakBadge5,
    loginCountBadge1,
    loginCountBadge2,
    loginCountBadge3,
    loginCountBadge4,
    loginCountBadge5,
    goalsBadge1,
    goalsBadge2,
    goalsBadge3,
    goalsBadge4,
    goalsBadge5,
    todosBadge1,
    todosBadge2,
    todosBadge3,
    todosBadge4,
    todosBadge5,
    journalsBadge1,
    journalsBadge2,
    journalsBadge3,
    journalsBadge4,
    journalsBadge5,
  });
}
