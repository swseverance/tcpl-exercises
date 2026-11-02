import { ExerciseDraft } from '../../models/exercise-draft';
import { ExerciseSubmission } from '../../models/exercise-submission';
import { ThemeName } from '../services/theme';

export type AppState = {
  theme: ThemeName | null;

  id: string | null;

  pendingChanges: Record<string, ExerciseDraft>;

  draft: Record<string, ExerciseDraft>;

  submissions: ExerciseSubmission[];
};

export const initialAppState: AppState = {
  theme: null,

  id: null,

  pendingChanges: {},

  draft: {},

  submissions: []
};
