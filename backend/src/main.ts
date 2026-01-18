import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Environment variable validation - fail fast if required vars are missing
function validateEnvironment(): void {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';
  const requiredVars: { name: string; required: boolean }[] = [
    { name: 'MONGODB_URI', required: isProduction },
    { name: 'JWT_SECRET', required: isProduction },
    { name: 'FRONTEND_URL', required: isProduction },
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  for (const { name, required } of requiredVars) {
    if (!process.env[name]) {
      if (required) {
        missing.push(name);
      } else {
        warnings.push(name);
      }
    }
  }

  // Warn about missing optional vars in development
  if (warnings.length > 0) {
    logger.warn(`Missing environment variables (using defaults): ${warnings.join(', ')}`);
  }

  // Fail fast if required vars are missing in production
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    logger.error('Please set these environment variables before starting the server in production.');
    process.exit(1);
  }

  // Additional validation for JWT_SECRET strength in production
  if (isProduction && process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      logger.error('JWT_SECRET must be at least 32 characters in production');
      process.exit(1);
    }
    if (process.env.JWT_SECRET === 'supersecretjwtkey' || process.env.JWT_SECRET.includes('change')) {
      logger.error('JWT_SECRET appears to be a default/placeholder value. Please use a secure random string.');
      process.exit(1);
    }
  }

  logger.log('Environment validation passed');
}

// Setup MongoDB connection event handlers for reliability
function setupMongooseConnectionHandlers(): void {
  const logger = new Logger('MongoDB');
  
  mongoose.connection.on('connected', () => {
    logger.log('MongoDB connected successfully');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Mongoose will attempt to reconnect automatically.');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('reconnected', () => {
    logger.log('MongoDB reconnected successfully');
  });

  // Handle process termination gracefully
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      logger.log('MongoDB connection closed due to app termination');
      process.exit(0);
    } catch (err) {
      logger.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
}

async function bootstrap() {
  // Validate environment before starting
  validateEnvironment();
  
  // Setup MongoDB connection handlers
  setupMongooseConnectionHandlers();

  const app = await NestFactory.create(AppModule);
  
  // Security: Trust proxy for Render deployment (rate limiting behind reverse proxy)
  // Access the underlying Express instance to set trust proxy
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', true);
  
  // Performance: Set request timeout to prevent connection exhaustion
  const server = app.getHttpServer();
  server.setTimeout(30000); // 30 seconds timeout for all requests
  server.keepAliveTimeout = 65000; // Slightly higher than ALB's 60s timeout
  server.headersTimeout = 66000; // Slightly higher than keepAliveTimeout
  
  // Security: Helmet for HTTP headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Security: CORS configuration
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = frontendUrl.split(',').map(url => url.trim());
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // In development (non-production), allow all origins for easier testing
      if (isDevelopment) {
        return callback(null, true);
      }
      
      // In production, reject non-whitelisted origins
      // Return false instead of error to avoid crashing - browser will handle the rejection
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Security: Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: process.env.NODE_ENV === 'production', // Hide error details in production
    }),
  );
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend server running on port ${port}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`Security: Helmet, Validation, CORS, Exception Filter configured`);
  console.log(`Trust proxy: enabled`);
}
bootstrap();

