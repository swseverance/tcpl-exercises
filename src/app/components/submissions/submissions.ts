import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExerciseSubmission } from '../../../models/exercise-submission';
import { RunCResponse } from '../../../models/run-c';

@Component({
  selector: 'app-submissions',
  imports: [DatePipe, NzListModule, NzEmptyModule, NzTagModule],
  template: `
    @if (submissions().length > 0) {
      <nz-list>
        @for (submission of submissions(); track submission.id) {
          <nz-list-item>
            <nz-list-item-meta
              [nzTitle]="(submission.created | date: 'medium') ?? ''"
              [nzDescription]="submission.result.stage"
            />
            <nz-tag [nzColor]="statusColor(submission.result)">
              {{ statusLabel(submission.result) }}
            </nz-tag>
          </nz-list-item>
        }
      </nz-list>
    } @else {
      <nz-empty nzNotFoundContent="No submissions yet" />
    }
  `
})
export class Submissions {
  submissions = input.required<ExerciseSubmission[]>();

  protected statusLabel(result: RunCResponse): string {
    if (result.timedOut) {
      return 'Timed Out';
    }

    if (result.stage === 'compile') {
      return 'Compile Error';
    }

    return result.exitCode === 0 ? 'Ran Successfully' : 'Runtime Error';
  }

  protected statusColor(result: RunCResponse): string {
    return !result.timedOut && result.stage === 'run' && result.exitCode === 0
      ? 'success'
      : 'error';
  }
}
