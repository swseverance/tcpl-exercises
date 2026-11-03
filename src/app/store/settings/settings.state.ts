import { ThemeName } from '../../services/theme';

export type SettingsState = {
  theme: ThemeName | null;
};

export const initialSettingsState: SettingsState = {
  theme: null
};
