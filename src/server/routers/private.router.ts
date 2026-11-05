import { Ratelimit } from '@upstash/ratelimit';
import { Router } from 'express';
import {
  getExercisePrivateHandler,
  saveExerciseCodeHandler,
  submitExerciseHandler
} from '../api/exercise.handler';
import { getExercisesPrivateHandler } from '../api/exercises.handler';
import { logHandler } from '../api/log.handler';
import { appCheckMiddleware } from '../middleware/appcheck/appcheck';
import { requireUserMiddleware } from '../middleware/auth/auth';
import { exerciseExistsMiddleware } from '../middleware/exercise-exists/exercise-exists';
import { rateLimitMiddleware } from '../middleware/rate-limit/rate-limit';
import { redis } from '../redis';

// Submitting runs the code in a real Vercel Sandbox, which costs money, so
// it's limited more tightly than everything else on this router.
const submitExerciseRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  prefix: 'ratelimit:submit-exercise'
});

export const privateRouter = Router();

privateRouter.use(appCheckMiddleware);
privateRouter.use(requireUserMiddleware);

privateRouter.get('/exercises', getExercisesPrivateHandler);
privateRouter.get('/exercises/:id', exerciseExistsMiddleware, getExercisePrivateHandler);
privateRouter.put('/exercises/:id/code', exerciseExistsMiddleware, saveExerciseCodeHandler);
privateRouter.post(
  '/exercises/:id/submit',
  exerciseExistsMiddleware,
  rateLimitMiddleware(submitExerciseRatelimit),
  submitExerciseHandler
);
privateRouter.post('/logs', logHandler);
