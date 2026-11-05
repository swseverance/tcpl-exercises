import { SessionUser } from '../../../shared/models';

export type AuthState = {
  user: SessionUser | null;
};

export const initialAuthState: AuthState = {
  user: null
};
