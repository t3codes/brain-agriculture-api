import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should throw ConflictException if email exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
      await expect(service.create({ name: 'Test', email: 'test@example.com', password: '123' }))
        .rejects.toThrow(ConflictException);
    });

    it('should create user as ADMIN if first user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      prismaMock.user.create.mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com', role: Role.ADMIN, superuser: true });

      const result = await service.create({ name: 'Test', email: 'test@example.com', password: '123' });
      expect(result).toMatchObject({ id: 1, name: 'Test', email: 'test@example.com' });
    });
  });

  describe('findAll', () => {
    it('should return all users with producers', async () => {
      prismaMock.user.findMany.mockResolvedValue([{ id: 1, producers: [] }]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: 1, producers: [] }]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return a user', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, producers: [] });
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1, producers: [] });
    });
  });

  describe('update', () => {
    it('should update user without password', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.user.update.mockResolvedValue({ id: 1, name: 'Updated' });

      const result = await service.update(1, { name: 'Updated' });
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });

    it('should hash password if provided', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      prismaMock.user.update.mockResolvedValue({ id: 1, name: 'Updated' });

      const result = await service.update(1, { name: 'Updated', password: 'pass' });
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });
  });

  describe('remove', () => {
    const admin = { id: 999, role: Role.ADMIN };

    it('should throw ForbiddenException if not admin', async () => {
      await expect(service.remove(1, { id: 2, role: Role.FARMER }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if deleting self', async () => {
      await expect(service.remove(1, { id: 1, role: Role.ADMIN }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should delete user', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.user.delete.mockResolvedValue({ id: 1 });
      const result = await service.remove(1, admin);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('toggleUserRole', () => {
    const admin = { id: 1, role: Role.ADMIN, superuser: true };

    it('should throw if not admin', async () => {
      await expect(service.toggleUserRole(2, Role.ADMIN, { id: 3, role: Role.FARMER, superuser: true }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw if changing own role', async () => {
      await expect(service.toggleUserRole(1, Role.FARMER, { id: 1, role: Role.ADMIN, superuser: true }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw if not superuser', async () => {
      await expect(service.toggleUserRole(2, Role.FARMER, { id: 1, role: Role.ADMIN, superuser: false }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw on invalid role', async () => {
      await expect(service.toggleUserRole(2, 'INVALID_ROLE' as Role, admin))
        .rejects.toThrow(BadRequestException);
    });

    it('should update user role', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 2 });
      prismaMock.user.update.mockResolvedValue({ id: 2, role: Role.ADMIN });

      const result = await service.toggleUserRole(2, Role.ADMIN, admin);
      expect(result).toMatchObject({ id: 2, role: Role.ADMIN });
    });
  });

  describe('getUserProducers', () => {
    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserProducers(1)).rejects.toThrow(NotFoundException);
    });

    it('should return producers', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, producers: [{ id: 1, name: 'Prod' }] });
      const result = await service.getUserProducers(1);
      expect(result).toEqual([{ id: 1, name: 'Prod' }]);
    });
  });
});
