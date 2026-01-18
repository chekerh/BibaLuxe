import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('metrics')
@UseGuards(JwtAuthGuard, RolesGuard) // Metrics require admin auth (sensitive system info)
@Roles('admin')
export class MetricsController {
  @Get()
  async getMetrics() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Simple metrics without prom-client
    return {
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
      },
      cpu: {
        user: Math.round(process.cpuUsage().user / 1000),
        system: Math.round(process.cpuUsage().system / 1000),
      },
    };
  }
}
