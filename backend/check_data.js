import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true }
  });
  console.log(JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category?.name, category_id: p.category_id })), null, 2));
}

main().finally(() => prisma.$disconnect());
