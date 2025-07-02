import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function GetDashboardOverviewSwagger() {
  return applyDecorators(
    ApiTags('dashboard'),
    ApiOperation({ summary: 'Resumo geral do sistema (overview)' }),
    ApiResponse({
      status: 200,
      description: 'Resumo geral retornado com sucesso',
      content: {
        'application/json': {
          example: {
            totalFarms: 2,
            totalHectares: 3001.5,
            byState: [
              {
                state: 'GO',
                total: 2,
              },
            ],
            byCrop: [
              {
                name: 'Soja',
                total: 1,
              },
              {
                name: 'Soja Geneticamente modificada',
                total: 1,
              },
            ],
            landUse: {
              arableArea: 2001,
              vegetationArea: 200.5,
            },
          },
        },
      },
    }),
  );
}
