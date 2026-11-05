import { RequestHandler } from 'express';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as logger from 'firebase-functions/logger';
import {
  CreateSessionRequestBody,
  CreateSessionResponseBody,
  ErrorResponseBody
} from '../../../shared/models';
import { serializeError } from '../../utils/serialize-error';

const app = initializeApp({ projectId: process.env['FIREBASE_PROJECT_ID'] });
const auth = getAuth(app);

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

const SESSION_COOKIE_NAME = '__session';

// 14 days; the max Firebase allows.
const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export const verifySessionCookieHandler: RequestHandler = async (req, _res, next) => {
  const cookie = req.cookies?.[SESSION_COOKIE_NAME];
  if (!cookie) {
    req.user = null;
    return next();
  }

  try {
    const { uid } = await auth.verifySessionCookie(cookie, true);
    req.user = { uid };
  } catch {
    req.user = null;
  }

  next();
};

export const createSessionHandler: RequestHandler<
  unknown,
  CreateSessionResponseBody | ErrorResponseBody,
  CreateSessionRequestBody
> = async (req, res) => {
  // The client POSTs here on every page load (it's Firebase's
  // onAuthStateChanged reporting the restored user, not necessarily a fresh
  // sign-in), but it can't tell whether the existing cookie is still good —
  // __session is httpOnly, invisible to client JS. The server already knows,
  // having just verified it for this same request, so skip re-minting
  // entirely when it's already valid.
  if (req.user) {
    res.status(200).json({ status: 'valid' });
    return;
  }

  const idToken = req.body?.idToken;
  if (typeof idToken !== 'string' || !idToken) {
    logger.log(`POST /api/session: missing idToken`);
    res.status(400).json({ message: 'Missing idToken' });
    return;
  }

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS
    });

    res.cookie(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_MAX_AGE_MS,
      httpOnly: true,
      secure: req.secure,
      sameSite: 'lax'
    });
    logger.log('POST /api/session: created new session cookie');
    res.status(200).json({ status: 'created' });
  } catch (error) {
    logger.error('POST /api/session: failed to create session cookie', error);
    res.status(401).json({ message: 'Failed to create session' });
  }
};

export const deleteSessionHandler: RequestHandler = async (req, res) => {
  if (req.user) {
    try {
      // Revoke so a copy of this cookie (e.g. leaked via XSS or a stolen
      // device) can't go on being replayed after the user logs out here.
      await auth.revokeRefreshTokens(req.user.uid);
    } catch {
      // Already invalid/expired; nothing to revoke.
    }
  }

  res.clearCookie(SESSION_COOKIE_NAME);
  res.status(204).end();
};
