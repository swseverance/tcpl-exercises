import { ActionReducer } from '@ngrx/store';

export function logMetaReducer<T>(reducer: ActionReducer<T>): ActionReducer<T> {
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
