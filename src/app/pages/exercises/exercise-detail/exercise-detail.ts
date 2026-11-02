import { Component, computed, input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EXERCISES_BY_ID } from '../../../../exercises';

@Component({
  selector: 'app-exercise-detail',
  imports: [NzButtonModule],
  templateUrl: './exercise-detail.html'
})
export class ExerciseDetail {
  readonly id = input.required<string>();

  protected readonly exercise = computed(() => EXERCISES_BY_ID[this.id()]);

  constructor() {}

  protected submit(): void {}
}
