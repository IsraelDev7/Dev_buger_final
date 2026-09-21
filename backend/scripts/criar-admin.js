// ============================================================
// scripts/criar-admin.js — promove (ou cria) o usuario administrador
//
// ── por que as credenciais saíram do codigo ──
// A versao anterior tinha `admin@admin.com` / `admin123` escritos aqui
// dentro. Num repositorio, isso nao e um valor padrao: e a credencial
// de administrador publicada. Qualquer pessoa que lesse o arquivo
// sabia como entrar no painel de qualquer instalacao que tivesse
// rodado este script.
//
// Agora os valores vem do ambiente e NAO ha reserva. Sem as variaveis,
// o script recusa rodar — esquecer de definir passa a ser um erro
// visivel, e nao uma porta aberta.
//
// Uso:
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME="..." npm run criar-admin
// ============================================================
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const senha = process.env.ADMIN_PASSWORD;
const nome = process.env.ADMIN_NAME || 'Administrador';

function exigir() {
  const faltando = [];
  if (!email) faltando.push('ADMIN_EMAIL');
  if (!senha) faltando.push('ADMIN_PASSWORD');

  if (faltando.length) {
    console.error(`Faltam variáveis de ambiente: ${faltando.join(', ')}`);
    console.error('Uso: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run criar-admin');
    process.exit(1);
  }

  /* Oito caracteres nao fazem uma senha forte, mas barram o caso mais
     comum: reaproveitar o "admin123" que estava aqui antes. */
  if (senha.length < 8) {
    console.error('ADMIN_PASSWORD precisa ter ao menos 8 caracteres.');
    process.exit(1);
  }
}

async function criarAdmin() {
  exigir();

  const existente = await prisma.user.findUnique({ where: { email } });

  if (existente) {
    await prisma.user.update({ where: { email }, data: { admin: true } });
    console.log(`Usuário ${email} promovido a administrador.`);
  } else {
    /* Custo 8 no bcrypt e o mesmo usado no cadastro comum da aplicacao.
       Manter igual importa: se o login verifica com um custo e o
       cadastro grava com outro, a diferenca so aparece em producao. */
    const password_hash = await bcrypt.hash(senha, 8);
    await prisma.user.create({
      data: { id: v4(), name: nome, email, password_hash, admin: true },
    });
    console.log(`Administrador ${email} criado.`);
  }

  await prisma.$disconnect();
}

criarAdmin().catch(async (erro) => {
  console.error(erro);
  await prisma.$disconnect();
  process.exit(1);
});
