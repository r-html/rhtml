import { LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-lens
 */
export declare class LensComponent extends LitElement {
    match: string;
    get: (number | string | Function)[];
    ray: <T>(res: T) => T;
}
