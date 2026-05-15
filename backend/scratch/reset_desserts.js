import prisma from '../src/database/index.js';

const desserts = [
  { name: "Bolo no pote", price: 3090, offer: true, path: 'd8137d70-b8e0-403f-9b6e-e00c2b098e6b.png' },
  { name: "Sorvetes Variados", price: 1690, offer: false, path: 'dessert_2.png' },
  { name: "Pudim de Leite", price: 1290, offer: true, path: 'dessert_3.png' },
  { name: "Mousse de Chocolate", price: 1490, offer: false, path: 'dessert_4.png' },
  { name: "Gelatina Colorida", price: 690, offer: true, path: 'dessert_5.png' },
  { name: "Torta de Limão", price: 1890, offer: false, path: 'dessert_6.png' },
  { name: "Doces Tradicionais", price: 890, offer: true, path: 'dessert_7.png' },
  { name: "Pavê de Baunilha", price: 1790, offer: false, path: 'dessert_8.png' },
  { name: "Cheesecake de Morango", price: 2290, offer: false, path: 'dessert_9.png' },
  { name: "Bolo de Cenoura", price: 1590, offer: true, path: 'dessert_1.png' }
];

async function resetDesserts() {
  try {
    console.log('--- Resetando Sobremesas ---');
    
    // 1. Remover sobremesas atuais para limpar qualquer erro
    await prisma.product.deleteMany({
      where: { 
        OR: [
            { category_id: 4 },
            { name: { in: desserts.map(d => d.name) } }
        ]
      }
    });
    
    console.log('Sobremesas antigas removidas.');

    // 2. Criar novas sobremesas limpas
    for (const d of desserts) {
      await prisma.product.create({
        data: {
          name: d.name,
          price: d.price,
          category_id: 4,
          offer: d.offer,
          path: d.path,
          description: `Uma deliciosa sobremesa preparada com carinho para encerrar sua refeição.`
        }
      });
      console.log(`Criado: ${d.name}`);
    }

    console.log('\nReset completo! Verifique seu menu agora.');
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetDesserts();
