import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../../shared/models';

@Service()
export class ExerciseService {
  private readonly http = inject(HttpClient);

  getExercsise(exerciseId: string, authenticated: boolean): Observable<Exercise> {
    return this.http.get<Exercise>(
      `/api/${authenticated ? 'private' : 'public'}/exercises/${exerciseId}`
    );
  }

  saveCode(exerciseId: string, code: string): Observable<Exercise> {
    return this.http.put<Exercise>(`/api/private/exercises/${exerciseId}/code`, { code });
  }

  submitExercise(exerciseId: string, code: string): Observable<Exercise> {
    return this.http.post<Exercise>(`/api/private/exercises/${exerciseId}/submit`, { code });
  }
}
