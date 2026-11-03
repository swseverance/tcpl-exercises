import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExerciseTestCaseFinal } from '../../../models/exercise';
import { Whitespace } from '../whitespace/whitespace';

@Component({
  selector: 'app-test-cases',
  imports: [NzTableModule, NzTagModule, Whitespace],
  template: `
    <nz-table
      [nzData]="tests()"
      [nzShowPagination]="false"
      nzSize="small"
      nzTitle="Test Cases"
      nzNoResult="No test cases"
    >
      <thead>
        <tr>
          <th>stdin</th>
          <th>expected stdout</th>
          <th>actual stdout</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        @for (test of tests(); track test.id) {
          <tr>
            <td><app-whitespace [text]="test.stdin || '(none)'" /></td>
            <td><app-whitespace [text]="test.expectedStdout" /></td>
            <td>
              @if (test.status === 'indeterminate') {
                —
              } @else {
                <app-whitespace [text]="test.actualStdout" />
              }
            </td>
            <td>
              <nz-tag [nzColor]="statusColor(test.status)">{{ statusLabel(test.status) }}</nz-tag>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class TestCases {
  tests = input.required<ExerciseTestCaseFinal[]>();

  protected statusLabel(status: ExerciseTestCaseFinal['status']): string {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'failed':
        return 'Failed';
      default:
        return '—';
    }
  }

  protected statusColor(status: ExerciseTestCaseFinal['status']): string | undefined {
    switch (status) {
      case 'passed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return undefined;
    }
  }
}
