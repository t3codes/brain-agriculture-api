import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { UpdateFarmDto } from '../dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDto: CreateFarmDto) {
    const producerExists = await this.prisma.producer.findUnique({
      where: { id: createDto.producerId },
    });

    if (!producerExists) {
      throw new NotFoundException('Produtor não encontrado');
    }

    if (
      createDto.arableArea + createDto.vegetationArea >
      createDto.totalArea
    ) {
      throw new ConflictException(
        'A soma das áreas agricultável e de vegetação não pode exceder a área total',
      );
    }

    return this.prisma.farm.create({
      data: {
        name: createDto.name,
        city: createDto.city,
        state: createDto.state,
        totalArea: createDto.totalArea,
        arableArea: createDto.arableArea,
        vegetationArea: createDto.vegetationArea,
        producerId: createDto.producerId,
      },
    });
  }

  async findAll(producerId?: number, page = 1) {
    if (!producerId) {
      throw new BadRequestException(
        'O parâmetro "producerId" é obrigatório.',
      );
    }
    const take = 10;
    const skip = (page - 1) * take;
    const producer = await this.prisma.producer.findUnique({
      where: { id: producerId },
    });
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }
    return this.prisma.farm.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }



  async findOne(id: number, userId: number) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada.');
    }

    const producer = await this.prisma.producer.findUnique({
      where: { id: farm.producerId },
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado.');
    }
    return farm;
  }

  async update(id: number, updateDto: UpdateFarmDto, producerId: number) {
    const farm = await this.findOne(id, producerId);

    if (
      updateDto.arableArea ||
      updateDto.vegetationArea ||
      updateDto.totalArea
    ) {
      const arableArea = updateDto.arableArea ?? farm.arableArea;
      const vegetationArea =
        updateDto.vegetationArea ?? farm.vegetationArea;
      const totalArea = updateDto.totalArea ?? farm.totalArea;

      if (arableArea + vegetationArea > totalArea) {
        throw new ConflictException(
          'A soma das áreas agricultável e de vegetação não pode exceder a área total',
        );
      }
    }

    return this.prisma.farm.update({
      where: { id },
      data: {
        name: updateDto.name,
        city: updateDto.city,
        state: updateDto.state,
        totalArea: updateDto.totalArea,
        arableArea: updateDto.arableArea,
        vegetationArea: updateDto.vegetationArea,
      },
      include: {},
    });
  }

  async remove(id: number, producerId: number) {
    const farm = await this.findOne(id, producerId);
    await this.prisma.crop.deleteMany({
      where: { id },
    });
    return this.prisma.farm.delete({
      where: { id },
    });
  }
}
