import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Provider } from '@angular/core';
import { ActionReducer, META_REDUCERS } from '@ngrx/store';
import { environment } from '../../environments/environment';

function logMetaReducer<T>(reducer: ActionReducer<T>): ActionReducer<T> {
  return (state, action) => {
    const { type, ...payload } = action;

    const nextState = reducer(state, action);

    console.log(
      '%c %s ',
      'background: #ffd6f6; color: #7b1fa2; font-weight: bold; border-radius: 3px;',
      type,
      payload,
      nextState
    );

    return nextState;
  };
}

/**
 * Only logs in the browser, in non-prod environments. Resolved once at
 * injector construction via META_REDUCERS rather than checking the platform
 * on every dispatched action — on the server (including ng build's internal
 * prerender pass) this becomes a plain identity function, so console.log
 * never runs there and can't break App Hosting's build adapter, which
 * expects clean JSON on ng build's stdout.
 */
export function provideLogMetaReducer(): Provider {
  return {
    provide: META_REDUCERS,
    multi: true,
    useFactory: () => {
      const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
      return isBrowser && environment.name !== 'prod'
        ? logMetaReducer
        : <T>(reducer: ActionReducer<T>) => reducer;
    }
  };
}
