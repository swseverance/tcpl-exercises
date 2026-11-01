import { RequestHandler } from 'express';
import { RunCRequest } from '../../models/run-c';
import { runCInSandbox } from '../sandbox/run-c';

const MAX_CODE_LENGTH = 20_000;

export const runCHandler: RequestHandler = async (req, res) => {
  const body = req.body as RunCRequest;

  if (typeof body?.code !== 'string' || body.code.length === 0) {
    res.status(400).json({ message: 'code is required' });
    return;
  }

  if (body.code.length > MAX_CODE_LENGTH) {
    res.status(400).json({ message: `code must be at most ${MAX_CODE_LENGTH} characters` });
    return;
  }

  try {
    const result = await runCInSandbox(body.code);
    res.json(result);
  } catch (err) {
    console.error('[run-c] sandbox execution failed:', err);
    res.status(500).json({ message: 'Failed to run program' });
  }
};
