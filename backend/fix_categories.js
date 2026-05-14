import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Categorias detectadas: 1: Entradas, 2: Hambúrgueres, 3: Bebidas, 4: Sobremesas

  const drinks = [
    'Refrigerantes', 'Água com Gás', 'Sucos Naturais', 'Café Espresso', 
    'Chás', 'Bebidas Lácteas', 'Coquetéis', 'Bebidas Alcoólicas', 'Energéticos'
  ];

  const desserts = [
    'Bolos', 'Sorvetes', 'Pudins', 'Mousses', 'Gelatinas', 
    'Tortas', 'Doces Tradicionais', 'Pavês', 'Cheesecakes'
  ];

  const burgers = [
    'X-Tudo Duplo Frango', 'X-Bacon com Ovo', 'Duplo X-Salada Picante', 
    'X-Salada', 'X-Especial da casa com Nuggets', 'Duplo X-salada com molho especial', 
    'X- Bacon com molho da casa'
  ];

  console.log('Updating Drinks...');
  await prisma.product.updateMany({
    where: { name: { in: drinks } },
    data: { category_id: 3 }
  });

  console.log('Updating Desserts...');
  await prisma.product.updateMany({
    where: { name: { in: desserts } },
    data: { category_id: 4 }
  });

  console.log('Updating Burgers...');
  await prisma.product.updateMany({
    where: { name: { in: burgers } },
    data: { category_id: 2 }
  });

  console.log('Done!');
}

main().finally(() => prisma.$disconnect());
