// src/farms/swagger/farms.swagger.ts

import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';

export function CreateFarmSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Para criar uma nova fazenda verifique se a soma dos campos (arableArea + vegetationArea) não excede o valor de (totalArea)' }),
        ApiBearerAuth('JWT-auth'),
        ApiBody({
            type: CreateFarmDto,
            examples: {
                exemplo: {
                    summary: 'Criando uma fazenda',
                    value: {
                        name: 'Fazenda Primavera',
                        city: 'Uberlândia',
                        state: 'MG',
                        totalArea: 500.0,
                        arableArea: 300.0,
                        vegetationArea: 50.0,
                        producerId: 7,
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: 'Fazenda criada com sucesso',
            content: {
                'application/json': {
                    example: {
                        id: 15,
                        name: 'Fazenda Primavera',
                        city: 'Uberlândia',
                        state: 'MG',
                        totalArea: 500,
                        arableArea: 300,
                        vegetationArea: 50,
                        producerId: 7,
                        createdAt: '2025-07-01T22:58:22.570Z',
                        updatedAt: '2025-07-01T22:58:22.570Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Criando fazendo com erro de calculo de área',
            content: {
                'application/json': {
                    example: {
                        message: "A soma das áreas agricultável e de vegetação não pode exceder a área total",
                        error: 'Conflict',
                        statusCode: 409,
                    },
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Não autorizado - JWT ausente ou inválido',
        }),
    );
}

export function FindAllFarmsSwagger() {
    return applyDecorators(
        ApiOperation({
            summary: 'Listar todas as fazendas do produtor',
            description: 'Retorna uma lista paginada de fazendas associadas ao produtor especificado'
        }),
        ApiBearerAuth('JWT-auth'),
        ApiQuery({
            name: 'producerId',
            required: true,
            type: Number,
            description: 'ID do produtor rural',
            example: 9
        }),
        ApiQuery({
            name: 'page',
            required: false,
            type: Number,
            description: 'Número da página (opcional, padrão é 1)',
            example: 1,
            schema: { default: 1 }
        }),
        ApiQuery({
            name: 'pageSize',
            required: false,
            type: Number,
            description: 'Itens por página (opcional, padrão é 10)',
            example: 10,
            schema: { default: 10 }
        }),
        ApiResponse({
            status: 200,
            description: 'Lista de fazendas retornada com sucesso',
            content: {
                'application/json': {
                    example: {
                        data: [
                            {
                                id: 14,
                                name: "Fazenda belo dia de sol",
                                city: "Rio Verde",
                                state: "GO",
                                totalArea: 1500.75,
                                arableArea: 1000.5,
                                vegetationArea: 100.25,
                                producerId: 9,
                                createdAt: "2025-07-02T06:53:54.334Z",
                                updatedAt: "2025-07-02T06:53:54.334Z"
                            }
                        ],
                        pagination: {
                            currentPage: 1,
                            pageSize: 10,
                            totalItems: 1,
                            totalPages: 1,
                            hasNextPage: false,
                            hasPreviousPage: false
                        }
                    }
                }
            }
        }),
        ApiResponse({
            status: 400,
            description: 'Parâmetros inválidos',
            content: {
                'application/json': {
                    example: {
                        message: 'O parâmetro "producerId" é obrigatório',
                        error: 'Bad Request',
                        statusCode: 400
                    }
                }
            }
        }),
        ApiResponse({
            status: 401,
            description: 'Não autorizado',
            content: {
                'application/json': {
                    example: {
                        message: 'Unauthorized',
                        statusCode: 401
                    }
                }
            }
        }),
        ApiResponse({
            status: 404,
            description: 'Produtor não encontrado',
            content: {
                'application/json': {
                    example: {
                        message: 'Produtor não encontrado',
                        statusCode: 404
                    }
                }
            }
        })
    );
}

export function FindOneFarmSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Buscar uma fazenda pelo ID' }),
        ApiBearerAuth('JWT-auth'),
        ApiParam({ name: 'id', description: 'ID da fazenda' }),
        ApiResponse({
            status: 200,
            description: 'Fazenda encontrada',
            content: {
                'application/json': {
                    example: {
                        id: 1,
                        name: 'Fazenda A',
                        city: 'Rio Verde',
                        state: 'GO',
                        totalArea: 1000.5,
                        arableArea: 750.5,
                        vegetationArea: 200,
                        producerId: 7,
                        createdAt: '2025-07-01T22:58:22.570Z',
                        updatedAt: '2025-07-01T22:58:22.570Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Fazenda não encontrada',
            content: {
                'application/json': {
                    example: {
                        message: 'Fazenda não encontrada',
                        statusCode: 404,
                    },
                },
            },
        }),
    );
}

export function UpdateFarmSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Atualizar informações de uma fazenda' }),
        ApiBearerAuth('JWT-auth'),
        ApiParam({ name: 'id', description: 'ID da fazenda a ser atualizada' }),
        ApiBody({
            type: UpdateFarmDto,
            examples: {
                exemplo: {
                    summary: 'Atualização simples',
                    value: {
                        name: 'Fazenda Atualizada',
                        city: 'Jataí',
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: 'Fazenda atualizada com sucesso',
            content: {
                'application/json': {
                    example: {
                        id: 1,
                        name: 'Fazenda Atualizada',
                        city: 'Jataí',
                        state: 'GO',
                        totalArea: 1000.5,
                        arableArea: 750.5,
                        vegetationArea: 200,
                        producerId: 7,
                        updatedAt: '2025-07-02T10:00:00.000Z',
                    },
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: 'Fazenda não encontrada',
        }),
    );
}



export function DeleteFarmSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Remover uma fazenda pelo ID' }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'id',
      type: Number,
      required: true,
      description: 'ID da fazenda a ser removida',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Fazenda removida com sucesso',
      content: {
        'application/json': {
          example: {
            success: true,
            message: 'Fazenda removida com sucesso',
            deletedFarm: {
              id: 1,
              name: 'Fazenda A',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Usuário não autorizado para deletar esta fazenda',
      content: {
        'application/json': {
          example: {
            statusCode: 403,
            message: 'Acesso negado',
            error: 'Forbidden',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Fazenda não encontrada',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Fazenda não encontrada',
            error: 'Not Found',
          },
        },
      },
    }),
  );
}

