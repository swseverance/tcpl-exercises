import { Routes } from '@angular/router';
import { exerciseExistsGuard } from './guards/exercise-exists.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home)
  },
  {
    path: 'exercises',
    loadComponent: () => import('./pages/exercises/exercises').then((m) => m.Exercises),
    children: [
      { path: '', redirectTo: '1-1', pathMatch: 'full' },
      {
        path: ':id',
        canActivate: [exerciseExistsGuard],
        loadComponent: () =>
          import('./pages/exercise-detail/exercise-detail').then((m) => m.ExerciseDetail)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
