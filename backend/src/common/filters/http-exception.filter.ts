import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: string | object = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = exceptionResponse;
      } else {
        message = exception.message;
        error = message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.message;
    }

    // Log error details
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    if (status >= 500) {
      this.logger.error('Internal Server Error', errorLog);
    } else {
      this.logger.warn('Client Error', errorLog);
    }

    // Don't expose sensitive error details in production
    const isProduction = process.env.NODE_ENV === 'production';
    const responseBody: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: isProduction && status >= 500 ? 'Internal server error' : message,
    };

    // Only include error details in development
    if (!isProduction) {
      responseBody.error = error;
      if (exception instanceof Error && exception.stack) {
        responseBody.stack = exception.stack;
      }
    }

    response.status(status).json(responseBody);
  }
}
