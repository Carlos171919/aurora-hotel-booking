import { Request, Response, NextFunction } from 'express';

// Envuelve controladores async para que los errores lleguen al errorHandler.
export const asyncHandler =
  (fn: (req: any, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
