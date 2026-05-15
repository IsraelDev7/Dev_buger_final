import prisma from '../src/database/index.js';

const desserts = [
  { name: "Sorvetes", price: 1690, category_id: 4, offer: false, path: 'dessert_2.png' },
  { name: "Pudins", price: 1290, category_id: 4, offer: true, path: 'dessert_3.png' },
  { name: "Mousses", price: 1490, category_id: 4, offer: false, path: 'dessert_4.png' },
  { name: "Gelatinas", price: 690, category_id: 4, offer: true, path: 'dessert_5.png' },
  { name: "Tortas", price: 1890, category_id: 4, offer: false, path: 'dessert_6.png' },
  { name: "Doces Tradicionais", price: 890, category_id: 4, offer: true, path: 'dessert_7.png' },
  { name: "Pavês", price: 1790, category_id: 4, offer: false, path: 'dessert_8.png' },
  { name: "Cheesecakes", price: 2290, category_id: 4, offer: false, path: 'dessert_9.png' },
];

async function restoreDesserts() {
  try {
    for (const dessert of desserts) {
      // Verifica se já existe para não duplicar
      const exists = await prisma.product.findFirst({
        where: { name: dessert.name }
      });

      if (!exists) {
        await prisma.product.create({
          data: {
            name: dessert.name,
            price: dessert.price,
            category_id: dessert.category_id,
            offer: dessert.offer,
            path: dessert.path,
            description: `Deliciosa opção de ${dessert.name.toLowerCase()} para adoçar seu dia.`
          }
        });
        console.log(`Added: ${dessert.name}`);
      }
    }
    console.log('\nRestoration complete!');
  } catch (err) {
    console.error('Error during restoration:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDesserts();
