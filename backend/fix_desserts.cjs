const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { name: "Bolo no pote", path: "Group 188.svg" },
    { name: "Sorvetes Variados", path: "Group 186.svg" },
    { name: "Pudim de Leite", path: "b69fe4678fd6b183d68603e7d94eb58f772f49d8.png" },
    { name: "Mousse de Chocolate", path: "c6e9e413c5a3fc363ad91deaead762791d2791e3.png" },
    { name: "Gelatina Colorida", path: "8a3bac34e800d3e292463871a250af2adbb51b41.png" },
    { name: "Torta de Limão", path: "lemon-pie-premium.png" },
    { name: "Doces Tradicionais", path: "Group 184.svg" },
    { name: "Pavê de Baunilha", path: "30b7496248f527649c1fa7ad94e6dd10a6cd898a.png" },
    { name: "Cheesecake de Morango", path: "54efdd69e7ee03f1d3478cfda315a970321355b1.png" },
    { name: "Bolo de Cenoura", path: "ee9d6b555835f6a9ca18a75244a1213d6cf40bab.png" }
  ];

  for (const item of updates) {
    await prisma.product.updateMany({
      where: { name: item.name, category_id: 4 },
      data: { path: item.path }
    });
    console.log(`Atualizado: ${item.name} -> ${item.path}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
