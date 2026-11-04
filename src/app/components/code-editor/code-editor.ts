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
import { indentWithTab } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import { indentUnit } from '@codemirror/language';
import { Compartment, Transaction } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import { ThemeName } from '../../services/theme';
import { SkeletonCodeEditor } from '../skeleton-code-editor/skeleton-code-editor';

@Component({
  selector: 'app-code-editor',
  imports: [SkeletonCodeEditor],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss'
})
export class CodeEditor implements AfterViewInit, OnChanges, OnDestroy {
  loaded = false;

  private _code = '';

  @Input() set code(code: string) {
    this._code = code ?? '';
  }

  get code() {
    return this._code;
  }

  private _theme: ThemeName = 'light';

  @Input() set theme(theme: ThemeName) {
    this._theme = theme ?? 'light';
  }

  get theme() {
    return this._theme;
  }

  @Output() codeChange = new EventEmitter<string>();

  @Output() readonly ready = new EventEmitter<void>();

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
        keymap.of([indentWithTab]),
        indentUnit.of('  '),
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

    this.loaded = true;
    this.ready.emit();
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

  getCode(): string {
    return this.view?.state.doc.toString() ?? this.code;
  }

  private darkTheme(): boolean {
    return this.theme === 'dark';
  }
}
