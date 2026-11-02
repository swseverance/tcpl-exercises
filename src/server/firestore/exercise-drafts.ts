import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { STARTER_CODE } from '../../models/exercise';
import { ExerciseDraft } from '../../models/exercise-draft';

export type SaveExerciseDraftArgs = {
  exerciseId: string;
  code: string;
};

type WriteExerciseDraft = {
  code: string;
  created: FieldValue;
  lastUpdated: FieldValue;
};

type UpdateExerciseDraft = {
  code: string;
  lastUpdated: FieldValue;
};

type ReadExerciseDraft = {
  code: string;
  created: Timestamp;
  lastUpdated: Timestamp;
};

function draftRef(uid: string, exerciseId: string) {
  return getFirestore().doc(`users/${uid}/drafts/${exerciseId}`);
}

function toExerciseDraft(exerciseId: string, data: ReadExerciseDraft): ExerciseDraft {
  return {
    exerciseId,
    code: data.code,
    created: data.created.toDate().toISOString(),
    lastUpdated: data.lastUpdated.toDate().toISOString()
  };
}

export async function getExerciseDraft(uid: string, exerciseId: string): Promise<ExerciseDraft> {
  const snapshot = await draftRef(uid, exerciseId).get();

  if (!snapshot.exists) {
    return saveExerciseDraft(uid, { exerciseId, code: STARTER_CODE });
  }

  return toExerciseDraft(exerciseId, snapshot.data() as ReadExerciseDraft);
}

export async function saveExerciseDraft(
  uid: string,
  args: SaveExerciseDraftArgs
): Promise<ExerciseDraft> {
  const ref = draftRef(uid, args.exerciseId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    const write: WriteExerciseDraft = {
      code: args.code,
      created: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    };
    await ref.set(write);
  } else {
    const update: UpdateExerciseDraft = {
      code: args.code,
      lastUpdated: FieldValue.serverTimestamp()
    };
    await ref.update(update);
  }

  return toExerciseDraft(args.exerciseId, (await ref.get()).data() as ReadExerciseDraft);
}

export async function saveExerciseDrafts(
  uid: string,
  entries: SaveExerciseDraftArgs[]
): Promise<ExerciseDraft[]> {
  const refs = entries.map((entry) => draftRef(uid, entry.exerciseId));

  await getFirestore().runTransaction(async (transaction) => {
    const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)));
    const now = FieldValue.serverTimestamp();

    snapshots.forEach((snapshot, index) => {
      const ref = refs[index];
      const { code } = entries[index];

      if (!snapshot.exists) {
        const write: WriteExerciseDraft = { code, created: now, lastUpdated: now };
        transaction.set(ref, write);
      } else {
        const update: UpdateExerciseDraft = { code, lastUpdated: now };
        transaction.update(ref, update);
      }
    });
  });

  const saved = await Promise.all(refs.map((ref) => ref.get()));

  return saved.map((snapshot, index) =>
    toExerciseDraft(entries[index].exerciseId, snapshot.data() as ReadExerciseDraft)
  );
}
