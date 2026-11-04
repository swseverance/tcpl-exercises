import { Router } from 'express';
import { getExercisePublicHandler } from '../api/exercise.handler';
import { getExercisesPublicHandler } from '../api/exercises.handler';
import { exerciseExistsMiddleware } from '../middleware/exercise-exists/exercise-exists';

export const publicRouter = Router();

publicRouter.get('/exercises', getExercisesPublicHandler);
publicRouter.get('/exercises/:id', exerciseExistsMiddleware, getExercisePublicHandler);
