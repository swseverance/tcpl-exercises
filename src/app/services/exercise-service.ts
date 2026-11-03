import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseFinal } from '../../models/exercise';

@Service()
export class ExerciseService {
  private readonly http = inject(HttpClient);

  getExercsise(exerciseId: string, authenticated: boolean): Observable<ExerciseFinal> {
    return this.http.get<ExerciseFinal>(
      `/api/${authenticated ? 'private' : 'public'}/exercises/${exerciseId}`
    );
  }

  saveCode(exerciseId: string, code: string): Observable<ExerciseFinal> {
    return this.http.put<ExerciseFinal>(`/api/private/exercises/${exerciseId}/code`, { code });
  }

  submitExercise(exerciseId: string, code: string): Observable<ExerciseFinal> {
    return this.http.post<ExerciseFinal>(`/api/private/exercises/${exerciseId}/submit`, { code });
  }
}
