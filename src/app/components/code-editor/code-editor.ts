import { Component } from '@angular/core';
import { Annotation } from '@codemirror/state';

// Tags a transaction as a programmatic sync (e.g. loading a draft) rather than a
// real keystroke, so the update listener below doesn't echo it back out as an edit.
const externalUpdate = Annotation.define<boolean>();

@Component({
  selector: 'app-code-editor',
  template: '<div #host></div>',
  styleUrl: './code-editor.scss'
})
export class CodeEditor {
  // readonly code = model.required<string>();
  // private readonly theme = toSignal(inject(AppFacade).theme$, { initialValue: 'light' });
  // private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  // private readonly themeCompartment = new Compartment();
  // private view?: EditorView;
  // constructor() {
  //   afterNextRender(() => {
  //     this.view = new EditorView({
  //       doc: this.code(),
  //       extensions: [
  //         basicSetup,
  //         cpp(),
  //         EditorView.updateListener.of((update) => {
  //           const isExternal = update.transactions.some((tr) => tr.annotation(externalUpdate));
  //           if (update.docChanged && !isExternal) {
  //             this.code.set(update.state.doc.toString());
  //           }
  //         }),
  //         this.themeCompartment.of(this.theme() === 'dark' ? oneDark : [])
  //       ],
  //       parent: this.host().nativeElement
  //     });
  //   });
  //   effect(() => {
  //     const isDark = this.theme() === 'dark';
  //     this.view?.dispatch({
  //       effects: this.themeCompartment.reconfigure(isDark ? oneDark : [])
  //     });
  //   });
  //   effect(() => {
  //     const code = this.code();
  //     const view = this.view;
  //     if (view && code !== view.state.doc.toString()) {
  //       view.dispatch({
  //         changes: { from: 0, to: view.state.doc.length, insert: code },
  //         annotations: externalUpdate.of(true)
  //       });
  //     }
  //   });
  //   inject(DestroyRef).onDestroy(() => this.view?.destroy());
  // }
}
