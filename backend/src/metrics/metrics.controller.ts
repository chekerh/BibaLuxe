import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
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
