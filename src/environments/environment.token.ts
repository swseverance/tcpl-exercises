import { InjectionToken } from '@angular/core';
import { environment } from './environment';
import { Environment } from './environment.interface';

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT', {
  providedIn: 'root',
  factory: () => environment
});
