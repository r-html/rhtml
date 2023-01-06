/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ErrorPolicy,
  FetchPolicy,
} from '@apollo/client/core/watchQueryOptions';
import { CSSResult, TemplateResult } from '@rxdi/lit-html';
import { DocumentNode } from 'graphql';

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
export interface GraphOptions<T = any> extends OptionalProperties {
  fetch: any;
  state?: any;
  settings?: Settings;
  style?: CSSResult;
  subscribe?: any;
  defaultConfig?: boolean;
  render(
    state: { data: T },
    setState: (res: T) => void,
    shadowRoot: ShadowRoot
  ): TemplateResult;
}
