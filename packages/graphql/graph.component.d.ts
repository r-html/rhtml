import { LitElement } from '@rxdi/lit-html';
import { GraphOptions } from './types';
/**
 * @customElement r-graph
 */
export declare class GraphComponent<T = any> extends LitElement {
    options: GraphOptions<T>;
    private graphql;
    private loading;
    private error;
    private subscription;
    private pubsubSubscription;
    private result;
    OnUpdateFirst(): void;
    OnDestroy(): void;
    private query;
    isPrimitive(test: any): boolean;
}
