import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { GithubOutline, MoonOutline, SunOutline } from '@ant-design/icons-angular/icons';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { routes } from './app.routes';
import { recaptchaInterceptor } from './interceptors/recaptcha.interceptor';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideNzI18n(en_US),
    provideNzDateFnsAdapter(),
    provideNzIcons([GithubOutline, MoonOutline, SunOutline]),
    provideHttpClient(withFetch(), withInterceptors([recaptchaInterceptor]))
  ]
};
