import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { AppCheck, initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { ENVIRONMENT } from './environment';
import { WINDOW } from './window';

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean;
  }
}

export const FIREBASE_APP = new InjectionToken<FirebaseApp | null>('FIREBASE_APP', {
  providedIn: 'root',
  factory: () => {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return null;
    }

    const { firebaseConfig } = inject(ENVIRONMENT);

    return initializeApp(firebaseConfig);
  }
});

export const AUTH = new InjectionToken<Auth | null>('AUTH', {
  providedIn: 'root',
  factory: () => {
    const app = inject(FIREBASE_APP);

    if (!app) {
      return null;
    }

    const auth = getAuth(app);

    if (inject(ENVIRONMENT).name === 'local') {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }

    return auth;
  }
});

export const FIREBASE_APP_CHECK = new InjectionToken<AppCheck | null>('FIREBASE_APP_CHECK', {
  providedIn: 'root',
  factory: () => {
    const app = inject(FIREBASE_APP);

    if (!app) {
      return null;
    }

    const { name, reCAPTCHA } = inject(ENVIRONMENT);

    if (name === 'local') {
      inject(WINDOW).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    return initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(reCAPTCHA),
      isTokenAutoRefreshEnabled: true
    });
  }
});
