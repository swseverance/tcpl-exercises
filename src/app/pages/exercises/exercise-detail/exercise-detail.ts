import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CodeEditor } from '../../../components/code-editor/code-editor';
import { AppFacade } from '../../../store/app.facade';

@Component({
  selector: 'app-exercise-detail',
  imports: [NzButtonModule, CodeEditor, AsyncPipe],
  templateUrl: './exercise-detail.html'
})
export class ExerciseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  protected readonly facade = inject(AppFacade);
  protected readonly theme$ = this.facade.theme$;
  protected readonly draft$ = this.facade.draft$;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((paramMap) => this.facade.selectExercise(paramMap.get('id') as string));
  }

  protected onCodeChange(code: string): void {
    this.facade.updateExerciseDraftCode(code);
  }
}
