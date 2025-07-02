import { Module } from '@nestjs/common';
import { FarmsController } from './controllers/farms.controller';
import { FarmsService } from './services/farms.service';

@Module({
  controllers: [FarmsController],
  providers: [FarmsService],
})
export class FarmsModule {}
