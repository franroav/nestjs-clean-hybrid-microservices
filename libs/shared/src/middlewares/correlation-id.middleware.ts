import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export const CORRELATION_ID_KEY = 'X-Request-Id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest, reply: FastifyReply, next: () => void) {
    const correlationHeader = req.headers[CORRELATION_ID_KEY] || randomUUID();
    reply.header(CORRELATION_ID_KEY, correlationHeader);
    req.headers[CORRELATION_ID_KEY] = correlationHeader;
    next();
  }
}