import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ExerciseTestCase } from '../../../models/exercise';

@Component({
  selector: 'app-test-cases',
  imports: [NzTableModule],
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
            <td>
              <pre>{{ test.stdin || '(none)' }}</pre>
            </td>
            <td>
              <pre>{{ test.expectedStdout }}</pre>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `,
  styleUrl: './test-cases.scss'
})
export class TestCases {
  tests = input.required<ExerciseTestCase[]>();
}
