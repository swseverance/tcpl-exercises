import { makeStateKey, StateKey } from '@angular/core';
import { Chapter } from '../../../shared/models';

export const CHAPTERS_TRANSFER_KEY: StateKey<Chapter[]> = makeStateKey<Chapter[]>('chapters');
