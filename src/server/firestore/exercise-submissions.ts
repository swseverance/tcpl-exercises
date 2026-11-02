import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { ExerciseSubmission, ExerciseTestResult } from '../../models/exercise-submission';
import { RunCResponse } from '../../models/run-c';

type CreateExerciseSubmissionArgs = {
  exerciseId: string;
  code: string;
  compile: RunCResponse;
  results: ExerciseTestResult[];
  overallPassed: boolean;
  testsHash: string;
};

type WriteExerciseSubmission = {
  exerciseId: string;
  code: string;
  compile: RunCResponse;
  results: ExerciseTestResult[];
  overallPassed: boolean;
  testsHash: string;
  created: FieldValue;
};

// `compile`/`results`/`overallPassed`/`testsHash` are optional here (unlike
// WriteExerciseSubmission) because docs written before grading existed only
// have the old `result: RunCResponse` field and none of these.
type ReadExerciseSubmission = {
  exerciseId: string;
  code: string;
  compile?: RunCResponse;
  results?: ExerciseTestResult[];
  overallPassed?: boolean;
  testsHash?: string;
  created: Timestamp;
};

const UNGRADED_COMPILE: RunCResponse = {
  stage: 'compile',
  stdout: '',
  stderr: '',
  exitCode: null,
  timedOut: false
};

function submissionsCollection(uid: string) {
  return getFirestore().collection(`users/${uid}/submissions`);
}

function toExerciseSubmission(id: string, data: ReadExerciseSubmission): ExerciseSubmission {
  return {
    id,
    exerciseId: data.exerciseId,
    code: data.code,
    compile: data.compile ?? UNGRADED_COMPILE,
    results: data.results ?? [],
    overallPassed: data.overallPassed ?? false,
    testsHash: data.testsHash ?? '',
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
    compile: args.compile,
    results: args.results,
    overallPassed: args.overallPassed,
    testsHash: args.testsHash,
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

export async function getLatestExerciseSubmission(
  uid: string,
  exerciseId: string
): Promise<ExerciseSubmission | null> {
  const snapshot = await submissionsCollection(uid)
    .where('exerciseId', '==', exerciseId)
    .orderBy('created', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return toExerciseSubmission(doc.id, doc.data() as ReadExerciseSubmission);
}
