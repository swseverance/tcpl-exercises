import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authMiddleware } from './auth';

const { verifyIdToken } = vi.hoisted(() => ({ verifyIdToken: vi.fn() }));
const { loggerError } = vi.hoisted(() => ({ loggerError: vi.fn() }));

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ verifyIdToken })
}));

vi.mock('firebase-functions/logger', () => ({
  error: loggerError
}));

function createRequest(authorization?: string): Request {
  return { headers: authorization === undefined ? {} : { authorization } } as Request;
}

function createResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  } as unknown as Response;
}

describe('authMiddleware', () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
    loggerError.mockReset();
  });

  it('calls next() and sets req.uid when the bearer token is valid', async () => {
    verifyIdToken.mockResolvedValue({ uid: 'user-123' });
    const req = createRequest('Bearer good-token');
    const res = createResponse();
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(verifyIdToken).toHaveBeenCalledWith('good-token');
    expect(req.uid).toBe('user-123');
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responds 401 when no Authorization header is present', async () => {
    const req = createRequest(undefined);
    const res = createResponse();
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(verifyIdToken).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('responds 401 when the Authorization header is not a Bearer token', async () => {
    const req = createRequest('Basic good-token');
    const res = createResponse();
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(verifyIdToken).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('responds 401 and does not call next() when the token is invalid', async () => {
    verifyIdToken.mockRejectedValue(new Error('invalid token'));
    const req = createRequest('Bearer bad-token');
    const res = createResponse();
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('logs a serialized Error via the firebase logger', async () => {
    const thrown = new Error('invalid token');
    verifyIdToken.mockRejectedValue(thrown);
    const req = createRequest('Bearer bad-token');
    const res = createResponse();
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(loggerError).toHaveBeenCalledWith('[auth] verifyIdToken failed', {
      error: { name: thrown.name, message: thrown.message, stack: thrown.stack }
    });
  });

  it('logs a string fallback when a non-Error value is thrown', async () => {
    verifyIdToken.mockRejectedValue('some rejection reason');
    const req = createRequest('Bearer bad-token');
    const res = createResponse();
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(loggerError).toHaveBeenCalledWith('[auth] verifyIdToken failed', {
      error: 'some rejection reason'
    });
  });
});
