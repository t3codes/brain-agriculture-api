  import { Controller, Get } from '@nestjs/common';
  import { OverviewResponseDto } from '../dto/overview-response.dto';
import { DashboardService } from '../services/dashboard.service';
import { GetDashboardOverviewSwagger } from '../sagger/dashboard.swagger';

  @Controller('dashboard')
  export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}
    
    @Get('overview')
    @GetDashboardOverviewSwagger()
    async getOverview(): Promise<OverviewResponseDto> {
      return this.dashboardService.getOverview();
    }
  }
