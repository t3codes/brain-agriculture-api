// crops.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CropsService } from '../services/crops.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CropsController } from '../controllers/crops.controller';

describe('CropsController', () => {
  let controller: CropsController;

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
