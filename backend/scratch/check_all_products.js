import prisma from '../src/database/index.js';

async function checkAllProducts() {
  try {
    const products = await prisma.product.findMany();
    
    console.log('--- Current Product Mapping ---');
    products.forEach(p => {
        console.log(`- [Cat ${p.category_id}] ${p.name}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllProducts();
