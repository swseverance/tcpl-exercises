import { Component, computed, input } from '@angular/core';
import { EXERCISES_BY_ID } from '../../../../exercises';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.html'
})
export class ExerciseDetail {
  readonly id = input.required<string>();

  protected readonly exercise = computed(() => EXERCISES_BY_ID[this.id()]);
}
