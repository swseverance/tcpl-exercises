import { Component, input } from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { ExerciseTestCase } from '../../../models/exercise';

@Component({
  selector: 'app-test-cases',
  imports: [NzListModule, NzEmptyModule],
  template: `
    @if (tests().length > 0) {
      <nz-list>
        @for (test of tests(); track test.id) {
          <nz-list-item>
            <dl class="test-case">
              <dt>stdin</dt>
              <dd>
                <pre>{{ test.stdin || '(none)' }}</pre>
              </dd>
              <dt>expected stdout</dt>
              <dd>
                <pre>{{ test.expectedStdout }}</pre>
              </dd>
            </dl>
          </nz-list-item>
        }
      </nz-list>
    } @else {
      <nz-empty nzNotFoundContent="No test cases" />
    }
  `,
  styleUrl: './test-cases.scss'
})
export class TestCases {
  tests = input.required<ExerciseTestCase[]>();
}
