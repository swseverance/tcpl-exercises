import { ThemeName } from '../../services/theme';

export type SettingsState = {
  theme: ThemeName;
};

export const initialSettingsState: SettingsState = {
  theme: 'light'
};
