import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EXERCISE_IDS } from '../../shared/exercise-ids';

export const exerciseExistsGuard: CanActivateFn = (route) => {
  const id = route.paramMap.get('id');

  if (id && EXERCISE_IDS.includes(id)) {
    return true;
  }

  return inject(Router).parseUrl('/exercises/1-1');
};
