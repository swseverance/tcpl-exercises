import { ActionReducer } from '@ngrx/store';

export function logMetaReducer<T>(reducer: ActionReducer<T>): ActionReducer<T> {
  return (state, action) => {
    console.log('%c%s', 'background: orange; color: white;', action.type);
    return reducer(state, action);
  };
}
