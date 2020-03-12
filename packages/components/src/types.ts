import { TemplateResult } from '@rxdi/lit-html';
import { ErrorPolicy, FetchPolicy } from 'apollo-client';
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RenderOptions<T = any> extends OptionalProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any;
  settings?: Settings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe?: any;
  render(state: T, setState: (res: T) => void): TemplateResult;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GraphOptions<T = any> extends RenderOptions<T> {
  fetch: string;
}
