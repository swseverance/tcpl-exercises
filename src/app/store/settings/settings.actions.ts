import { createAction, props } from '@ngrx/store';
import { ThemeName } from '../../services/theme';

export const setTheme = createAction('Set Theme', props<{ name: ThemeName }>());
