import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectId = createSelector(selectAppState, (state) => state.id);

export const selectTheme = createSelector(selectAppState, (state) => state.theme);

export const selectDraft = createSelector(selectAppState, (state) => state.draft);
