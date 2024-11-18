// src/middlewares/csrf.middleware.ts

import csurf from 'csurf';
import { Request, Response, NextFunction } from 'express'; // Assuming you're using Express with NestJS

export class CsrfMiddleware {
  private csrfProtection;

  constructor() {
    this.csrfProtection = csurf({ cookie: true }); // Adjust options as per your requirements
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.csrfProtection(req, res, next);
  }
}