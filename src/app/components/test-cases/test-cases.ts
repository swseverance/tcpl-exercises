import { Component, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExerciseTestCase } from '../../../models/exercise';
import { TestResult } from '../../store/app.state';
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
          <th>passed</th>
        </tr>
      </thead>
      <tbody>
        @for (test of tests(); track test.id) {
          <tr>
            <td><app-whitespace [text]="test.stdin || '(none)'" /></td>
            <td><app-whitespace [text]="test.expectedStdout" /></td>
            <td>
              @let stdout = results()[test.id]?.stdout;
              @if (stdout !== null && stdout !== undefined) {
                <app-whitespace [text]="stdout" />
              } @else {
                —
              }
            </td>
            <td>
              <nz-tag [nzColor]="passedColor(test.id)">{{ passedLabel(test.id) }}</nz-tag>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class TestCases {
  tests = input.required<ExerciseTestCase[]>();
  results = input<Record<string, TestResult>>({});

  protected passedLabel(id: string): string {
    const passed = this.results()[id]?.passed;

    if (passed === true) {
      return 'Passed';
    }

    if (passed === false) {
      return 'Failed';
    }

    return '—';
  }

  protected passedColor(id: string): string | undefined {
    const passed = this.results()[id]?.passed;

    if (passed === true) {
      return 'success';
    }

    if (passed === false) {
      return 'error';
    }

    return undefined;
  }
}
