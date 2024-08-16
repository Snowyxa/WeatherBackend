const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'user1@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      email: 'user2@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Doe',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  console.log('Database has been seeded with encrypted passwords. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
