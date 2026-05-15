import prisma from '../src/database/index.js';

async function check() {
  try {
    const users = await prisma.user.count();
    const products = await prisma.product.count();
    const categories = await prisma.category.count();

    console.log('--- Database Status ---');
    console.log('Users:', users);
    console.log('Products:', products);
    console.log('Categories:', categories);
    
    if (products > 0) {
        const firstProduct = await prisma.product.findFirst();
        console.log('Sample Product:', firstProduct.name);
    }
  } catch (err) {
    console.error('Database Connection Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
