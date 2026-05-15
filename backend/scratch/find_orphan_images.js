import prisma from '../src/database/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

async function findOrphanImages() {
  try {
    const products = await prisma.product.findMany();
    const usedPaths = new Set(products.map(p => p.path));
    
    const allFiles = fs.readdirSync(uploadsDir);
    const unusedFiles = allFiles.filter(f => !usedPaths.has(f) && f.endsWith('.png'));

    console.log('--- Unused PNG files in uploads/ ---');
    console.log(unusedFiles);

    // Mapeamento provisório baseado na ordem alfabética ou similar
    const dessertProducts = products.filter(p => p.category_id === 4 && p.path.startsWith('dessert'));
    
    console.log('\n--- Mapping to Desserts ---');
    for (let i = 0; i < Math.min(dessertProducts.length, unusedFiles.length); i++) {
        const product = dessertProducts[i];
        const newPath = unusedFiles[i];
        
        await prisma.product.update({
            where: { id: product.id },
            data: { path: newPath }
        });
        console.log(`Updated: ${product.name} -> ${newPath}`);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

findOrphanImages();
