import { Module, Global } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}