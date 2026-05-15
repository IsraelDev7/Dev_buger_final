const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.updateMany({
    where: { name: "Torta de Limão", category_id: 4 },
    data: { path: "torta-de-limao.png" }
  });
  console.log("Torta de Limão atualizada para a nova imagem com sucesso!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
