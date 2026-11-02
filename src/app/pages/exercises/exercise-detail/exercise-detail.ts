import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AppFacade } from '../../../store/app.facade';

@Component({
  selector: 'app-exercise-detail',
  imports: [NzButtonModule],
  templateUrl: './exercise-detail.html'
})
export class ExerciseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private facade = inject(AppFacade);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((paramMap) => this.facade.loadExerciseDraft(paramMap.get('id') as string));
  }
}
