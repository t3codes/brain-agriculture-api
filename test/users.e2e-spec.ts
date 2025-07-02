// test/users.e2e-spec.ts
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 🔹 Criar novo usuário
  it('/users/create/accounts (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/create/accounts')
      .send({
        name: 'Aline Alves',
        email: 'alinealves27@gmail.com',
        password: 'LiLEXXhP2222',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdUserId = res.body.id;
  });

  // 🔹 Login e obter JWT
  it('/auth/login (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'alinealves27@gmail.com',
        password: 'LiLEXXhP2222',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    jwtToken = res.body.accessToken;
  });

  // 🔹 Buscar perfil
  it('/users/accounts (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/accounts')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
  });

  // 🔹 Atualizar dados do usuário autenticado
  it('/users/update/accounts (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/users/update/accounts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Aline Atualizada',
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Aline Atualizada');
  });
  // 🔹 Deletar usuário
  it('/users/delete/accounts/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/users/delete/accounts/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(403);
  });
});
