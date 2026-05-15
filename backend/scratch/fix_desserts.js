import prisma from '../src/database/index.js';

async function fixDesserts() {
  try {
    // Procura por produtos que tenham nomes de sobremesa ou que estejam na categoria 5
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category_id: 5 },
          { name: { in: ["Sorvetes", "Pudins", "Mousses", "Gelatinas", "Tortas", "Doces Tradicionais", "Pavês", "Cheesecakes", "Bolos"] } }
        ]
      }
    });

    console.log(`Found ${products.length} products to update.`);

    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: { category_id: 4 } // Move para a categoria correta
      });
      console.log(`Updated: ${product.name} -> Category 4`);
    }

    console.log('\nFix complete! All desserts moved to category 4.');
  } catch (err) {
    console.error('Error during fix:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixDesserts();
