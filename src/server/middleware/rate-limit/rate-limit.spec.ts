import { Ratelimit } from '@upstash/ratelimit';
import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rateLimitMiddleware } from './rate-limit';

const { limit } = vi.hoisted(() => ({ limit: vi.fn() }));
const { loggerWarn } = vi.hoisted(() => ({ loggerWarn: vi.fn() }));

vi.mock('firebase-functions/logger', () => ({
  warn: loggerWarn
}));

const ratelimit = { limit } as unknown as Ratelimit;

function createRequest(uid: string): Request {
  return { uid } as Request;
}

function createResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  } as unknown as Response;
}

describe('rateLimitMiddleware', () => {
  beforeEach(() => {
    limit.mockReset();
    loggerWarn.mockReset();
  });

  it('calls next() when the request is within the limit', async () => {
    limit.mockResolvedValue({ success: true });
    const req = createRequest('user-123');
    const res = createResponse();
    const next = vi.fn();

    await rateLimitMiddleware(ratelimit)(req, res, next);

    expect(limit).toHaveBeenCalledWith('user-123');
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(loggerWarn).not.toHaveBeenCalled();
  });

  it('responds 429 and does not call next() when the limit is exceeded', async () => {
    limit.mockResolvedValue({ success: false });
    const req = createRequest('user-123');
    const res = createResponse();
    const next = vi.fn();

    await rateLimitMiddleware(ratelimit)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ message: 'Too Many Requests' });
  });

  it('logs a warning with the uid when the limit is exceeded', async () => {
    limit.mockResolvedValue({ success: false });
    const req = createRequest('user-123');
    const res = createResponse();
    const next = vi.fn();

    await rateLimitMiddleware(ratelimit)(req, res, next);

    expect(loggerWarn).toHaveBeenCalledWith('[rate-limit] request rejected', { uid: 'user-123' });
  });
});
