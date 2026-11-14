import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class StandardErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (response.getHeader('x-correlation-id') as string | undefined) ??
      (request.headers['x-correlation-id'] as string | undefined) ??
      'unknown-correlation-id';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const rawResponse = exception.getResponse();

      if (typeof rawResponse === 'object' && rawResponse !== null) {
        const bodyObj = rawResponse as Record<string, unknown>;
        const code =
          typeof bodyObj.code === 'string'
            ? bodyObj.code
            : this.defaultCodeForStatus(status);
        const message = Array.isArray(bodyObj.message)
          ? bodyObj.message.join(' ')
          : typeof bodyObj.message === 'string'
            ? bodyObj.message
            : exception.message;

        response.status(status).json({
          code,
          message,
          correlationId,
          details:
            typeof bodyObj.details === 'object' && bodyObj.details !== null
              ? bodyObj.details
              : {},
        });
        return;
      }

      response.status(status).json({
        code: this.defaultCodeForStatus(status),
        message: String(rawResponse),
        correlationId,
        details: {},
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocurrió un error interno inesperado.',
      correlationId,
      details: {},
    });
  }

  private defaultCodeForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      default:
        return 'HTTP_ERROR';
    }
  }
}

