import { Component, html, LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-type
 */
@Component({
  selector: 'r-type',
  template: () => html` <slot></slot> `,
})
export class RTypeOperator extends LitElement {}
