import { Test, TestingModule } from '@nestjs/testing';
import { FarmsService } from './farms.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from '../dto/create-farm.dto';

describe('FarmsService', () => {
  let service: FarmsService;
  let prisma: PrismaService;

  const mockFarm = {
    id: 1,
    name: 'Fazenda Teste',
    city: 'São Paulo',
    state: 'SP',
    totalArea: 1000,
    arableArea: 600,
    vegetationArea: 400,
    producerId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockProducer = {
    id: 1,
    name: 'Produtor Válido',
    cpfOrCnpj: '123.456.789-00',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        {
          provide: PrismaService,
          useValue: {
            producer: {
              findUnique: jest.fn().mockResolvedValue(mockProducer)
            },
            farm: {
              create: jest.fn().mockResolvedValue(mockFarm)
            }
          }
        }
      ]
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a farm successfully', async () => {
      const dto: CreateFarmDto = {
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 400,
        producerId: 1
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockFarm);
      expect(prisma.producer.findUnique).toHaveBeenCalledWith({
        where: { id: dto.producerId }
      });
    });

    it('should throw NotFoundException when producer does not exist', async () => {
      jest.spyOn(prisma.producer, 'findUnique').mockResolvedValue(null);
      
      const dto: CreateFarmDto = {
        name: 'Fazenda Sem Dono',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 400,
        producerId: 999
      };

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });
});