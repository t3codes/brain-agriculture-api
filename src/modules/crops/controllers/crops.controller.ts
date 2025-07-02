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
import {
  CreateCropsSwagger,
  FindAllCropsByFarmSwagger,
  FindOneCropSwagger,
  UpdateCropSwagger,
  DeleteCropSwagger,
} from '../swagger/farms.swagger';


@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) { }

  @Post('create')
  @CreateCropsSwagger()
  create(@Body() crops: CreateCropDto[]) {
    return this.cropsService.createMany(crops);
  }

  @Get('/by-farm/:farmId')
  @FindAllCropsByFarmSwagger()
  findAllByFarm(@Param('farmId', ParseIntPipe) farmId: number) {
    return this.cropsService.findAllByFarm(farmId);
  }

  @Get(':id')
  @FindOneCropSwagger()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cropsService.findOne(id);
  }

  @Put(':id')
  @UpdateCropSwagger()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCropDto
  ) {
    return this.cropsService.update(id, dto);
  }


  @Delete(':id')
  @Delete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cropsService.remove(id);
  }
} 