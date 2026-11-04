import { Component, input } from '@angular/core';

@Component({
  selector: 'app-panel',
  template: `
    @if (heading()) {
      <h2 class="panel-title">{{ heading() }}</h2>
    }
    <ng-content />
  `,
  styleUrl: './panel.scss'
})
export class Panel {
  heading = input<string>();
}
