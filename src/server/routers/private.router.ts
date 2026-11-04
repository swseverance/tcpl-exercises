import { Router } from 'express';
import {
  getExercisePrivateHandler,
  saveExerciseCodeHandler,
  submitExerciseHandler
} from '../api/exercise.handler';
import { getExercisesPrivateHandler } from '../api/exercises.handler';
import { logHandler } from '../api/log.handler';
import { appCheckMiddleware } from '../middleware/appcheck';
import { authMiddleware } from '../middleware/auth';
import { exerciseExistsMiddleware } from '../middleware/exercise-exists';

export const privateRouter = Router();

privateRouter.use(appCheckMiddleware);
privateRouter.use(authMiddleware);

privateRouter.get('/exercises', getExercisesPrivateHandler);
privateRouter.get('/exercises/:id', exerciseExistsMiddleware, getExercisePrivateHandler);
privateRouter.put('/exercises/:id/code', exerciseExistsMiddleware, saveExerciseCodeHandler);
privateRouter.post('/exercises/:id/submit', exerciseExistsMiddleware, submitExerciseHandler);
privateRouter.post('/logs', logHandler);
