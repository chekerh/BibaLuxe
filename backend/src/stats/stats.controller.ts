import { Controller, Get, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard) // All stats endpoints require admin auth
@Roles('admin')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  @Get('sales')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async getSalesData(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 365) {
      throw new BadRequestException('Days must be a number between 1 and 365');
    }

    return this.statsService.getSalesData(daysNum);
  }
}
