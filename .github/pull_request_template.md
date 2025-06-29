## 🧩 Pull Request: Configuração inicial do Prisma + Geração de Models

### 📋 Descrição

Este PR implementa a configuração inicial do Prisma no projeto, adicionando:

- Instalação do Prisma e @prisma/client
- Criação do arquivo `schema.prisma` com os models:
  - `User` (com autenticação via JWT prevista)
  - `Producer` (relacionado a User)
  - `Farm`, `Crop`, `Harvest`, `FarmCrop`
- Criação da primeira migration: `init`
- Geração do client Prisma
- Atualização do `.env` e `.env.example` com `DATABASE_URL`
- Criação e configuração de container postgres `docker-compose.pg.yml`

### ✅ Comandos executados

```bash
npm install prisma --save-dev
npm install @prisma/client

npx prisma init
npx prisma generate
npx prisma migrate dev --name init
