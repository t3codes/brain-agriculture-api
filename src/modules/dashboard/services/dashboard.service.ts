import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OverviewResponseDto } from '../dto/overview-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<OverviewResponseDto> {
    const [totalFarms, totalHectaresAgg, farms, crops, landUseAgg] = await Promise.all([
      this.prisma.farm.count(),
      this.prisma.farm.aggregate({
        _sum: { totalArea: true },
      }),
      this.prisma.farm.findMany({
        select: { state: true },
      }),
      this.prisma.crop.findMany({
        select: { name: true },
      }),
      this.prisma.farm.aggregate({
        _sum: {
          arableArea: true,
          vegetationArea: true,
        },
      }),
    ]);

    const byState = this.countBy(farms.map(f => f.state)).map(([state, total]) => ({ state, total }));
    const byCrop = this.countBy(crops.map(c => c.name)).map(([name, total]) => ({ name, total }));

    return {
      totalFarms,
      totalHectares: totalHectaresAgg._sum.totalArea ?? 0,
      byState,
      byCrop,
      landUse: {
        arableArea: landUseAgg._sum.arableArea ?? 0,
        vegetationArea: landUseAgg._sum.vegetationArea ?? 0,
      },
    };
  }

  private countBy(items: string[]): [string, number][] {
    const counts: Record<string, number> = {};
    for (const item of items) {
      if (!item) continue;
      counts[item] = (counts[item] || 0) + 1;
    }
    return Object.entries(counts);
  }
}
