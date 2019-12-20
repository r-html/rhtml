import { Component, html, LitElement, property } from '@rxdi/lit-html';

@Component({
  selector: 'r-prop',
  template: () => html`
    <slot></slot>
  `
})
export class RPropOperator extends LitElement {
  @property()
  key: string;

  @property()
  type: string;
}
