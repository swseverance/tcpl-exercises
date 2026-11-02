import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExerciseSubmission } from '../../../models/exercise-submission';

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
          <th>Tests Passed</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        @for (submission of submissions(); track submission.id) {
          <tr>
            <td>{{ submission.created | date: 'medium' }}</td>
            <td>{{ testsPassedLabel(submission) }}</td>
            <td>
              <nz-tag [nzColor]="statusColor(submission)">
                {{ statusLabel(submission) }}
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

  protected testsPassedLabel(submission: ExerciseSubmission): string {
    if (submission.results.length === 0) {
      return '—';
    }

    const passed = submission.results.filter((result) => result.passed).length;
    return `${passed}/${submission.results.length}`;
  }

  protected statusLabel(submission: ExerciseSubmission): string {
    if (submission.compile.timedOut) {
      return 'Compile Timed Out';
    }

    if (submission.compile.exitCode !== 0) {
      return 'Compile Error';
    }

    return submission.overallPassed ? 'Passed' : 'Failed';
  }

  protected statusColor(submission: ExerciseSubmission): string {
    return submission.overallPassed ? 'success' : 'error';
  }
}
