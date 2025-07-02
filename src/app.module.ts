// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ProducersModule } from './modules/producers/producers.module';
import { FarmsModule } from './modules/farms/farms.module';
import { CropsModule } from './modules/crops/crops.module';
import { RolesGuard } from './decorators/user.role.decorator';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ProducersModule, FarmsModule, CropsModule, DashboardModule],
  controllers: [],
  providers: [PrismaService, RolesGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
