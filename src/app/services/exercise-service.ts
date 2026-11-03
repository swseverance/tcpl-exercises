import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseFinal } from '../../models/exercise';
import { ExerciseDraft } from '../../models/exercise-draft';
import { ExerciseSubmission } from '../../models/exercise-submission';
import { ExerciseTestResultsResponse } from '../../models/exercise-test-results';

@Service()
export class ExerciseService {
  private readonly http = inject(HttpClient);

  getExercsise(exerciseId: string, authenticated: boolean): Observable<ExerciseFinal> {
    return this.http.get<ExerciseFinal>(
      `/api/${authenticated ? 'private' : 'public'}/exercises/${exerciseId}`
    );
  }

  getDraft(exerciseId: string): Observable<ExerciseDraft> {
    return this.http.get<ExerciseDraft>(`/api/private/exercises/${exerciseId}/draft`);
  }

  saveDraft(exerciseId: string, code: string): Observable<ExerciseDraft> {
    return this.http.put<ExerciseDraft>(`/api/private/exercises/${exerciseId}/draft`, { code });
  }

  submit(exerciseId: string, code: string): Observable<ExerciseSubmission> {
    return this.http.post<ExerciseSubmission>(`/api/private/exercises/${exerciseId}/submit`, {
      code
    });
  }

  listSubmissions(exerciseId: string): Observable<ExerciseSubmission[]> {
    return this.http.get<ExerciseSubmission[]>(`/api/private/exercises/${exerciseId}/submissions`);
  }

  getTestResults(exerciseId: string): Observable<ExerciseTestResultsResponse> {
    return this.http.get<ExerciseTestResultsResponse>(
      `/api/private/exercises/${exerciseId}/test-results`
    );
  }
}
