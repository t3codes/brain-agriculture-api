import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
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
      await expect(
        service.create({ name: 'Test', email: 'test@example.com', password: 'pass' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user and return without password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
      prismaMock.user.create.mockResolvedValue({
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        password: 'hashedPass',
      });

      const result = await service.create({
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
      });

      expect(result).toEqual({
        id: 1,
        name: 'Test',
        email: 'test@example.com',
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('findAll', () => {
    it('should return all users with producers', async () => {
      prismaMock.user.findMany.mockResolvedValue([{ id: 1, name: 'Test', producers: [] }]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: 1, name: 'Test', producers: [] }]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return user with producers', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test',
        producers: [],
      });

      const result = await service.findOne(1);
      expect(result).toEqual({
        id: 1,
        name: 'Test',
        producers: [],
      });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.update(1, { name: 'New' })).rejects.toThrow(NotFoundException);
    });

    it('should update user without changing password if not provided', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.user.update.mockResolvedValue({ id: 1, name: 'New' });

      const result = await service.update(1, { name: 'New' });

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'New', email: undefined },
      });
      expect(result).toEqual({ id: 1, name: 'New' });
    });

    it('should hash password if provided', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
      prismaMock.user.update.mockResolvedValue({ id: 1, name: 'New' });

      const result = await service.update(1, { name: 'New', password: 'pass' });

      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'New', email: undefined, password: 'hashedPass' },
      });
      expect(result).toEqual({ id: 1, name: 'New' });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should remove user', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
      prismaMock.user.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getUserProducers', () => {
    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserProducers(1)).rejects.toThrow(NotFoundException);
    });

    it('should return user producers', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        producers: [{ id: 1, name: 'Producer1' }],
      });

      const result = await service.getUserProducers(1);
      expect(result).toEqual([{ id: 1, name: 'Producer1' }]);
    });
  });
});
