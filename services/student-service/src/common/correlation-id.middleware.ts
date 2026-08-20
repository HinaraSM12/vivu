import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const incoming = request.header('x-correlation-id');
    const correlationId =
      incoming && incoming.length <= 128 ? incoming : randomUUID();

    response.setHeader('x-correlation-id', correlationId);
    response.locals.correlationId = correlationId;
    next();
  }
}
