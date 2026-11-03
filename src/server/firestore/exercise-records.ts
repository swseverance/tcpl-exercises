import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { ExerciseRecord } from '../../models/exercise-record';

type WriteExerciseRecord = {
  code: string;
  created: FieldValue;
  lastUpdated: FieldValue;
};

type UpdateExerciseRecord = {
  code: string;
  lastUpdated: FieldValue;
};

type ReadExerciseRecord = {
  code: string;
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
      created: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    };
    await ref.set(write);
  } else {
    const update: UpdateExerciseRecord = {
      code,
      lastUpdated: FieldValue.serverTimestamp()
    };
    await ref.update(update);
  }

  return { id: exerciseId, code };
}

export async function getExerciseRecordCode(
  uid: string,
  exerciseId: string
): Promise<string | undefined> {
  const snapshot = await exerciseRecordRef(uid, exerciseId).get();

  return (snapshot.data() as ReadExerciseRecord | undefined)?.code;
}
