import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExerciseTestCase } from '../../../shared/models';
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
              @if (submissionPending()) {
                <nz-tag nzColor="processing">Pending...</nz-tag>
              } @else {
                <nz-tag [nzColor]="statusColors[test.status]">{{
                  statusLabels[test.status]
                }}</nz-tag>
              }
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class TestCases {
  tests = input.required<ExerciseTestCase[]>();

  submissionPending = input.required<boolean>();

  protected readonly statusLabels: Record<ExerciseTestCase['status'], string> = {
    passed: 'Passed',
    failed: 'Failed',
    indeterminate: '—'
  };

  protected readonly statusColors: Record<ExerciseTestCase['status'], string | undefined> = {
    passed: 'success',
    failed: 'error',
    indeterminate: undefined
  };
}
