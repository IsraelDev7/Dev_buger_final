import prisma from '../src/database/index.js';

async function verifyTruth() {
  try {
    const categories = await prisma.category.findMany();
    
    for (const cat of categories) {
      const products = await prisma.product.findMany({
        where: { category_id: cat.id }
      });
      
      console.log(`\n=== CATEGORIA: ${cat.name} (ID: ${cat.id}) ===`);
      if (products.length === 0) {
        console.log('--- VAZIA ---');
      } else {
        products.forEach(p => console.log(`- ${p.name}`));
      }
    }
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTruth();
