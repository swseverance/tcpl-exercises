import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { combineLatest, debounceTime, filter, Subject } from 'rxjs';
import { CodeEditor } from '../../../components/code-editor/code-editor';
import { AppFacade } from '../../../store/app.facade';
import { USER$ } from '../../../tokens/firebase';

const AUTOSAVE_INTERVAL_MS = 10_000;
const CODE_CHANGE_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-exercise-detail',
  imports: [NzButtonModule, CodeEditor, AsyncPipe],
  templateUrl: './exercise-detail.html'
})
export class ExerciseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private user$ = inject(USER$);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private codeChange$ = new Subject<string>();

  protected readonly facade = inject(AppFacade);
  protected readonly theme$ = this.facade.theme$;
  protected readonly draft$ = this.facade.draft$;

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    combineLatest([this.route.paramMap, this.user$])
      .pipe(
        filter(([, user]) => !!user),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([paramMap]) => this.facade.loadExerciseDraft(paramMap.get('id') as string));

    this.codeChange$
      .pipe(debounceTime(CODE_CHANGE_DEBOUNCE_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe((code) => this.facade.updateExerciseDraftCode(code));
  }

  protected onCodeChange(code: string): void {
    this.codeChange$.next(code);
  }
}
