import { RequestHandler } from 'express';
import { getAuth } from 'firebase-admin/auth';
import * as logger from 'firebase-functions/logger';
import { serializeError } from '../../utils/serialize-error';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const { uid } = await getAuth().verifyIdToken(token);
    req.uid = uid;
    next();
  } catch (err) {
    logger.error('[auth] verifyIdToken failed', { error: serializeError(err) });
    res.status(401).json({ message: 'Unauthorized' });
  }
};
