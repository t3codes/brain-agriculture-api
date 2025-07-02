// src/users/swagger/users.swagger.ts
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export function CreateUserSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Criar novo usuário' }),
        ApiBody({
            type: CreateUserDto,
            examples: {
                exemplo: {
                    summary: 'Exemplo de criação',
                    value: {
                        name: 'Tharlles Jhoines',
                        email: 'tharllesjhoines@gmail.com',
                        password: 'SenhaForte123',
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: 'Usuário criado com sucesso.',
            content: {
                'application/json': {
                    example: {
                        id: 1,
                        name: 'Tharlles Jhoines',
                        email: 'tharllesjhoines@gmail.com',
                        refreshToken: null,
                        role: 'ADMIN',
                        superuser: false,
                        createdAt: '2025-07-01T22:46:33.804Z',
                        updatedAt: '2025-07-01T22:46:33.804Z',
                    },
                },
            },
        })

    );
}


export function GetProfileSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Obter perfil do usuário autenticado' }),
        ApiBearerAuth('JWT-auth'),
        ApiResponse({
            status: 200,
            description: 'Dados do perfil retornados.',
            content: {
                'application/json': {
                    example: {
                        id: 14,
                        name: 'Aline Alves',
                        email: 'alinealves27@gmail.com',
                        refreshToken: null,
                        role: 'FARMER',
                        superuser: false,
                        createdAt: '2025-07-02T03:34:36.736Z',
                        updatedAt: '2025-07-02T03:35:05.436Z',
                    },
                },
            },
        }),
    );
}


export function UpdateUserSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Atualizar dados do usuário autenticado' }),
        ApiBearerAuth('JWT-auth'),
        ApiBody({
            type: UpdateUserDto,
            examples: {
                exemplo: {
                    summary: 'Atualização de nome',
                    value: {
                        name: 'Maria Atualizada',
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: 'Usuário atualizado com sucesso.',
            content: {
                'application/json': {
                    example: {
                        id: 2,
                        name: 'Maria Atualizada',
                        email: 'alinealves@gmail.com',
                        password: '*** oculto ***',
                        refreshToken: '*** oculto ***',
                        createdAt: '2025-06-29T22:19:42.617Z',
                        updatedAt: '2025-06-30T17:53:24.173Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Token JWT não enviado ou inválido.',
            content: {
                'application/json': {
                    example: {
                        message: 'Unauthorized',
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


export function RemoveUserSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: 'Deletar usuário (somente ADMIN)',
            description:
                'Esta operação permite que **usuários com papel ADMIN** deletem outros usuários. ' +
                '- Apenas usuários com `role: ADMIN` têm permissão para excluir contas.\n' +
                '- O **primeiro usuário** do sistema é automaticamente criado com `superuser: true` e `role: ADMIN`.\n' +
                '- Este **superuser não pode ser deletado** como medida de segurança para evitar perda de controle administrativo.',
        }),
        ApiBearerAuth('JWT-auth'),
        ApiParam({ name: 'id', description: 'ID do usuário a ser deletado' }),
        ApiResponse({
            status: 200,
            description: 'Usuário deletado com sucesso.',
            content: {
                'application/json': {
                    example: {
                        message: 'Usuário removido com sucesso',
                    },
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Token JWT não enviado ou inválido.',
            content: {
                'application/json': {
                    example: {
                        message: 'Unauthorized',
                        statusCode: 401,
                    },
                },
            },
        }),
        ApiResponse({
            status: 403,
            description:
                'Acesso negado. Apenas usuários ADMIN podem deletar usuários.\n' +
                'Não é permitido deletar o superuser.',
            content: {
                'application/json': {
                    examples: {
                        usuario_nao_admin: {
                            summary: 'Usuário comum tentando deletar',
                            value: {
                                message: 'Apenas administradores podem deletar usuários.',
                                error: 'Forbidden',
                                statusCode: 403,
                            },
                        },
                        tentando_deletar_superuser: {
                            summary: 'Tentativa de deletar o superuser',
                            value: {
                                message: 'Não é permitido deletar o superuser',
                                statusCode: 403,
                            },
                        },
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


export function ToggleRoleSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Alterar a role de um usuário',
      description:
        'Permite que administradores (`ADMIN`) ou superusuários (`SUPERUSER`) alterem a role de outro usuário. ' +
        'Usuários comuns não têm permissão para esta ação.',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({ name: 'id', description: 'ID do usuário que terá a role alterada' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            enum: ['ADMIN', 'FARMER'],
            example: 'FARMER',
          },
        },
        required: ['role'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Role atualizada com sucesso.',
      content: {
        'application/json': {
          example: {
            message: 'Permissão do usuário atualizada com sucesso.',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token JWT ausente ou inválido.',
      content: {
        'application/json': {
          example: {
            message: 'Unauthorized',
            statusCode: 401,
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Tentativa de alterar a role de um superuser.',
      content: {
        'application/json': {
          example: {
            message: "As permissões deste usuário, não podem ser alteradas.",
	        error: "Forbidden",
            statusCode: 403,
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
            statusCode: 404,
          },
        },
      },
    }),
  );
}

