import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  const categories = await prisma.category.findMany();
  console.log('PRODUCTS:', JSON.stringify(products, null, 2));
  console.log('CATEGORIES:', JSON.stringify(categories, null, 2));
  await prisma.$disconnect();
}

main();
