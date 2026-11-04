import { Component, input } from '@angular/core';

@Component({
  selector: 'app-panel',
  template: `
    @if (title()) {
      <h2 class="panel-title">{{ title() }}</h2>
    }
    <ng-content />
  `,
  styleUrl: './panel.scss'
})
export class Panel {
  title = input<string>();
}
