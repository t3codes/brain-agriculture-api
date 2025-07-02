// src/producers/swagger/producers.swagger.ts

import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function CreateProducerSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: 'Criar um novo produtor rural',
            description:
                'Esta rota permite que usuários autenticados cadastrem produtores bem como dados de suas propriedades e safras. SEja cpf ou cnpj cada um precisa ser um documento válido. ',
        }),
        ApiBearerAuth('JWT-auth'),
        ApiBody({
            schema: {
                type: 'object',
                required: ['cpfOrCnpj', 'name'],
                properties: {
                    cpfOrCnpj: {
                        type: 'string',
                        example: '03926084561',
                    },
                    name: {
                        type: 'string',
                        example: 'Nome do Produtor Rural',
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: 'Produtor criado com sucesso.',
            content: {
                'application/json': {
                    example: {
                        id: 1,
                        cpfOrCnpj: '03926084561',
                        name: 'Produtor Rural Tharlles',
                        userId: 8,
                        createdAt: '2025-07-02T18:23:44.843Z',
                        updatedAt: '2025-07-02T18:23:44.843Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Erro de validação ou CPF/CNPJ já cadastrado.',
            content: {
                'application/json': {
                    example: {
                        message: 'Produtor com este CPF/CNPJ já existe',
                        statusCode: 400,
                        error: 'Bad Request',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Erro de validação ou CPF/CNPJ já cadastrado.',
            content: {
                'application/json': {
                    example: {
                        message: [
                            "CPF ou CNPJ inválido"
                        ],
                        error: 'Bad Request',
                        statusCode: 400,
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
    );
}


export function ListProducersSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: 'Listar produtores rurais',
            description:
                'Retorna todos os produtores cadastrados usuário.\n',
        }),
        ApiBearerAuth('JWT-auth'),
        ApiResponse({
            status: 200,
            description: 'Lista de produtores retornada com sucesso.',
            content: {
                'application/json': {
                    example: [
                        {
                            id: 1,
                            cpfOrCnpj: '03926084561',
                            name: 'Produtor Rural Tharlles',
                            userId: 8,
                            createdAt: '2025-07-02T18:23:44.843Z',
                            updatedAt: '2025-07-02T18:23:44.843Z',
                        },
                        {
                            id: 2,
                            cpfOrCnpj: '84651234000100',
                            name: 'Fazenda Agrícola Ltda',
                            userId: 8,
                            createdAt: '2025-07-02T19:00:01.343Z',
                            updatedAt: '2025-07-02T19:00:01.343Z',
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Token JWT ausente ou inválido.',
            content: {
                'application/json': {
                    example: {
                        cpfOrCnpj: "03926084561",
                        name: "Sr.Agricultor Abençoado"
                    },
                },
            },
        })
    );
}

export function GetProducerByIdSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: 'Buscar produtor rural por ID',
            description: 'Retorna um produtor específico com base no ID fornecido.\n\n' +
                '**Inclui a lista de fazendas associadas.**',
        }),
        ApiBearerAuth('JWT-auth'),
        ApiResponse({
            status: 200,
            description: 'Produtor encontrado com sucesso.',
            content: {
                'application/json': {
                    example: {
                        id: 7,
                        cpfOrCnpj: '03926084561',
                        name: 'Produtor Rural tharlles',
                        userId: 9,
                        createdAt: '2025-07-01T22:56:59.188Z',
                        updatedAt: '2025-07-01T22:56:59.188Z',
                        farms: [
                            {
                                id: 12,
                                name: 'Fazenda criada por tharlles 7',
                                city: 'Rio Verde',
                                state: 'GO',
                                totalArea: 1500.75,
                                arableArea: 1000.5,
                                vegetationArea: 100.25,
                                producerId: 7,
                                createdAt: '2025-07-01T22:58:22.570Z',
                                updatedAt: '2025-07-01T22:58:22.570Z'
                            }
                        ]
                    }
                }
            }
        }),
        ApiResponse({
            status: 401,
            description: 'Token JWT ausente ou inválido.',
            content: {
                'application/json': {
                    example: {
                        message: 'Unauthorized',
                        statusCode: 401,
                    }
                }
            }
        }),
        ApiResponse({
            status: 404,
            description: 'Produtor não encontrado.',
            content: {
                'application/json': {
                    example: {
                        message: 'Produtor não encontrado',
                        statusCode: 404,
                        error: 'Not Found'
                    }
                }
            }
        })
    );
}



export function UpdateProducerSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar informações de um produtor',
      description:
        'Permite que o produtor autenticado atualize seu nome ou CPF/CNPJ.',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          cpfOrCnpj: { type: 'string', example: '03926084561' },
          name: { type: 'string', example: 'Sr.Agricultor Abençoado' },
        },
        required: ['cpfOrCnpj', 'name'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Produtor atualizado com sucesso.',
      content: {
        'application/json': {
          example: {
            id: 1,
            cpfOrCnpj: '03926084561',
            name: 'Sr.Agricultor Abençoado',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos.',
      content: {
        'application/json': {
          example: {
            message: ['cpfOrCnpj deve ser um CPF ou CNPJ válido'],
            error: 'Bad Request',
            statusCode: 400,
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
      status: 404,
      description: 'Produtor não encontrado.',
      content: {
        'application/json': {
          example: {
            message: 'Produtor não encontrado',
            statusCode: 404,
          },
        },
      },
    }),
  );
}
