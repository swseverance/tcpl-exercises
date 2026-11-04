import { Component, input } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExerciseTestCase } from '../../../shared/models';
import { TestCaseIo } from '../test-case-io/test-case-io';

@Component({
  selector: 'app-test-cases',
  imports: [NzCollapseModule, NzDividerModule, NzTagModule, TestCaseIo],
  template: `
    <div class="header">
      <h2 class="section-title">Test Cases</h2>
      @if (tests().length > 0) {
        <div class="legend">
          <span class="legend-item"><span class="space">S</span> space</span>
          <span class="legend-item"><span class="tab">T</span> tab</span>
          <span class="legend-item"><span class="newline">N</span> newline</span>
        </div>
      }
    </div>

    @if (tests().length === 0) {
      <p class="empty">No test cases</p>
    } @else {
      <nz-collapse>
        @for (test of tests(); track test.id; let i = $index) {
          <nz-collapse-panel [nzHeader]="'Test Case ' + (i + 1)" [nzExtra]="statusTpl">
            <app-test-case-io [rows]="[{ label: 'stdin', text: test.stdin }]" />

            <nz-divider />

            <app-test-case-io
              [rows]="[
                { label: 'stdout (expected)', text: test.expectedStdout },
                {
                  label: 'stdout (actual)',
                  text: test.actualStdout,
                  pending: test.status === 'indeterminate'
                }
              ]"
              [compare]="true"
            />

            <ng-template #statusTpl>
              @if (submissionPending()) {
                <nz-tag nzColor="processing">Pending...</nz-tag>
              } @else {
                <nz-tag [nzColor]="statusColors[test.status]">{{
                  statusLabels[test.status]
                }}</nz-tag>
              }
            </ng-template>
          </nz-collapse-panel>
        }
      </nz-collapse>
    }
  `,
  styleUrl: './test-cases.scss'
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
