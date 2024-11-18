import * as AWSXRay from 'aws-xray-sdk';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class XRayMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    AWSXRay.captureHTTPsGlobal(require('http'));
    AWSXRay.captureHTTPsGlobal(require('https'));
    next();
  }
}
