import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseDraft, SaveExerciseDraftsResult } from '../../models/exercise-draft';
import { ExerciseSubmission } from '../../models/exercise-submission';

@Service()
export class ExerciseService {
  private readonly http = inject(HttpClient);

  getDraft(exerciseId: string): Observable<ExerciseDraft> {
    return this.http.get<ExerciseDraft>(`/api/exercises/${exerciseId}/draft`);
  }

  saveDrafts(drafts: ExerciseDraft[]): Observable<SaveExerciseDraftsResult> {
    return this.http.put<SaveExerciseDraftsResult>('/api/exercises/drafts', { drafts });
  }

  submit(exerciseId: string, code: string): Observable<ExerciseSubmission> {
    return this.http.post<ExerciseSubmission>(`/api/exercises/${exerciseId}/submit`, { code });
  }

  listSubmissions(exerciseId: string): Observable<ExerciseSubmission[]> {
    return this.http.get<ExerciseSubmission[]>(`/api/exercises/${exerciseId}/submissions`);
  }
}
