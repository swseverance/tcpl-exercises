import { Component, computed, input } from '@angular/core';

type SegmentKind = 'text' | 'tab' | 'newline' | 'space';

type Segment = {
  text: string;
  kind: SegmentKind;
};

const ESCAPES: Partial<Record<string, { text: string; kind: SegmentKind }>> = {
  '\t': { text: '\\t', kind: 'tab' },
  '\n': { text: '\\n', kind: 'newline' },
  ' ': { text: '·', kind: 'space' }
};

function toSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let buffer = '';

  const flush = () => {
    if (buffer) {
      segments.push({ text: buffer, kind: 'text' });
      buffer = '';
    }
  };

  for (const char of text) {
    const escape = ESCAPES[char];

    if (escape) {
      flush();
      segments.push(escape);
    } else {
      buffer += char;
    }
  }

  flush();

  return segments;
}

@Component({
  selector: 'app-whitespace',
  template: `
    @for (segment of segments(); track $index) {
      <span [class]="segment.kind">{{ segment.text }}</span>
    }
  `,
  styleUrl: './whitespace.scss'
})
export class Whitespace {
  text = input.required<string>();

  protected readonly segments = computed(() => toSegments(this.text()));
}
