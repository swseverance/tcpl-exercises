import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EXERCISES_BY_ID } from '../../../exercises';

export const exerciseExistsGuard: CanActivateFn = (route) => {
  const id = route.paramMap.get('id');

  if (id && EXERCISES_BY_ID[id]) {
    return true;
  }

  return inject(Router).parseUrl('/exercises/1-1');
};
