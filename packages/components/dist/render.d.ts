import { LitElement, TemplateResult } from '@rxdi/lit-html';
/**
 * @customElement r-render
 */
export declare class RenderComponent extends LitElement {
    state: <T>(state: T, setState?: (res: T) => void) => TemplateResult;
}
