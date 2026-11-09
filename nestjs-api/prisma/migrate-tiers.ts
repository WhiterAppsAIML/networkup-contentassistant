import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateTiers() {
  console.log('Starting tier migration...');

  // 1. Get all users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, tier: true, passwordHash: true },
  });

  console.log(`Found ${users.length} users to migrate`);

  for (const user of users) {
    const newTier = mapTier(user.tier);
    const firebaseUid = user.id; // Use existing UUID as firebaseUid for backward compat

    console.log(`Migrating user ${user.email}: ${user.tier} -> ${newTier}, firebaseUid: ${firebaseUid}`);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firebaseUid,
        tier: newTier as any,
      },
    });
  }

  console.log('Migration complete!');
}

function mapTier(oldTier: string): string {
  switch (oldTier) {
    case 'FREE':
      return 'STARTER';
    case 'PRO':
      return 'GROWTH';
    case 'ENTERPRISE':
      return 'ENTERPRISE';
    default:
      return 'STARTER';
  }
}

migrateTiers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });