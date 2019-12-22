import { LitElement, TemplateResult } from '@rxdi/lit-html';
/**
 * @customElement r-component-register
 */
export declare class ComponentRegister extends LitElement {
    private components;
    OnInit(): void;
    register(template: TemplateResult): void;
}
