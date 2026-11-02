import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectId = createSelector(selectAppState, (state) => state.id);

export const selectPendingChanges = createSelector(selectAppState, (state) => state.pendingChanges);

export const selectTheme = createSelector(selectAppState, (state) => state.theme);

export const selectDrafts = createSelector(selectAppState, (state) => state.draft);

export const selectDraft = createSelector(selectId, selectDrafts, (id, drafts) =>
  id ? drafts[id] : undefined
);
