import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export const requestLogger = (request: Request, response: Response, next: NextFunction): void => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

export const unknownEndpoint = (request: Request, response: Response): void => {
  response.status(404).send({ error: 'unknown endpoint' });
};

interface CustomError extends Error {
  name: string;
}

export const errorHandler = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler
};