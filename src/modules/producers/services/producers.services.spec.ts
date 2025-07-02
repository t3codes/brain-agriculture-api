import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from './producers.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

// Mock DTOs para os testes
const createProducerDto = {
  cpfOrCnpj: '12345678909',
  name: 'Produtor Teste',
};

const updateProducerDto = {
  cpfOrCnpj: '98765432100',
  name: 'Nome Atualizado',
};

describe('ProducersService', () => {
  let service: ProducersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: PrismaService,
          useValue: {
            producer: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            farm: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // Testa a criação de um produtor com CPF/CNPJ válido e não duplicado
  describe('create', () => {
    it('deve criar um produtor com sucesso', async () => {
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.producer.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...createProducerDto,
      });

      const result = await service.create(createProducerDto, 1);

      expect(result).toHaveProperty('id');
      expect(prisma.producer.create).toHaveBeenCalled();
    });

    it('deve lançar exceção se CPF/CNPJ já existir', async () => {
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue({ id: 99 });

      await expect(service.create(createProducerDto, 1)).rejects.toThrow(
        ConflictException,
      );
    });
  });

 
  // Testa busca de um produtor específico, com validação de posse
  describe('findOne', () => {
    it('deve retornar o produtor se for do usuário', async () => {
      const producer = { id: 1, userId: 1 };
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(producer);

      const result = await service.findOne(1, 1);
      expect(result).toEqual(producer);
    });

    it('deve retornar null se não for do usuário', async () => {
      const producer = { id: 1, userId: 2 };
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(producer);

      const result = await service.findOne(1, 1);
      expect(result).toBeNull();
    });
  });

  // Testa atualização de produtor com verificação de posse
  describe('update', () => {
    it('deve atualizar o produtor se for do usuário', async () => {
      const producer = { id: 1, userId: 1, cpfOrCnpj: '12345678909' };
      (service as any).findOne = jest.fn().mockResolvedValue(producer);
      (prisma.producer.update as jest.Mock).mockResolvedValue({
        id: 1,
        ...updateProducerDto,
      });

      const result = await service.update(1, updateProducerDto, 1);

      expect(result).toHaveProperty('id');
      expect(prisma.producer.update).toHaveBeenCalled();
    });

    it('deve lançar ForbiddenException se não for do usuário', async () => {
      (service as any).findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.update(1, updateProducerDto, 2),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ConflictException se cpf/cnpj já existir', async () => {
      const producer = { id: 1, userId: 1, cpfOrCnpj: '12345678909' };
      (service as any).findOne = jest.fn().mockResolvedValue(producer);
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue({ id: 2 });

      await expect(
        service.update(1, updateProducerDto, 1),
      ).rejects.toThrow(ConflictException);
    });
  });

  // Testa remoção de produtor com verificação de fazendas vinculadas
  describe('remove', () => {
    it('deve remover produtor sem fazendas', async () => {
      const producer = { id: 1, userId: 1, name: 'Produtor Teste' };
      (service as any).findOne = jest.fn().mockResolvedValue(producer);
      (prisma.farm.count as jest.Mock).mockResolvedValue(0);
      (prisma.producer.delete as jest.Mock).mockResolvedValue(producer);

      const result = await service.remove(1, 1);

      expect(result).toHaveProperty('success', true);
      expect(result.deletedProducer.name).toBe('Produtor Teste');
    });

    it('deve lançar ForbiddenException se não for do usuário', async () => {
      (service as any).findOne = jest.fn().mockResolvedValue(null);

      await expect(service.remove(1, 99)).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ConflictException se produtor tiver fazendas', async () => {
      const producer = { id: 1, userId: 1 };
      (service as any).findOne = jest.fn().mockResolvedValue(producer);
      (prisma.farm.count as jest.Mock).mockResolvedValue(2);

      await expect(service.remove(1, 1)).rejects.toThrow(ConflictException);
    });
  });
});
