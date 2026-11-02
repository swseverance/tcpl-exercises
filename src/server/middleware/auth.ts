import { RequestHandler } from 'express';
import { getAuth } from 'firebase-admin/auth';

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
    console.error('[auth] verifyIdToken failed:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
