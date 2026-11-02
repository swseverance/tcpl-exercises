import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { map } from 'rxjs';
import { EXERCISES_BY_ID } from '../../../../exercises';
import { CodeEditor } from '../../../components/code-editor/code-editor';
import { Submissions } from '../../../components/submissions/submissions';
import { TestCases } from '../../../components/test-cases/test-cases';
import { AppFacade } from '../../../store/app.facade';

@Component({
  selector: 'app-exercise-detail',
  imports: [NzButtonModule, NzGridModule, CodeEditor, Submissions, TestCases, AsyncPipe],
  templateUrl: './exercise-detail.html',
  styleUrl: './exercise-detail.scss'
})
export class ExerciseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  @ViewChild(CodeEditor) private editor!: CodeEditor;

  protected readonly facade = inject(AppFacade);
  protected readonly theme$ = this.facade.theme$;
  protected readonly draft$ = this.facade.draft$;
  protected readonly submissions$ = this.facade.submissions$;
  protected readonly exercise$ = this.route.paramMap.pipe(
    map((paramMap) => EXERCISES_BY_ID[paramMap.get('id') as string])
  );

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((paramMap) => this.facade.selectExercise(paramMap.get('id') as string));
  }

  protected onCodeChange(code: string): void {
    this.facade.updateExerciseDraftCode(code);
  }

  protected onSubmit(): void {
    this.facade.submitExercise(this.editor.getCode());
  }
}
