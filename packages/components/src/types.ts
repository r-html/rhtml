/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ErrorPolicy,
  FetchPolicy,
} from '@apollo/client/core/watchQueryOptions';
import { TemplateResult } from '@rxdi/lit-html';
import { DocumentNode } from 'graphql';

export interface Settings {
  query?: DocumentNode;
  mutation?: DocumentNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any;
  fetchPolicy?: string | FetchPolicy;
  errorPolicy?: ErrorPolicy;
  fetchResults?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
}

export interface OptionalProperties {
  error?: (e) => TemplateResult;
  loading?: () => TemplateResult;
}
export interface RenderOptions<T = any> extends OptionalProperties {
  state?: any;
  settings?: Settings;
  subscribe?: any;
  style?: any;
  render(state: T, setState: (res: T) => void): TemplateResult;
}
export interface GraphOptions<T = any> extends RenderOptions<T> {
  fetch: string;
}
