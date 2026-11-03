export type AuthState = {
  authenticated: boolean | undefined;
};

export const initialAuthState: AuthState = {
  authenticated: undefined
};
