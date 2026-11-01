import { RenderMode, ServerRoute } from '@angular/ssr';
import { EXERCISES } from '../exercises';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'exercises/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return EXERCISES.map((exercise) => ({ id: exercise.id }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
