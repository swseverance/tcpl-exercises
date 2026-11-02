import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ExerciseTestCase } from '../../../models/exercise';
import { Whitespace } from '../whitespace/whitespace';

@Component({
  selector: 'app-test-cases',
  imports: [NzTableModule, Whitespace],
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
        </tr>
      </thead>
      <tbody>
        @for (test of tests(); track test.id) {
          <tr>
            <td><app-whitespace [text]="test.stdin || '(none)'" /></td>
            <td><app-whitespace [text]="test.expectedStdout" /></td>
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class TestCases {
  tests = input.required<ExerciseTestCase[]>();
}
