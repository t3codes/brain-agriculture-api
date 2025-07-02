import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { ProducersService } from '../services/producers.service';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';

describe('ProducersController', () => {
  let controller: ProducersController;
  let service: ProducersService;

  const mockProducersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        {
          provide: ProducersService,
          useValue: mockProducersService,
        },
      ],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    service = module.get<ProducersService>(ProducersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um produtor com os dados corretos', async () => {
      const dto: CreateProducerDto = {
        cpfOrCnpj: '12345678900',
        name: 'Produtor Teste',
      };
      const req = { user: { userId: 1 } };
      const expectedResult = { id: 1, ...dto };

      mockProducersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(req, dto);

      expect(service.create).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('deve listar todos os produtores do usuário', async () => {
      const req = { user: { userId: 1 } };
      const expectedResult = [{ id: 1, name: 'Produtor A' }];

      mockProducersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(req);

      expect(service.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('deve buscar um produtor específico pelo ID e userId', async () => {
      const req = { user: { userId: 1 } };
      const expectedResult = { id: 1, name: 'Produtor A' };

      mockProducersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1', req);

      expect(service.findOne).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('deve atualizar um produtor corretamente', async () => {
      const req = { user: { userId: 1 } };
      const dto: UpdateProducerDto = { name: 'Novo Nome', cpfOrCnpj: '99999999999' };
      const expectedResult = { id: 1, ...dto };

      mockProducersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', req, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto, 1);
      expect(result).toEqual(expectedResult);
    });
  });

   describe('remove', () => {
    it('deve remover um produtor corretamente', async () => {
      const expectedResult = { message: 'Produtor removido com sucesso' };

      mockProducersService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
