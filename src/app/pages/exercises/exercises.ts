import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Chapter } from '../../../shared/models';
import { AppFacade } from '../../store/app.facade';

type ExerciseStatus = Chapter['exercises'][number]['status'];

@Component({
  selector: 'app-exercises',
  imports: [RouterLink, RouterOutlet, NzMenuModule, AsyncPipe, NzTagModule],
  styleUrl: './exercises.scss',
  templateUrl: './exercises.html'
})
export class Exercises {
  protected readonly facade = inject(AppFacade);
  protected readonly chapters$ = this.facade.chapters$;

  protected statusLabel(status: ExerciseStatus): string {
    switch (status) {
      case 'passed':
        return 'P';
      case 'failed':
        return 'F';
      default:
        return '—';
    }
  }

  protected statusColor(status: ExerciseStatus): string | undefined {
    switch (status) {
      case 'passed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return undefined;
    }
  }
}
