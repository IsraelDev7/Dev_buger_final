import prisma from '../src/database/index.js';

async function checkCategoryImages() {
  try {
    const categories = await prisma.category.findMany();
    console.log('--- Category Image Paths ---');
    categories.forEach(c => {
        console.log(`${c.name} (ID ${c.id}): path = ${c.path || 'NULL'}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategoryImages();
