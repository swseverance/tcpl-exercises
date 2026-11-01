import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CHAPTERS } from '../../../exercises';

@Component({
  selector: 'app-exercises',
  imports: [RouterLink, RouterOutlet, NzMenuModule],
  styleUrl: './exercises.scss',
  templateUrl: './exercises.html'
})
export class Exercises {
  protected readonly chapters = CHAPTERS;
}
