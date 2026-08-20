import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

const MAX_CORRELATION_ID_LENGTH = 128;

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const incomingCorrelationId = request.header('x-correlation-id');
    const correlationId =
      incomingCorrelationId &&
      incomingCorrelationId.length <= MAX_CORRELATION_ID_LENGTH
        ? incomingCorrelationId
        : randomUUID();

    response.setHeader('x-correlation-id', correlationId);
    response.locals.correlationId = correlationId;
    next();
  }
}
