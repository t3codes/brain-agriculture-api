import { Module } from '@nestjs/common';
import { ProducersService } from './services/producers.service';
import { ProducersController } from './controllers/producers.controller';

@Module({
  controllers: [ProducersController],
  providers: [ProducersService],
})
export class ProducersModule {}
