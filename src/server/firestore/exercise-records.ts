import { getFirestore } from 'firebase-admin/firestore';
import { ExerciseRecord } from '../../models/exercise-record';

function exerciseRecordRef(uid: string, exerciseId: string) {
  return getFirestore().doc(`users/${uid}/exercises/${exerciseId}`);
}

export async function saveExerciseRecordCode(
  uid: string,
  exerciseId: string,
  code: string
): Promise<ExerciseRecord> {
  await exerciseRecordRef(uid, exerciseId).set({ code }, { merge: true });

  return { id: exerciseId, code };
}
