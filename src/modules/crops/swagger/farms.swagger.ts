import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

export function CreateCropsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Criar uma ou mais culturas (crops)' }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      isArray: true,
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Soja' },
            variety: { type: 'string', example: 'RR1' },
            harvestYear: { type: 'number', example: 2025 },
            plantingDate: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-15T00:00:00.000Z',
            },
            harvestDate: {
              type: 'string',
              format: 'date-time',
              example: '2025-04-20T00:00:00.000Z',
            },
            yield: { type: 'number', example: 58.5 },
            area: { type: 'number', example: 20.5 },
            farmId: { type: 'number', example: 12 },
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Culturas criadas com sucesso' })
  );
}

export function FindAllCropsByFarmSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar culturas de uma fazenda específica' }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'farmId',
      type: Number,
      description: 'ID da fazenda',
      example: 12,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de culturas retornada com sucesso',
      content: {
        'application/json': {
          example: [
            {
              id: 1,
              name: 'Soja',
              variety: 'RR1',
              harvestYear: 2025,
              plantingDate: '2025-01-15T00:00:00.000Z',
              harvestDate: '2025-04-20T00:00:00.000Z',
              yield: 58.5,
              area: 20.5,
              farmId: 12,
              createdAt: '2025-07-01T00:00:00.000Z',
              updatedAt: '2025-07-01T00:00:00.000Z',
            },
          ],
        },
      },
    })
  );
}

export function FindOneCropSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Buscar uma cultura pelo ID' }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'ID da cultura',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Cultura encontrada com sucesso',
      content: {
        'application/json': {
          example: {
            id: 1,
            name: 'Soja',
            variety: 'RR1',
            harvestYear: 2025,
            plantingDate: '2025-01-15T00:00:00.000Z',
            harvestDate: '2025-04-20T00:00:00.000Z',
            yield: 58.5,
            area: 20.5,
            farmId: 12,
            createdAt: '2025-07-01T00:00:00.000Z',
            updatedAt: '2025-07-01T00:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  );
}

export function UpdateCropSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Atualizar dados de uma cultura' }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'ID da cultura a ser atualizada',
      example: 1,
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Soja Modificada' },
          variety: { type: 'string', example: 'RR2' },
          harvestYear: { type: 'number', example: 2025 },
          plantingDate: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-20T00:00:00.000Z',
          },
          harvestDate: {
            type: 'string',
            format: 'date-time',
            example: '2025-04-25T00:00:00.000Z',
          },
          yield: { type: 'number', example: 60.0 },
          area: { type: 'number', example: 22.0 },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso' })
  );
}

export function DeleteCropSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Remover uma cultura pelo ID' }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'ID da cultura a ser removida',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Cultura removida com sucesso',
      content: {
        'application/json': {
          example: {
            success: true,
            message: 'Cultura removida com sucesso',
            deletedCrop: {
              id: 1,
              name: 'Soja',
            },
          },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  );
}
