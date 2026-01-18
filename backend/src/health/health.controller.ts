import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  @Get()
  async check() {
    const dbStatus = this.connection.readyState === 1 ? 'up' : 'down';
    const memoryUsage = process.memoryUsage();
    
    // Perform a ping test to verify actual database connectivity
    let dbPingOk = false;
    let dbPingLatency = 0;
    try {
      const startTime = Date.now();
      await this.connection.db.admin().ping();
      dbPingLatency = Date.now() - startTime;
      dbPingOk = true;
    } catch (error) {
      dbPingOk = false;
    }
    
    const overallStatus = dbStatus === 'up' && dbPingOk ? 'ok' : 'error';
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: {
        mongodb: {
          status: dbStatus,
          connected: dbPingOk,
          latencyMs: dbPingLatency,
        },
        memory: {
          status: 'ok',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        },
      },
      uptime: Math.round(process.uptime()),
    };
  }

  @Get('ready')
  async readiness() {
    const dbStatus = this.connection.readyState === 1 ? 'up' : 'down';
    
    // Perform actual database operation to verify readiness
    let dbReady = false;
    try {
      // Ping the database to verify it can respond
      await this.connection.db.admin().ping();
      dbReady = true;
    } catch (error) {
      dbReady = false;
    }
    
    const isReady = dbStatus === 'up' && dbReady;
    
    // Return 503 if not ready (for load balancer health checks)
    if (!isReady) {
      throw new HttpException({
        status: 'error',
        timestamp: new Date().toISOString(),
        mongodb: dbStatus,
        dbReady: dbReady,
        message: 'Service not ready - database connection issue',
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: dbStatus,
      dbReady: dbReady,
    };
  }

  @Get('live')
  liveness() {
    // Liveness check - just verify the process is running
    // Don't check external dependencies here
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
    };
  }
}
