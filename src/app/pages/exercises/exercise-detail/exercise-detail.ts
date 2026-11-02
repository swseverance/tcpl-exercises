import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { combineLatest, filter } from 'rxjs';
import { CodeEditor } from '../../../components/code-editor/code-editor';
import { AppFacade } from '../../../store/app.facade';
import { USER$ } from '../../../tokens/firebase';

@Component({
  selector: 'app-exercise-detail',
  imports: [NzButtonModule, CodeEditor, AsyncPipe],
  templateUrl: './exercise-detail.html'
})
export class ExerciseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private facade = inject(AppFacade);
  private user$ = inject(USER$);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

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
  }
}
