import prisma from '../src/database/index.js';

const newImages = [
  '54efdd69e7ee03f1d3478cfda315a970321355b1.png',
  '8a3bac34e800d3e292463871a250af2adbb51b41.png',
  'b69fe4678fd6b183d68603e7d94eb58f772f49d8.png',
  'c6e9e413c5a3fc363ad91deaead762791d2791e3.png',
  'ee9d6b555835f6a9ca18a75244a1213d6cf40bab.png',
  'Group 184.svg',
  'Group 186.svg',
  'Group 188.svg'
];

async function updateDessertImages() {
  try {
    const desserts = await prisma.product.findMany({
      where: { category_id: 4 },
      orderBy: { name: 'asc' }
    });

    console.log(`Updating ${desserts.length} desserts with ${newImages.length} new images.`);

    for (let i = 0; i < Math.min(desserts.length, newImages.length); i++) {
      await prisma.product.update({
        where: { id: desserts[i].id },
        data: { path: newImages[i] }
      });
      console.log(`Updated: ${desserts[i].name} -> ${newImages[i]}`);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateDessertImages();
