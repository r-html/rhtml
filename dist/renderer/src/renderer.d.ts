import { LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-renderer
 */
export declare class Renderer extends LitElement {
    options: any;
    private loading;
    private error;
    private state;
    private subscription;
    OnUpdateFirst(): void;
    private isObservable;
    private isFunction;
    OnDestroy(): void;
}