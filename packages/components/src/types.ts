import { DocumentNode } from 'graphql';
import { ErrorPolicy, FetchPolicy } from 'apollo-client';
import { TemplateResult } from '@rxdi/lit-html';

export interface Settings {
  query?: DocumentNode;
  mutation?: DocumentNode;
  variables?: any;
  fetchPolicy?: string | FetchPolicy;
  errorPolicy?: ErrorPolicy;
  fetchResults?: boolean;
  metadata?: any;
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
  render(state: T, setState: (res: T) => void): TemplateResult;
}


export interface GraphOptions<T = any> extends RenderOptions<T> {
  fetch: string;
}
