import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { StatsModule } from './stats/stats.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/mattress-store',
      {
        // Security & Performance: MongoDB Atlas optimized settings
        retryWrites: true,
        w: 'majority',
        // Connection pooling for production traffic
        maxPoolSize: 50, // Maximum connections in pool
        minPoolSize: 5, // Keep minimum connections warm
        // Timeouts for reliability
        serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
        socketTimeoutMS: 45000, // Socket timeout
        connectTimeoutMS: 10000, // Initial connection timeout
        // Retry settings
        retryReads: true,
      }
    ),
    // Security: Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    ProductsModule,
    AiChatModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    StatsModule,
    HealthModule,
    MetricsModule,
    UploadModule,
  ],
  providers: [
    // Security: Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

