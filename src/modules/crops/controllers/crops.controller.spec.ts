import { Test, TestingModule } from '@nestjs/testing';
import { CropsController } from './crops.controller';
import { CropsService } from '../services/crops.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CropsController', () => {
  let controller: CropsController;

  // mock básico do PrismaService
  const mockPrismaService = {
    crop: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [
        CropsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<CropsController>(CropsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
