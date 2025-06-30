## 🧩 Pull Request: Atualizações no Prisma e módulo de autenticação

### 📋 Descrição

Este PR inclui as seguintes alterações:

- Criação e ajuste dos models no `schema.prisma` adicionando campo de refreshToken ao usuário
- Execução das migrations necessárias para refletir os models atualizados
- Atualização do client Prisma com `prisma generate`
- Implementação do módulo de autenticação com rota de login JWT
- Configuração do bcrypt para hash e validação de senhas

### ✅ Novas bibliotecas

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
npm install @nestjs/jwt @nestjs/passport passport passport-jwt

