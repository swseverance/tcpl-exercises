import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectAuthState = createSelector(selectAppState, (state) => state.auth);
export const selectAuthUser = createSelector(selectAuthState, (auth) => auth.user);
export const selectAuthStatus = createSelector(selectAuthState, (auth) => auth.status);

export const selectDraftState = createSelector(selectAppState, (state) => state.draft);
export const selectDraftCode = createSelector(selectDraftState, (draft) => draft.code);
export const selectDraftStatus = createSelector(selectDraftState, (draft) => draft.status);

export const selectSubmissionsState = createSelector(selectAppState, (state) => state.submissions);
export const selectCurrentSubmission = createSelector(
  selectSubmissionsState,
  (submissions) => submissions.current
);
export const selectSubmissionStatus = createSelector(
  selectSubmissionsState,
  (submissions) => submissions.status
);
