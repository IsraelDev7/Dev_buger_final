import prisma from '../src/database/index.js';

async function checkAllPaths() {
  try {
    const products = await prisma.product.findMany();
    console.log('--- Current Paths in DB ---');
    products.forEach(p => {
        console.log(`[Cat ${p.category_id}] ${p.name}: ${p.path}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllPaths();
