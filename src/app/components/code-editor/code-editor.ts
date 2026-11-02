import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { cpp } from '@codemirror/lang-cpp';
import { Compartment, Transaction } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup, EditorView } from 'codemirror';
import { ThemeName } from '../../services/theme';

@Component({
  selector: 'app-code-editor',
  template: '<div #host></div>',
  styleUrl: './code-editor.scss'
})
export class CodeEditor implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) code!: string;
  @Input({ required: true }) theme!: ThemeName;

  @Output() codeChange = new EventEmitter<string>();

  @ViewChild('host', { static: true }) private host!: ElementRef<HTMLDivElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly themeCompartment = new Compartment();
  private view?: EditorView;

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.view = new EditorView({
      doc: this.code,
      extensions: [
        basicSetup,
        cpp(),
        EditorView.updateListener.of((update) => {
          const isUserInput = update.transactions.some(
            (tr) => tr.annotation(Transaction.userEvent) !== undefined
          );

          if (update.docChanged && isUserInput) {
            this.codeChange.emit(update.state.doc.toString());
          }
        }),
        this.themeCompartment.of(this.darkTheme() ? oneDark : [])
      ],
      parent: this.host.nativeElement
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.view) {
      return;
    }

    if (changes['theme']) {
      this.view.dispatch({
        effects: this.themeCompartment.reconfigure(this.darkTheme() ? oneDark : [])
      });
    }

    if (changes['code'] && this.code !== this.view.state.doc.toString()) {
      this.view.dispatch({
        changes: { from: 0, to: this.view.state.doc.length, insert: this.code }
      });
    }
  }

  ngOnDestroy(): void {
    this.view?.destroy();
  }

  private darkTheme(): boolean {
    return this.theme === 'dark';
  }
}
