import { LitElement } from '@rxdi/lit-html';
export declare class LitServiceElement<T = {}> extends LitElement {
    run: (self: T) => void;
    OnUpdateFirst(): void;
}
