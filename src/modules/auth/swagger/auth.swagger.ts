import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export function LoginSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Login de usuário (retorna tokens JWT)' }),
    ApiBody({
      type: LoginDto,
      examples: {
        exemplo: {
          summary: 'Exemplo de login',
          value: {
            email: 'usuario@email.com',
            password: 'SenhaSegura123',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Login realizado com sucesso.',
      content: {
        'application/json': {
          example: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Senha inválida.',
      content: {
        'application/json': {
          example: {
            message: 'Senha inválida',
            error: 'Unauthorized',
            statusCode: 401,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado.',
      content: {
        'application/json': {
          example: {
            message: 'Usuário não encontrado',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
  );
}
