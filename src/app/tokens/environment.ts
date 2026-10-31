import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';
import { Environment } from '../../models/environment';

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT', {
  providedIn: 'root',
  factory: () => environment
});
