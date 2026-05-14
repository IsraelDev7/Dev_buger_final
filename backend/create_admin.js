import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@admin.com';
  const password = 'admin123';
  const name = 'Admin Master';

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    console.log('Usuário já existe. Atualizando para Admin...');
    await prisma.user.update({
      where: { email },
      data: { admin: true },
    });
    console.log('Usuário atualizado com sucesso!');
  } else {
    const password_hash = await bcrypt.hash(password, 8);
    await prisma.user.create({
      data: {
        id: v4(),
        name,
        email,
        password_hash,
        admin: true,
      },
    });
    console.log('Usuário Admin criado com sucesso!');
  }

  await prisma.$disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
