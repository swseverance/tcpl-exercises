import { RequestHandler } from 'express';
import * as logger from 'firebase-functions/logger';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === 'string' && (LOG_LEVELS as readonly string[]).includes(value);
}

type LogRequestBody = {
  level: unknown;
  message: unknown;
  data?: unknown;
};

export const logHandler: RequestHandler<unknown, unknown, LogRequestBody> = (req, res) => {
  const { level, message, data } = req.body;

  if (!isLogLevel(level)) {
    res.status(400).json({ message: 'level must be one of debug, info, warn, error' });
    return;
  }

  if (typeof message !== 'string') {
    res.status(400).json({ message: 'message is required' });
    return;
  }

  logger[level](message, { uid: req.uid, data });
  res.status(204).end();
};
