import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExerciseSubmission } from '../../../models/exercise-submission';
import { RunCResponse } from '../../../models/run-c';

@Component({
  selector: 'app-submissions',
  imports: [DatePipe, NzTableModule, NzTagModule],
  template: `
    <nz-table
      [nzData]="submissions()"
      [nzShowPagination]="false"
      nzSize="small"
      nzTitle="Submission History"
      nzNoResult="No submissions yet"
    >
      <thead>
        <tr>
          <th>Submitted</th>
          <th>Stage</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        @for (submission of submissions(); track submission.id) {
          <tr>
            <td>{{ submission.created | date: 'medium' }}</td>
            <td>{{ submission.result.stage }}</td>
            <td>
              <nz-tag [nzColor]="statusColor(submission.result)">
                {{ statusLabel(submission.result) }}
              </nz-tag>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
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
