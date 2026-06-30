import { Request, Response, NextFunction } from 'express';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: 'Recurso no encontrado' });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);
  res
    .status(err.status ?? 500)
    .json({ message: err.message ?? 'Error interno del servidor' });
}
