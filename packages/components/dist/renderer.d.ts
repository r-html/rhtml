import { LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-renderer
 */
export declare class Renderer extends LitElement {
    options: any;
    private loading;
    private error;
    private subscription;
    private result;
    OnUpdateFirst(): void;
    OnDestroy(): void;
}
