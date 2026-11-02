import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { ExerciseSubmission } from '../../models/exercise-submission';
import { RunCResponse } from '../../models/run-c';

type CreateExerciseSubmissionArgs = {
  exerciseId: string;
  code: string;
  result: RunCResponse;
};

type WriteExerciseSubmission = {
  exerciseId: string;
  code: string;
  result: RunCResponse;
  created: FieldValue;
};

type ReadExerciseSubmission = {
  exerciseId: string;
  code: string;
  result: RunCResponse;
  created: Timestamp;
};

function submissionsCollection(uid: string) {
  return getFirestore().collection(`users/${uid}/submissions`);
}

function toExerciseSubmission(id: string, data: ReadExerciseSubmission): ExerciseSubmission {
  return {
    id,
    exerciseId: data.exerciseId,
    code: data.code,
    result: data.result,
    created: data.created.toDate().toISOString()
  };
}

export async function createExerciseSubmission(
  uid: string,
  args: CreateExerciseSubmissionArgs
): Promise<ExerciseSubmission> {
  const write: WriteExerciseSubmission = {
    exerciseId: args.exerciseId,
    code: args.code,
    result: args.result,
    created: FieldValue.serverTimestamp()
  };

  const ref = await submissionsCollection(uid).add(write);
  const snapshot = await ref.get();

  return toExerciseSubmission(ref.id, snapshot.data() as ReadExerciseSubmission);
}

export async function listExerciseSubmissions(
  uid: string,
  exerciseId: string
): Promise<ExerciseSubmission[]> {
  const snapshot = await submissionsCollection(uid)
    .where('exerciseId', '==', exerciseId)
    .orderBy('created', 'desc')
    .get();

  return snapshot.docs.map((doc) =>
    toExerciseSubmission(doc.id, doc.data() as ReadExerciseSubmission)
  );
}
