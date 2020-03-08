import { LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-part
 */
export declare class MonadComponent extends LitElement {
    private options;
    private componentToRender;
    OnUpdateFirst(): Promise<void>;
    private trim;
    private applyQueries;
    private applyLenses;
    private modState;
    private findNode;
    private get;
}
