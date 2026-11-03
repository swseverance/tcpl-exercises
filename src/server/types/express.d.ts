import { ExerciseSource } from '../../models/exercise';

declare global {
  namespace Express {
    interface Request {
      uid: string;
      exercise: ExerciseSource;
    }
  }
}

export {};
