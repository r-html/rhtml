import { Component, html, LitElement, property } from '@rxdi/lit-html';
/**
 * @customElement r-prop
 */
@Component({
  selector: 'r-prop',
  template: () => html` <slot></slot> `,
})
export class RPropOperator extends LitElement {
  @property()
  key: string;

  @property()
  type: string;
}
