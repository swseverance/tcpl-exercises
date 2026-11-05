import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import en from '@angular/common/locales/en';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  GithubOutline,
  LoginOutline,
  LogoutOutline,
  MoonOutline,
  SunOutline
} from '@ant-design/icons-angular/icons';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { recaptchaInterceptor } from './interceptors/recaptcha.interceptor';
import { AppEffects } from './store/app.effects';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { authReducer } from './store/auth/auth.reducer';
import { ExerciseEffects } from './store/exercise/exercise.effects';
import { exerciseReducer } from './store/exercise/exercise.reducer';
import { provideLogMetaReducer } from './store/log.meta-reducer';
import { SettingsEffects } from './store/settings/settings.effects';
import { settingsReducer } from './store/settings/settings.reducer';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideNzI18n(en_US),
    provideNzDateFnsAdapter(),
    provideNzIcons([GithubOutline, LoginOutline, LogoutOutline, MoonOutline, SunOutline]),
    provideHttpClient(withFetch(), withInterceptors([recaptchaInterceptor, authInterceptor])),
    importProvidersFrom(NzModalModule),
    provideStore({
      app: appReducer,
      exercise: exerciseReducer,
      auth: authReducer,
      settings: settingsReducer
    }),
    provideLogMetaReducer(),
    provideEffects(AppEffects, AuthEffects, ExerciseEffects, SettingsEffects)
  ]
};
