import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RunCRequest, RunCResponse } from '../../models/run-c';

@Injectable({ providedIn: 'root' })
export class CodeRunner {
  private readonly http = inject(HttpClient);

  run(code: string): Observable<RunCResponse> {
    return this.http.post<RunCResponse>('/api/run-c', { code } satisfies RunCRequest);
  }
}
