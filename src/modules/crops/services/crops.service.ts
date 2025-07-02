// Service - crops.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCropDto } from '../dto/create-crop.dto';
import { UpdateCropDto } from '../dto/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(private readonly prisma: PrismaService) { }

  async createMany(dtos: CreateCropDto[]) {
    return this.prisma.crop.createMany({
      data: dtos,
      skipDuplicates: true,
    });
  }

  async findAllByFarm(farmId: number) {
    return this.prisma.crop.findMany({
      where: { farmId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const crop = await this.prisma.crop.findUnique({ where: { id } });
    if (!crop) throw new NotFoundException('Cultura não encontrada');
    return crop;
  }

  async update(id: number, dto: UpdateCropDto) {
    await this.findOne(id); 
    return this.prisma.crop.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.crop.delete({ where: { id } });
    return { success: true, message: 'Cultura deletada com sucesso' };
  }
}
