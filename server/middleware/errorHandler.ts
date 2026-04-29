import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Server Error]', err);

  const status = err.response?.status || 500;
  let message = "An internal server error occurred.";

  if (status === 403) {
    message = "Daily API quota exceeded. Please check your YouTube API usage.";
  } else if (status === 404) {
    message = "Resource not found on YouTube.";
  } else if (err.message && typeof err.message === 'string') {
    message = err.message;
  }

  res.status(status).json({
    error: message,
    code: status,
    timestamp: new Date().toISOString()
  });
}
