import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

const SHOW_DELAY_MS = 150;
const MIN_VISIBLE_MS = 400;

@Component({
  selector: 'app-panel',
  template: `
    @if (heading()) {
      <div class="panel-header">
        <h2 class="panel-title">{{ heading() }}</h2>
        <div class="panel-extra">
          <ng-content select="[panel-extra]" />
        </div>
      </div>
    }
    @if (showSkeleton()) {
      <nz-skeleton [nzActive]="true" />
    } @else {
      <ng-content />
    }
  `,
  styleUrl: './panel.scss',
  imports: [NzSkeletonModule]
})
export class Panel {
  heading = input<string>();
  loading = input<boolean>();

  protected readonly showSkeleton = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private shownAt = 0;
  private visible = false;

  constructor() {
    effect(() => {
      const isLoading = this.loading();

      clearTimeout(this.showTimer);
      clearTimeout(this.hideTimer);

      if (isLoading) {
        this.showTimer = setTimeout(() => {
          this.shownAt = Date.now();
          this.visible = true;
          this.showSkeleton.set(true);
        }, SHOW_DELAY_MS);
      } else if (this.visible) {
        const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - this.shownAt));

        this.hideTimer = setTimeout(() => {
          this.visible = false;
          this.showSkeleton.set(false);
        }, remaining);
      }
    });

    this.destroyRef.onDestroy(() => {
      clearTimeout(this.showTimer);
      clearTimeout(this.hideTimer);
    });
  }
}
