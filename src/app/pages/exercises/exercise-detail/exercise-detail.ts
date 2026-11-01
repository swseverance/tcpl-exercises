import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EXERCISES_BY_ID } from '../../../../exercises';
import { STARTER_CODE } from '../../../../models/exercise';
import { RunCResponse } from '../../../../models/run-c';
import { CodeEditor } from '../../../components/code-editor/code-editor';
import { CodeRunner } from '../../../services/code-runner';
import { CurrentUser } from '../../../services/current-user';
import { ExerciseDrafts } from '../../../services/exercise-drafts';
import { SignInPrompt } from '../../../services/sign-in-prompt';

@Component({
  selector: 'app-exercise-detail',
  imports: [CodeEditor, NzButtonModule],
  templateUrl: './exercise-detail.html'
})
export class ExerciseDetail {
  readonly id = input.required<string>();

  private readonly drafts = inject(ExerciseDrafts);
  private readonly codeRunner = inject(CodeRunner);
  private readonly signInPrompt = inject(SignInPrompt);
  protected readonly currentUser = inject(CurrentUser);

  protected readonly exercise = computed(() => EXERCISES_BY_ID[this.id()]);
  protected readonly code = linkedSignal(
    () => this.drafts.load(this.exercise().id) ?? STARTER_CODE
  );

  protected readonly running = signal(false);
  protected readonly result = signal<RunCResponse | null>(null);

  constructor() {
    effect(() => this.drafts.save(this.exercise().id, this.code()));
  }

  protected submit(): void {
    const user = this.currentUser.user();

    if (!user) {
      this.signInPrompt.open();
      return;
    }

    this.running.set(true);
    this.result.set(null);

    this.codeRunner.run(this.code()).subscribe({
      next: (result) => {
        this.result.set(result);
        this.running.set(false);
      },
      error: () => {
        this.running.set(false);
      }
    });
  }
}
