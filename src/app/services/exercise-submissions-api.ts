import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseSubmission } from '../../models/exercise-submission';

@Service()
export class ExerciseSubmissionsApi {
  private readonly http = inject(HttpClient);

  submit(exerciseId: string, code: string): Observable<ExerciseSubmission> {
    return this.http.post<ExerciseSubmission>(`/api/exercises/${exerciseId}/submit`, { code });
  }

  list(exerciseId: string): Observable<ExerciseSubmission[]> {
    return this.http.get<ExerciseSubmission[]>(`/api/exercises/${exerciseId}/submissions`);
  }
}
