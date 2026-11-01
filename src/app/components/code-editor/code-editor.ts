import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  model,
  viewChild
} from '@angular/core';
import { cpp } from '@codemirror/lang-cpp';
import { Compartment } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup, EditorView } from 'codemirror';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-code-editor',
  template: '<div #host></div>',
  styleUrl: './code-editor.scss'
})
export class CodeEditor {
  readonly code = model.required<string>();

  private readonly theme = inject(Theme);
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  private readonly themeCompartment = new Compartment();
  private view?: EditorView;

  constructor() {
    afterNextRender(() => {
      this.view = new EditorView({
        doc: this.code(),
        extensions: [
          basicSetup,
          cpp(),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              this.code.set(update.state.doc.toString());
            }
          }),
          this.themeCompartment.of(this.theme.theme() === 'dark' ? oneDark : [])
        ],
        parent: this.host().nativeElement
      });
    });

    effect(() => {
      const isDark = this.theme.theme() === 'dark';

      this.view?.dispatch({
        effects: this.themeCompartment.reconfigure(isDark ? oneDark : [])
      });
    });

    effect(() => {
      const code = this.code();
      const view = this.view;

      if (view && code !== view.state.doc.toString()) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: code }
        });
      }
    });

    inject(DestroyRef).onDestroy(() => this.view?.destroy());
  }
}
