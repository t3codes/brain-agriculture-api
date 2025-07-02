import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Param,
  Put,
} from '@nestjs/common';
import { ProducersService } from '../services/producers.service';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateProducerSwagger, ListProducersSwagger, GetProducerByIdSwagger, UpdateProducerSwagger } from '../swagger/producers.swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) { }

  @Post('create')
  @CreateProducerSwagger()
  create(@Req() req, @Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto, req.user.userId);
  }

  @Get('list')
  @ListProducersSwagger()
  findAll(@Req() req) {
    return this.producersService.findAll(req.user.userId);
  }

  @Get(':id')
  @GetProducerByIdSwagger()
  findOne(@Param('id') id: string, @Req() req) {
    return this.producersService.findOne(+id, req.user.userId);
  }

  @Put('update/:id')
  @UpdateProducerSwagger()
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    return this.producersService.update(+id, updateProducerDto, req.user.userId);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.producersService.remove(+id);
  }
}
