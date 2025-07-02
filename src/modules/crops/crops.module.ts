import { Module } from '@nestjs/common';
import { CropsService } from './services/crops.service';
import { CropsController } from './controllers/crops.controller';

@Module({
  controllers: [CropsController],
  providers: [CropsService],
})
export class CropsModule {}
