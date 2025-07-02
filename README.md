
# 🚜 Brain Agriculture API

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<p align="center">
  <b>A progressive <a href="https://nodejs.org">Node.js</a> framework for building efficient and scalable server-side applications.</b>
</p>

---

## 📚 Descrição

Este projeto é uma API construída com **[NestJS](https://nestjs.com/)**, usando **Prisma ORM** e **PostgreSQL**, para gerenciar produtores, fazendas e culturas agrícolas de forma robusta e escalável.

---

## ⚡️ Tecnologias principais

- **NestJS** — Framework Node.js para aplicações escaláveis
- **Prisma ORM** — Mapeamento objeto-relacional
- **PostgreSQL** — Banco de dados relacional
- **Docker** — Containerização do app e do banco de dados

---

## ✅ Pré-requisitos

- [Docker](https://www.docker.com/get-started) + [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) + [npm](https://www.npmjs.com/) (opcional, caso queira rodar local)

---

## 🚀 Como usar

### 1️⃣ Clone o projeto

```bash
git clone git@github.com:t3codes/brain-agriculture-api.git
cd brain-agriculture-api.git
```

### 2️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz com este conteúdo de exemplo:

```env
# --------------------
# APP CONFIG
# --------------------
APP_NAME=brain-agriculture
APP_PORT=3000
NODE_ENV=development

# --------------------
# DATABASE CONFIG
# --------------------
DB_HOST=postgres
DB_PORT=5432
DB_USER=brainag_admin
DB_PASSWORD=SENHA_FORTE_AQUI
DB_NAME=brainag_db

# Prisma connection string
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# --------------------
# JWT AUTH
# --------------------
JWT_SECRET=SUA_JWT_SECRET_AQUI
JWT_REFRESH_SECRET=SUA_JWT_REFRESH_SECRET_AQUI
JWT_EXPIRES_IN=1h

# --------------------
# LOGGING
# --------------------
LOG_LEVEL=debug
PRISMA_QUERY_ENGINE_NO_CACHE=1
```

### 3️⃣ Suba tudo com Docker

```bash
docker-compose up --build
```

✅ Isso cria os contêineres:
- **postgres** (banco)
- **brain-agriculture** (API NestJS com Prisma)

A API ficará disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🔁 Regerar o Prisma Client (opcional)

Sempre que modificar o `schema.prisma`:

```bash
# Gere o Client na máquina (se rodar local)
npx prisma generate

# Ou rode dentro do contêiner:
docker-compose exec brain-agriculture npx prisma generate
```

---

## 🧪 Testes

### ✅ Rodar testes unitários

```bash
# Local
npx jest

# Docker
docker-compose exec -it brain-agriculture npx jest
```

### ✅ Rodar testes e2e

```bash
# Local
npm run test:e2e

# Docker
docker-compose exec -it brain-agriculture npm run test:e2e
```

### ✅ Ver cobertura de testes

```bash
# Local
npm run test:cov

# Docker
docker-compose exec brain-agriculture npm run test:cov
```

---

## ⚙️ Scripts úteis

```bash
# Compilar
npm run build

# Iniciar em dev com hot reload
npm run start:dev

# Iniciar em produção
npm run start:prod

# Sincronizar banco se precisar rodar migrations
npx prisma migrate dev
```

---

## 🐳 Comandos Docker principais

```bash
# Subir tudo
docker-compose up --build

# Parar tudo
docker-compose down

# Acessar o contêiner do backend
docker-compose exec -it brain-agriculture sh

# Ver logs em tempo real
docker-compose logs -f brain-agriculture
```

---

## 📌 Dicas importantes

✅ **Banco acessível no contêiner:** Use `DB_HOST=postgres` no `.env`.  
✅ **Gere o Prisma Client dentro do contêiner em dev**, usando `npx prisma generate` no script `start:dev`.  
✅ **Volumes:** O volume `.:/usr/src/app` permite hot reload do código.

---

## 📚 Recursos úteis

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Docker](https://docs.docker.com/)

---

## 📝 Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

## ✨ Considerações Finais
Tentei dar o meu melhor neste projeto, aplicando boas práticas com NestJS, Prisma, Docker e organização de ambiente para desenvolvimento e testes.

Sei que sempre há pontos a melhorar, mas busquei entregar um código limpo, estruturado e fácil de manter.

Espero que este trabalho esteja à altura da vaga e demonstre meu comprometimento, dedicação e vontade de crescer junto com o time.

Fico à disposição para ajustes, melhorias ou para discutir qualquer detalhe técnico!

Obrigado pela oportunidade! 🚀