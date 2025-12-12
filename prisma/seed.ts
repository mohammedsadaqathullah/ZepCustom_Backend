import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Hash password for test users
    const password = await bcrypt.hash('space123', 10);

    // Update or create test user
    const user1 = await prisma.user.upsert({
        where: { email: 'space@gmail.com' },
        update: { password },
        create: {
            email: 'space@gmail.com',
            password,
            displayName: 'Space User',
            role: 'USER',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'Sadaq@123.com' },
        update: { password },
        create: {
            email: 'Sadaq@123.com',
            password,
            displayName: 'Sadaq',
            role: 'ADMIN',
        },
    });

    console.log('✅ Seeded users:', user1.email, user2.email);
    console.log('📝 Password for both: space123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
