const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const adminPassword = "$2b$10$f3KCHxgTrcPExPyuQU0eweGzY4mrEw.I5/ZFHRyYsTmgp2n90iR/C"; // admin123

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Demo Admin',
            password: adminPassword,
            role: 'admin',
        },
    });
    console.log({ admin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
