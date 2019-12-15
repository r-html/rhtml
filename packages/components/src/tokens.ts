import { InjectionToken } from '@rxdi/core';
import { OptionalProperties } from './types';

export const DEFAULTS = new InjectionToken<OptionalProperties>();

export interface DEFAULTS extends OptionalProperties {}
