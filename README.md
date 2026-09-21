# DevBurger — E-commerce full-stack

Loja completa: catálogo, carrinho, autenticação, pagamento real com Stripe e
painel administrativo. Construído como prova de fundamentos — o ciclo inteiro,
da modelagem de dados ao momento mais delicado de qualquer sistema: **receber
dinheiro**.

**Stack:** React + Vite · Express 5 · Prisma · JWT + bcrypt · Stripe · Multer

---

## O que este projeto prova

Não é uma vitrine de produtos. É a demonstração de que o ciclo completo está
entendido:

| Camada | O que está resolvido aqui |
|---|---|
| **Modelagem** | Usuário, Categoria, Produto e Pedido, com as relações e o upload de imagem |
| **Fronteira de autenticação** | Senha cifrada com bcrypt, sessão por JWT, rota administrativa separada da pública |
| **Validação de entrada** | Yup em toda borda que recebe dado de fora |
| **Estado no cliente** | Carrinho e sessão em contexto React, com persistência |
| **Pagamento** | Stripe do carrinho até a confirmação |
| **Operação** | Painel administrativo com CRUD de produtos e de pedidos |

---

## Arquitetura

```
frontend/  React + Vite
  pages/      Home · Menu · Cart · Checkout · Login · Register
              Admin/{Products,Orders}
  hooks/      AuthContext · CartContext
  components/ Stripe/{StripeContainer,CheckoutFormStripe}
  services/   api.js — cliente HTTP

backend/   Express 5
  src/app/controllers/   User · Session · Category · Product · Order
  src/routes.js          rotas públicas e rotas administrativas
  src/middlewares/       verificação do token
  prisma/schema.prisma   modelo de dados
  scripts/criar-admin.js promove um usuário a administrador
```

### Como a imagem do produto é servida

O upload entra por `multer` e o arquivo fica em `backend/uploads`, fora do
versionamento. O caminho gravado no banco é só o nome; a URL é montada na
resposta da API:

```js
url_image: product.path ? `/api/product-file/${product.path}` : null
```

Isso mantém o binário fora do Git e permite trocar o destino do arquivo
depois — disco local hoje, armazenamento de objeto amanhã — sem tocar no
banco nem no frontend.

---

## Como rodar

```bash
# backend
cd backend
npm install
cp .env.example .env         # preencha DATABASE_URL, JWT_SECRET e Stripe
npx prisma migrate dev
npm run dev                  # porta 3001

# criar o administrador (as credenciais vêm do ambiente)
ADMIN_EMAIL=voce@exemplo.com ADMIN_PASSWORD=umaSenhaBoa npm run criar-admin

# frontend
cd ../frontend
npm install
npm run dev
```

---

## Decisões técnicas que valem explicação

### 1. `@prisma/client` é dependência de execução

Estava em `devDependencies`. É o cliente que a aplicação usa em tempo de
execução — qualquer deploy que instale sem as dependências de
desenvolvimento (`npm ci --omit=dev`, que é o padrão em vários provedores)
sobe e quebra na primeira consulta ao banco.

É o tipo de detalhe que não aparece em desenvolvimento e derruba produção no
primeiro dia.

### 2. As credenciais do administrador saíram do código

O script de criação tinha `admin@admin.com` / `admin123` escritos dentro.
Num repositório, isso não é um valor padrão — é a credencial de
administrador publicada. Qualquer pessoa que lesse o arquivo sabia como
entrar no painel de qualquer instalação que tivesse rodado o script.

Agora vêm do ambiente, **sem valor de reserva**: faltando a variável, o
script recusa rodar. Esquecer de definir virou erro visível em vez de porta
aberta.

### 3. O custo do bcrypt é o mesmo em toda a aplicação

Cadastro e script administrativo usam custo 8. Se divergissem, o login
falharia só em produção, para um subconjunto de usuários — o tipo de defeito
que consome dias.

---

## Limites conhecidos

- **Sem teste automatizado.** Os oito primeiros que valem escrever são
  conhecidos: login com senha errada, token expirado, token de outro usuário,
  carrinho com produto inexistente, quantidade negativa, webhook do Stripe com
  assinatura inválida, pedido duplicado e upload de arquivo que não é imagem.
  Não é cobertura alta — é saber **o que** vale testar.
- **Sem CI.** O selo no topo diz "isto roda" antes de qualquer pessoa clonar.
- **Sem seed reproduzível.** Hoje é preciso cadastrar produtos pela mão para
  ver a loja funcionando. Um `prisma/seed.js` com um catálogo de exemplo
  seria o próximo passo, e é o que separa "clonei" de "vi funcionando".
- **SQLite no `schema.prisma`.** Serve para desenvolvimento; um provedor real
  de Postgres é o caminho para qualquer coisa publicada.

---

## Histórico de correções relevantes

- **126 MB de 165 MB não eram usados por ninguém.** As pastas
  `frontend/public/assets/db/` e `assets/home_v2/` eram cópias byte a byte uma
  da outra — 44 arquivos cada, nenhum referenciado em nenhum lugar do código.
  Somavam-se a isso três variações do mesmo arquivo de 18,6 MB em
  `assets/menu/`, das quais só uma é usada. Removidos: a árvore caiu para
  cerca de 39 MB.
- **Fotografias salvas com extensão `.svg`.** Os arquivos de 18,6 MB e 14,7 MB
  são imagens de câmera embrulhadas em SVG — formato de vetor usado para
  guardar bitmap. Os que sobraram continuam assim e deveriam virar WebP.
- **22 scripts de bancada removidos.** Eram diagnósticos de uma sessão de
  correção de dados (`verify_truth.js`, `absolute_fix.js`, `fix_desserts.js`
  e companhia), versionados junto com o sistema. Continuam no histórico do
  Git para quem precisar; o único com valor operacional virou
  `backend/scripts/criar-admin.js`.
- **`@prisma/client` movido para `dependencies`.**
- **Credenciais de administrador removidas do código.**

> A remoção dos arquivos deixa a **árvore** leve, mas o repositório só encolhe
> de verdade depois de reescrever o histórico — as versões antigas seguem nos
> commits anteriores. Isso exige `git filter-repo` e um push forçado; é uma
> decisão consciente e separada.

---

## Direitos

Código sob licença MIT. As imagens de produto são material de demonstração.

---

Construído por [Israel Passos](https://github.com/IsraelDev7) · Smart LABS
