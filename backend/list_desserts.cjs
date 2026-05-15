const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const desserts = await prisma.product.findMany({
    where: { category_id: 4 }
  });
  console.log(JSON.stringify(desserts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
