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
    error?: (e: any) => TemplateResult;
    loading?: () => TemplateResult;
}
export interface GraphOptions<T = any> extends OptionalProperties {
    fetch: any;
    state?: any;
    settings?: Settings;
    subscribe?: any;
    defaultConfig?: boolean;
    render(state: {
        data: T;
    }, setState: (res: T) => void): TemplateResult;
}
