import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleUserRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve chamar usersService.create com os dados corretos', async () => {
      const dto: CreateUserDto = { name: 'A', email: 'a@a.com', password: '123' };
      const expectedResult = { id: 1, ...dto };
      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('deve retornar o usuário autenticado', async () => {
      const user = { id: 1, name: 'A' };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.getProfile({ user: { userId: 1 } });

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('deve atualizar o usuário autenticado', async () => {
      const updateDto: UpdateUserDto = { name: 'Atualizado' };
      const updatedUser = { id: 1, ...updateDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update({ user: { userId: 1 } }, updateDto);

      expect(usersService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('deve remover o usuário se autorizado', async () => {
      const user = { id: 2 };
      mockUsersService.remove.mockResolvedValue(user);

      const result = await controller.remove('2', { user: { id: 1, role: Role.ADMIN } });

      expect(usersService.remove).toHaveBeenCalledWith(2, { id: 1, role: Role.ADMIN });
      expect(result).toEqual(user);
    });
  });

  describe('toggleRole', () => {
    it('deve alterar o cargo de um usuário', async () => {
      const updatedUser = { id: 2, role: Role.ADMIN };
      mockUsersService.toggleUserRole.mockResolvedValue(updatedUser);

      const result = await controller.toggleRole('2', { role: Role.ADMIN }, { user: { id: 1, role: Role.ADMIN, superuser: true } });

      expect(usersService.toggleUserRole).toHaveBeenCalledWith(2, Role.ADMIN, { id: 1, role: Role.ADMIN, superuser: true });
      expect(result).toEqual(updatedUser);
    });
  });
});
