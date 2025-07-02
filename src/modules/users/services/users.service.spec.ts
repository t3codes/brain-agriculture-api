import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConflictException, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('deve lançar ConflictException se o email já existir', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });
      await expect(service.create({ name: 'A', email: 'a@a.com', password: '123' }))
        .rejects.toThrow(ConflictException);
    });

    it('deve criar o primeiro usuário como ADMIN e superuser', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
      prisma.user.create.mockResolvedValue({ id: 1, name: 'A', email: 'a@a.com', password: 'hashed123', role: Role.ADMIN, superuser: true });

      const result = await service.create({ name: 'A', email: 'a@a.com', password: '123' });
      expect(result).toEqual(expect.objectContaining({ name: 'A', email: 'a@a.com', role: Role.ADMIN }));
    });

    it('deve criar usuários subsequentes como FARMER', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.count.mockResolvedValue(5);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
      prisma.user.create.mockResolvedValue({ id: 2, name: 'B', email: 'b@b.com', password: 'hashed123', role: Role.FARMER, superuser: false });

      const result = await service.create({ name: 'B', email: 'b@b.com', password: '456' });
      expect(result).toEqual(expect.objectContaining({ name: 'B', role: Role.FARMER }));
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários com seus produtores', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 1, producers: [] }]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: 1, producers: [] }]);
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar o usuário com seus produtores', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, producers: [] });
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1, producers: [] });
    });
  });

  describe('update', () => {
    it('deve atualizar o usuário sem alterar a senha', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, producers: [] });
      prisma.user.update.mockResolvedValue({ id: 1, name: 'Atualizado' });

      const result = await service.update(1, { name: 'Atualizado' });
      expect(result).toEqual({ id: 1, name: 'Atualizado' });
    });

    it('deve atualizar o usuário com a senha criptografada', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, producers: [] });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed456');
      prisma.user.update.mockResolvedValue({ id: 1, name: 'Atualizado' });

      const result = await service.update(1, { name: 'Atualizado', password: '456' });
      expect(result).toEqual({ id: 1, name: 'Atualizado' });
    });
  });

  describe('remove', () => {
    it('deve lançar ForbiddenException se não for admin', async () => {
      await expect(service.remove(1, { id: 2, role: Role.FARMER }))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException ao tentar deletar a própria conta', async () => {
      await expect(service.remove(1, { id: 1, role: Role.ADMIN }))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('toggleUserRole', () => {
    const admin = { id: 1, role: Role.ADMIN, superuser: true };

    it('deve lançar ForbiddenException se não for admin', async () => {
      await expect(service.toggleUserRole(2, Role.ADMIN, { id: 1, role: Role.FARMER, superuser: true }))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException ao tentar alterar o próprio cargo', async () => {
      await expect(service.toggleUserRole(1, Role.FARMER, { id: 1, role: Role.ADMIN, superuser: true }))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ForbiddenException se não for superuser', async () => {
      await expect(service.toggleUserRole(2, Role.ADMIN, { id: 1, role: Role.ADMIN, superuser: false }))
        .rejects.toThrow(ForbiddenException);
    });

    it('deve lançar BadRequestException se o cargo for inválido', async () => {
      await expect(service.toggleUserRole(2, 'INVALID' as Role, admin))
        .rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.toggleUserRole(2, Role.FARMER, admin))
        .rejects.toThrow(NotFoundException);
    });

    it('deve atualizar o cargo do usuário', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 2, producers: [] });
      prisma.user.update.mockResolvedValue({ id: 2, role: Role.FARMER });
      const result = await service.toggleUserRole(2, Role.FARMER, admin);
    });
  });

  describe('getUserProducers', () => {
    it('deve lançar NotFoundException se o usuário não existir', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserProducers(1)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar os produtores do usuário se existir', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, producers: [{ id: 10, name: 'Prod' }] });
      const result = await service.getUserProducers(1);
      expect(result).toEqual([{ id: 10, name: 'Prod' }]);
    });
  });
});
