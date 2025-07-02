import { Test, TestingModule } from '@nestjs/testing';
import { FarmsController } from './farms.controller';
import { FarmsService } from '../services/farms.service';
import { CreateFarmDto } from '../dto/create-farm.dto';

describe('FarmsController', () => {
  let controller: FarmsController;
  let service: FarmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [
        {
          provide: FarmsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
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
            })
          }
        }
      ]
    }).compile();

    controller = module.get<FarmsController>(FarmsController);
    service = module.get<FarmsService>(FarmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /farms', () => {
    it('should create a new farm', async () => {
      const dto: CreateFarmDto = {
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 400,
        producerId: 1
      };

      const result = await controller.create(dto);
      expect(result).toEqual({
        id: expect.any(Number),
        ...dto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});