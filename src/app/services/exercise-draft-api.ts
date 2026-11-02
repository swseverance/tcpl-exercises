import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseDraft } from '../../models/exercise-draft';

@Service()
export class ExerciseDraftApi {
  private readonly http = inject(HttpClient);

  get(exerciseId: string): Observable<ExerciseDraft | null> {
    return this.http.get<ExerciseDraft | null>(`/api/exercises/${exerciseId}/draft`);
  }

  save(exerciseId: string, code: string): Observable<ExerciseDraft> {
    return this.http.put<ExerciseDraft>(`/api/exercises/${exerciseId}/draft`, { code });
  }
}
