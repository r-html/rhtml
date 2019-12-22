import { Component, html, LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-key
 */
@Component({
  selector: 'r-key',
  template: () => html`
    <slot></slot>
  `
})
export class RKeyOperator extends LitElement {}
