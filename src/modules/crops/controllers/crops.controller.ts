// Controller - crops.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCropDto } from '../dto/create-crop.dto';
import { CropsService } from '../services/crops.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateCropDto } from '../dto/update-crop.dto';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) { }

  @Post('create')
  create(@Body() crops: CreateCropDto[]) {
    return this.cropsService.createMany(crops);
  }

  @Get('/by-farm/:farmId')
  findAllByFarm(@Param('farmId', ParseIntPipe) farmId: number) {
    return this.cropsService.findAllByFarm(farmId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cropsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCropDto
  ) {
    return this.cropsService.update(id, dto);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cropsService.remove(id);
  }
} 