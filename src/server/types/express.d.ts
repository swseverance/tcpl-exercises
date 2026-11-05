import { ExerciseSource } from '../../models/exercise';
import { SessionUser } from '../../shared/models';

declare global {
  namespace Express {
    interface Request {
      uid: string; // TODO: Remove
      exercise?: ExerciseSource;
      user: SessionUser | null;
    }
  }
}

export {};
