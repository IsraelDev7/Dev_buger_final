import prisma from '../src/database/index.js';

const drinks = [
  "Refrigerantes", "Água com Gás", "Sucos Naturais", "Café Espresso", 
  "Chás", "Bebidas Lácteas", "Coquetéis", "Bebidas Alcoólicas", "Energéticos"
];

async function fixCategories() {
  try {
    console.log('--- Relocating Drinks to Category 3 (Bebidas) ---');
    
    for (const name of drinks) {
      const result = await prisma.product.updateMany({
        where: { name: name },
        data: { category_id: 3 }
      });
      console.log(`Updated ${name}: ${result.count} items moved to Cat 3`);
    }

    console.log('\n--- Final Verification ---');
    const categories = await prisma.category.findMany();
    for (const cat of categories) {
        const count = await prisma.product.count({ where: { category_id: cat.id }});
        console.log(`${cat.name} (ID ${cat.id}): ${count} products`);
    }

  } catch (err) {
    console.error('Error during fix:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
