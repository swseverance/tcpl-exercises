import { Exercise } from '../../models/exercise';

declare global {
  namespace Express {
    interface Request {
      uid: string;
      exercise: Exercise;
    }
  }
}

export {};
