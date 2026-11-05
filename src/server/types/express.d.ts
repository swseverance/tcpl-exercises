import { ExerciseSource } from '../../models/exercise';
import { SessionUser } from '../../shared/models';

declare global {
  namespace Express {
    interface Request {
      exercise?: ExerciseSource;
      user?: SessionUser;
    }
  }
}

export {};
