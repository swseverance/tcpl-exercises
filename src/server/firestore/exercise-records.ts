import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { ExerciseRecord, ExerciseRecordTestResult } from '../../models/exercise-record';

type WriteExerciseRecord = {
  code: string;
  tests: Record<string, ExerciseRecordTestResult>;
  created: FieldValue;
  lastUpdated: FieldValue;
};

type UpdateExerciseRecord = {
  code: string;
  lastUpdated: FieldValue;
};

type UpdateExerciseRecordWithTests = {
  code: string;
  tests: Record<string, ExerciseRecordTestResult>;
  lastUpdated: FieldValue;
};

type ReadExerciseRecord = {
  code: string;
  tests: Record<string, ExerciseRecordTestResult>;
  created: Timestamp;
  lastUpdated: Timestamp;
};

function exerciseRecordRef(uid: string, exerciseId: string) {
  return getFirestore().doc(`users/${uid}/exercises/${exerciseId}`);
}

export async function saveExerciseRecordCode(
  uid: string,
  exerciseId: string,
  code: string
): Promise<ExerciseRecord> {
  const ref = exerciseRecordRef(uid, exerciseId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    const write: WriteExerciseRecord = {
      code,
      tests: {},
      created: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    };
    await ref.set(write);

    return { id: exerciseId, code, tests: {} };
  }

  const update: UpdateExerciseRecord = {
    code,
    lastUpdated: FieldValue.serverTimestamp()
  };
  await ref.update(update);

  const tests = (snapshot.data() as ReadExerciseRecord).tests;

  return { id: exerciseId, code, tests };
}

export async function saveExerciseRecordSubmission(
  uid: string,
  exerciseId: string,
  code: string,
  tests: Record<string, ExerciseRecordTestResult>
): Promise<ExerciseRecord> {
  const ref = exerciseRecordRef(uid, exerciseId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    const write: WriteExerciseRecord = {
      code,
      tests,
      created: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    };
    await ref.set(write);
  } else {
    const update: UpdateExerciseRecordWithTests = {
      code,
      tests,
      lastUpdated: FieldValue.serverTimestamp()
    };
    await ref.update(update);
  }

  return { id: exerciseId, code, tests };
}

export async function getExerciseRecord(
  uid: string,
  exerciseId: string
): Promise<ExerciseRecord | undefined> {
  const snapshot = await exerciseRecordRef(uid, exerciseId).get();
  const data = snapshot.data() as ReadExerciseRecord | undefined;

  if (!data) {
    return undefined;
  }

  return { id: exerciseId, code: data.code, tests: data.tests };
}
