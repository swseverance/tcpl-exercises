export type ExerciseDraft = {
  exerciseId: string;
  code: string;
  created: string;
  lastUpdated: string;
};

export type SaveExerciseDraftsResult = {
  saved: ExerciseDraft[];
  failed: { id: string; message: string }[];
  invalid: { id: string; message: string }[];
};
