import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Role } from '@prisma/client';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        validateUser: jest.fn(),
        login: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('deve ser definido', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('deve validar o usuário e retornar os tokens', async () => {
            const loginDto: LoginDto = {
                email: 'teste@exemplo.com',
                password: 'senha123',
            };

            const mockUser = {
                id: 1,
                name: 'Usuário Teste',
                email: loginDto.email,
                password: 'hashed123',
                refreshToken: null,
                role: Role.FARMER,
                superuser: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockTokens = {
                accessToken: 'fake-access-token',
                refreshToken: 'fake-refresh-token',
            };

            jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
            jest.spyOn(authService, 'login').mockResolvedValue(mockTokens);

            const result = await controller.login(loginDto);

            expect(authService.validateUser).toHaveBeenCalledWith(
                loginDto.email,
                loginDto.password,
            );
            expect(authService.login).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockTokens);
        });
    });

});
