import prisma from '../src/database/index.js';

async function checkDesserts() {
  try {
    const categories = await prisma.category.findMany();
    console.log('Categories found:', categories.map(c => `${c.id}: ${c.name}`));

    const dessertCategory = categories.find(c => c.name.toLowerCase().includes('sobremesa'));
    
    if (dessertCategory) {
        const products = await prisma.product.findMany({
            where: { category_id: dessertCategory.id }
        });
        console.log(`\nProducts in ${dessertCategory.name} (ID: ${dessertCategory.id}):`);
        products.forEach(p => console.log(`- ${p.name} (R$ ${p.price})`));
    } else {
        console.log('\nDessert category not found!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDesserts();
