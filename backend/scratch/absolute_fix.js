import prisma from '../src/database/index.js';

async function absoluteFix() {
  try {
    console.log('--- Iniciando Reclassificação Total ---');

    // 1. Pegar IDs das categorias
    const categories = await prisma.category.findMany();
    const catMap = {};
    categories.forEach(c => {
        catMap[c.name.toLowerCase()] = c.id;
    });

    console.log('IDs Detectados:', catMap);

    const products = await prisma.product.findMany();
    
    for (const p of products) {
      let newCatId = p.category_id;
      const name = p.name.toLowerCase();

      // Lógica de Reclassificação por Palavras-Chave
      if (name.includes('suco') || name.includes('água') || name.includes('refrigerante') || 
          name.includes('café') || name.includes('chá') || name.includes('bebida') || 
          name.includes('coquetel') || name.includes('energético') || name.includes('cerveja')) {
        newCatId = catMap['bebidas'];
      } 
      else if (name.includes('x-') || name.includes('burger') || name.includes('hamburguer') || name.includes('nuggets')) {
        newCatId = catMap['hambúrgueres'];
      }
      else if (name.includes('bolo') || name.includes('sorvete') || name.includes('pudim') || 
               name.includes('mousse') || name.includes('gelatina') || name.includes('torta') || 
               name.includes('doce') || name.includes('pavê') || name.includes('cheesecake') || name.includes('pote')) {
        newCatId = catMap['sobremesas'];
      }
      else if (name.includes('salada') || name.includes('bruschetta') || name.includes('carpaccio') || 
               name.includes('ceviche') || name.includes('queijo') || name.includes('croquete') || 
               name.includes('pastel') || name.includes('tartine') || name.includes('bacalhau') || name.includes('pastéis')) {
        newCatId = catMap['entradas'];
      }

      if (newCatId !== p.category_id) {
        await prisma.product.update({
          where: { id: p.id },
          data: { category_id: newCatId }
        });
        console.log(`[MOVIDO] ${p.name} -> Categoria ${newCatId}`);
      }
    }

    console.log('\n--- Verificação Final de Contagem ---');
    for (const [name, id] of Object.entries(catMap)) {
        const count = await prisma.product.count({ where: { category_id: id }});
        console.log(`${name.toUpperCase()}: ${count} produtos`);
    }

  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

absoluteFix();
