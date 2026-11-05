import { Ratelimit } from '@upstash/ratelimit';
import { RequestHandler } from 'express';
import * as logger from 'firebase-functions/logger';

export function rateLimitMiddleware(ratelimit: Ratelimit): RequestHandler {
  return async (req, res, next) => {
    const { success } = await ratelimit.limit(req.user!.uid);

    if (!success) {
      logger.warn('[rate-limit] request rejected', { uid: req.user!.uid });
      res.status(429).json({ message: 'Too Many Requests' });
      return;
    }

    next();
  };
}
