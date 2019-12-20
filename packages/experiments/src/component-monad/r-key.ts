import { Component, html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'r-key',
  template: () => html`
    <slot></slot>
  `
})
export class RKeyOperator extends LitElement {}
