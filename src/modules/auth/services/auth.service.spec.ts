import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaMock: {
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };
  let jwtService: JwtService;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar UnauthorizedException se a senha for inválida', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser('test@example.com', 'wrongpass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve retornar o usuário se as credenciais forem válidas', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(user.email, 'password');
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('deve gerar os tokens e salvar o refresh token', async () => {
      const user = { id: 1, email: 'test@example.com' };
      jwtService.sign = jest
        .fn()
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      prismaMock.user.update.mockResolvedValue({});

      const result = await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { refreshToken: 'refreshToken' },
      });
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });
  });

  describe('clearRefreshToken', () => {
    it('deve limpar o refresh token', async () => {
      prismaMock.user.update.mockResolvedValue({});
      await authService.clearRefreshToken(1);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { refreshToken: null },
      });
    });
  });
});
