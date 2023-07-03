import { badgeSeed } from './seeds/badge-seed';
import { baseSeed } from './seeds/base-seed';

async function main() {
  await baseSeed();
  await badgeSeed();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect prisma if you have used it in the seed files
  });
